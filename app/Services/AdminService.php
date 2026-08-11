<?php

namespace App\Services;

use App\Models\Pengumuman;
use App\Models\ProgramKursus;
use App\Models\SiswaProgram;
use App\Models\StudentProfile;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminService
{
    private const DISPLAY_ROLES = [
        User::ROLE_ADMIN => 'admin',
        User::ROLE_STUDENT => 'siswa',
    ];

    public function __construct(private readonly UserRepository $users) {}

    public function home(): array
    {
        return [
            'stats' => $this->users->stats(),
            'recentUsers' => $this->users->recentUsers(6)->map(
                fn (User $user) => $this->presentUser($user)
            )->values(),
            'programs' => ProgramKursus::aktif()->urut()
                ->withCount('materiList')
                ->limit(5)
                ->get(),
            'announcements' => Pengumuman::aktif()
                ->orderByDesc('tanggal_publish')
                ->limit(3)
                ->get(),
        ];
    }

    public function userStats(): array
    {
        return $this->users->stats();
    }

    public function recentUsers(int $limit): Collection
    {
        return $this->users->recentUsers($limit)->map(fn (User $user) => $this->presentUser($user));
    }

    public function users(?string $q): Collection
    {
        return $this->users->search($q)->map(fn (User $user) => $this->presentUser($user))->values();
    }

    public function programOptions(): Collection
    {
        return ProgramKursus::query()
            ->orderBy('sort_order')
            ->get(['id', 'nama_program', 'slug'])
            ->map(fn (ProgramKursus $program) => [
                'id' => $program->id,
                'nama_program' => $program->nama_program,
                'slug' => $program->slug,
            ]);
    }

    public function toggleStatus(User $user): void
    {
        DB::transaction(function () use ($user): void {
            $user->forceFill([
                'status' => $user->status === User::STATUS_AKTIF
                    ? User::STATUS_NONAKTIF
                    : User::STATUS_AKTIF,
            ])->save();
        });
    }

    public function createUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $username = empty($data['username'])
                ? $this->uniqueUsername($data['email'] ?? '')
                : $data['username'];

            $user = User::create([
                'username' => $username,
                'name' => $data['nama_lengkap'],
                'email' => $data['email'] ?? null,
                'password' => $data['password'],
                'role' => $data['role'] === 'admin' ? User::ROLE_ADMIN : User::ROLE_STUDENT,
                'status' => User::STATUS_AKTIF,
                'email_verified_at' => now(),
            ]);

            $user->profile()->create([
                'full_name' => $data['nama_lengkap'],
                'birth_date' => $data['tanggal_lahir'] ?: now(),
                'gender' => ($data['jenis_kelamin'] ?? 'laki_laki') === 'perempuan' ? 'female' : 'male',
                'nik' => $data['nik'] ?? null,
                'phone' => $data['nomor_hp'] ?? null,
                'address' => $data['alamat'] ?? null,
                'agreed_terms' => true,
            ]);

            return $user;
        });
    }

    public function updateUser(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $email = $data['email'] ?? $user->email;

            $fill = [
                'email' => $email,
                'status' => $user->status,
            ];

            if (! empty($data['username'])) {
                $fill['username'] = $data['username'];
            }

            if (isset($data['role'])) {
                $fill['role'] = $data['role'] === 'admin' ? User::ROLE_ADMIN : User::ROLE_STUDENT;
            }

            if (isset($data['status'])) {
                $fill['status'] = $data['status'] === User::STATUS_AKTIF || $data['status'] === User::STATUS_NONAKTIF
                    ? $data['status']
                    : $user->status;
            }

            if (! empty($data['password'])) {
                $fill['password'] = $data['password'];
            }

            $user->forceFill($fill)->save();

            $profile = $user->profile()->firstOrCreate(
                ['user_id' => $user->id],
                [
                    'full_name' => $user->name ?? 'Belum lengkap',
                    'birth_date' => now(),
                    'gender' => 'male',
                    'agreed_terms' => true,
                ]
            );

            if (! empty($data['nama_lengkap'])) {
                $profile->forceFill(['full_name' => $data['nama_lengkap']])->save();
            }
            if (! empty($data['tanggal_lahir'])) {
                $profile->forceFill(['birth_date' => $data['tanggal_lahir']])->save();
            }
            if (! empty($data['jenis_kelamin'])) {
                $profile->forceFill([
                    'gender' => $data['jenis_kelamin'] === 'perempuan' ? 'female' : 'male',
                ])->save();
            }
            if (isset($data['nik'])) {
                $profile->forceFill(['nik' => $data['nik'] ?: null])->save();
            }
            if (isset($data['nomor_hp'])) {
                $profile->forceFill(['phone' => $data['nomor_hp'] ?: null])->save();
            }
            if (isset($data['alamat'])) {
                $profile->forceFill(['address' => $data['alamat'] ?: null])->save();
            }

            if (isset($data['program_ids'])) {
                $this->syncUserPrograms($user, (array) $data['program_ids']);
            }
        });
    }

    private function syncUserPrograms(User $user, array $programIds): void
    {
        $programIds = array_unique(array_map('intval', $programIds));

        SiswaProgram::where('user_id', $user->id)
            ->whereNotIn('program_id', $programIds)
            ->delete();

        foreach ($programIds as $programId) {
            SiswaProgram::updateOrCreate(
                ['user_id' => $user->id, 'program_id' => $programId],
                ['status' => 'aktif', 'tanggal_mulai' => now()->toDateString()]
            );
        }
    }

    public function pendaftaran(string $status = 'pending'): Collection
    {
        return User::query()
            ->where('role', User::ROLE_STUDENT)
            ->whereHas('profile', fn ($profile) => $profile->where('registration_status', $status))
            ->with('profile')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (User $user) => $this->presentPendaftaran($user))
            ->values();
    }

    public function approveRegistration(User $user, string $username, string $password): void
    {
        DB::transaction(function () use ($user, $username, $password): void {
            $profile = $user->profile;

            abort_unless($profile, 404);
            abort_unless($profile->registration_status === StudentProfile::STATUS_PENDING, 422);

            $user->forceFill([
                'username' => $username,
                'password' => Hash::make($password),
                'status' => User::STATUS_AKTIF,
                'email_verified_at' => now(),
            ])->save();

            $profile->forceFill([
                'registration_status' => StudentProfile::STATUS_APPROVED,
            ])->save();
        });
    }

    public function rejectRegistration(User $user): void
    {
        DB::transaction(function () use ($user): void {
            $profile = $user->profile;

            abort_unless($profile, 404);
            abort_unless($profile->registration_status === StudentProfile::STATUS_PENDING, 422);

            $user->forceFill(['status' => User::STATUS_NONAKTIF])->save();

            $profile->forceFill([
                'registration_status' => StudentProfile::STATUS_REJECTED,
            ])->save();
        });
    }

    public function destroyUser(User $user): void
    {
        $user->delete();
    }

    public function programs(): array
    {
        $programs = ProgramKursus::with('kategori')
            ->withCount('materiList')
            ->orderBy('sort_order')
            ->get();

        return [
            'programs' => $programs,
            'stats' => [
                'total' => ProgramKursus::count(),
                'aktif' => ProgramKursus::aktif()->count(),
                'materi' => ProgramKursus::withCount('materiList')->get()->sum('materi_list_count'),
            ],
        ];
    }

    public function storeProgram(array $data, $thumbnail = null): ProgramKursus
    {
        $path = $this->saveThumbnail($thumbnail);

        return ProgramKursus::create([
            'nama_program' => $data['nama_program'],
            'slug' => ($data['slug'] ?? null) ?: Str::slug($data['nama_program']),
            'deskripsi' => $data['deskripsi'] ?? null,
            'instruktur' => $data['instruktur'] ?? null,
            'tingkat' => $data['tingkat'],
            'durasi_jam' => $data['durasi_jam'],
            'harga' => $data['harga'] ?? 0,
            'requires_dorm' => (bool) ($data['requires_dorm'] ?? false),
            'status' => $data['status'],
            'thumbnail' => $path,
            'sort_order' => (int) ProgramKursus::max('sort_order') + 1,
            'kategori_program_id' => null,
        ]);
    }

    public function updateProgram(ProgramKursus $program, array $data, $thumbnail = null): void
    {
        $program->fill($data);

        if ($thumbnail) {
            $program->thumbnail = $this->saveThumbnail($thumbnail);
        }

        $program->save();
    }

    public function destroyProgram(ProgramKursus $program): void
    {
        $program->delete();
    }

    public function announcements(): Collection
    {
        return Pengumuman::orderByDesc('tanggal_publish')->get();
    }

    public function storeAnnouncement(array $data): Pengumuman
    {
        return Pengumuman::create([
            'judul' => $data['judul'],
            'isi' => $data['isi'],
            'tanggal_publish' => now(),
            'status' => 'aktif',
        ]);
    }

    public function destroyAnnouncement(Pengumuman $pengumuman): void
    {
        $pengumuman->delete();
    }

    private function presentPendaftaran(User $user): array
    {
        $profile = $user->profile;

        return [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $profile?->full_name ?? $user->name,
            'nik' => $profile?->nik,
            'birth_date' => $profile?->birth_date?->format('Y-m-d'),
            'gender' => $profile?->gender,
            'address' => $profile?->address,
            'registration_status' => $profile?->registration_status ?? StudentProfile::STATUS_PENDING,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }

    private function presentUser(User $user): array
    {
        $profile = $user->profile;

        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => self::DISPLAY_ROLES[$user->role] ?? 'siswa',
            'status' => $user->status ?? User::STATUS_AKTIF,
            'program_ids' => SiswaProgram::where('user_id', $user->id)->pluck('program_id')->all(),
            'created_at' => $user->created_at?->toIso8601String(),
            'biodata' => $profile ? [
                'nama_lengkap' => $profile->full_name,
                'tanggal_lahir' => $profile->birth_date?->format('Y-m-d'),
                'jenis_kelamin' => $profile->gender === 'female' ? 'perempuan' : 'laki_laki',
                'nik' => $profile->nik,
                'nomor_hp' => $profile->phone,
                'alamat' => $profile->address,
            ] : null,
        ];
    }

    private function uniqueUsername(string $email): string
    {
        $base = Str::lower(Str::before($email, '@'));
        if ($base === '') {
            $base = 'user';
        }
        $username = $base;

        while (User::where('username', $username)->exists()) {
            $username = $base.Str::random(4);
        }

        return $username;
    }

    private function saveThumbnail($file): ?string
    {
        $path = $file->store('programs', 'public');
        $this->cacheImage($path);

        return $path;
    }

    private function cacheImage(?string $path): void
    {
        if (! $path) {
            return;
        }

        try {
            $disk = Storage::disk('public');
            if ($disk->exists($path)) {
                Redis::setex('program:'.$path, 30 * 24 * 3600, $disk->get($path));
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
