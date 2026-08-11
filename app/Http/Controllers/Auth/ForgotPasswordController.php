<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Repositories\StudentRepository;
use App\Services\AuthenticationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    public function __construct(
        private readonly AuthenticationService $authService,
        private readonly StudentRepository $studentRepository,
    ) {}

    public function show(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendOtp(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = $this->studentRepository->findByEmailOrNim($data['email']);

        if ($user) {
            $this->authService->sendOtp($user->email);
        }

        return redirect()->route('verify-otp', ['email' => $data['email']]);
    }

    public function showVerify(Request $request): Response
    {
        return Inertia::render('Auth/VerifyOtp', [
            'email' => $request->query('email'),
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:6', 'numeric'],
        ]);

        $valid = $this->authService->verifyOtp($data['email'], $data['code']);

        if (! $valid) {
            return back()->withErrors(['code' => 'Kode OTP salah atau telah kedaluwarsa.']);
        }

        $request->session()->put('password_reset_email', $data['email']);

        return redirect()->route('password.reset');
    }

    public function showReset(Request $request): Response
    {
        $email = $request->session()->get('password_reset_email');

        abort_unless($email, 419);

        return Inertia::render('Auth/ResetPassword', ['email' => $email]);
    }

    public function reset(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $this->studentRepository->findByEmailOrNim($data['email']);

        abort_unless($user, 400);

        $this->authService->resetPassword($user, $data['password']);

        $request->session()->forget('password_reset_email');

        return redirect()->route('login')->with('status', 'Password berhasil diubah. Silakan masuk.');
    }
}
