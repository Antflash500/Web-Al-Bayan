<?php

namespace App\Services;

use App\Models\StudentProfile;
use App\Models\User;
use App\Repositories\StudentRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthenticationService
{
    public const OTP_TTL_SECONDS = 300;

    public const OTP_RESEND_LOCK_SECONDS = 60;

    public const OTP_MAX_ATTEMPTS = 5;

    public function __construct(private readonly StudentRepository $studentRepository) {}

    public function register(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['full_name'],
                'username' => null,
                'email' => $data['email'] ?? null,
                'password' => null,
                'role' => User::ROLE_STUDENT,
                'status' => User::STATUS_PENDING,
            ]);

            $this->studentRepository->createProfile($user, [
                'full_name' => $data['full_name'],
                'nik' => $data['nik'],
                'phone' => $data['phone'] ?? null,
                'birth_date' => $data['birth_date'],
                'gender' => $data['gender'],
                'address' => $data['address'],
                'registration_status' => StudentProfile::STATUS_PENDING,
                'agreed_terms' => true,
            ]);

            return $user;
        });
    }

    public function login(string $username, string $password): ?User
    {
        $user = User::where('username', $username)->first();

        if (! $user
            || ! Hash::check($password, $user->password)
            || $user->status !== User::STATUS_AKTIF) {
            return null;
        }

        return $user;
    }

    public function sendOtp(string $email): array
    {
        $limitKey = $this->otpLockKey($email);

        if (Cache::has($limitKey.'_reset')) {
            $remaining = Cache::get($limitKey.'_reset');

            return ['sent' => false, 'retry_after' => $remaining];
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put($this->otpKey($email), $code, now()->addSeconds(self::OTP_TTL_SECONDS));
        Cache::increment($limitKey);
        Cache::put($limitKey.'_reset', self::OTP_RESEND_LOCK_SECONDS, now()->addSeconds(self::OTP_RESEND_LOCK_SECONDS));

        // @todo Send via queue + Laravel Mail notification.
        logger()->info("OTP for {$email}: {$code}");

        return ['sent' => true, 'retry_after' => self::OTP_RESEND_LOCK_SECONDS];
    }

    public function verifyOtp(string $email, string $code): bool
    {
        $attemptKey = $this->otpAttemptsKey($email);
        $attempts = (int) Cache::get($attemptKey, 0);

        if ($attempts >= self::OTP_MAX_ATTEMPTS) {
            Cache::forget($this->otpKey($email));
            Cache::forget($attemptKey);

            return false;
        }

        $stored = Cache::get($this->otpKey($email));

        if (! $stored || ! hash_equals((string) $stored, $code)) {
            Cache::increment($attemptKey);
            Cache::put($attemptKey, $attempts + 1, now()->addSeconds(self::OTP_TTL_SECONDS));

            return false;
        }

        Cache::forget($this->otpKey($email));
        Cache::forget($attemptKey);
        Cache::forget($this->otpLockKey($email));

        return true;
    }

    public function markEmailVerified(User $user): void
    {
        $user->forceFill(['email_verified_at' => now()])->save();
    }

    public function resetPassword(User $user, string $password): void
    {
        $user->forceFill(['password' => Hash::make($password)])->save();
    }

    private function otpKey(string $email): string
    {
        return "otp:$email";
    }

    private function otpAttemptsKey(string $email): string
    {
        return "otp-attempts:$email";
    }

    private function otpLockKey(string $email): string
    {
        return "otp-lock:$email";
    }
}
