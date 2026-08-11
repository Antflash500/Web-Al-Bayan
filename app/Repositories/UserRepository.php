<?php

namespace App\Repositories;

use App\Models\Materi;
use App\Models\Pengumuman;
use App\Models\ProgramKursus;
use App\Models\Sertifikat;
use App\Models\User;
use Illuminate\Support\Collection;

class UserRepository
{
    public function stats(): array
    {
        return [
            'siswa' => User::where('role', User::ROLE_STUDENT)->count(),
            'admin' => User::where('role', User::ROLE_ADMIN)->count(),
            'program' => ProgramKursus::count(),
            'materi' => Materi::count(),
            'pengumuman' => Pengumuman::count(),
            'sertifikat' => Sertifikat::count(),
        ];
    }

    public function recentUsers(int $limit): Collection
    {
        return User::with('profile')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function search(?string $q): Collection
    {
        return User::query()
            ->when($q, function ($query, string $search): void {
                $query->where('email', 'like', "%{$search}%")
                    ->orWhereHas('profile', fn ($profile) => $profile->where('full_name', 'like', "%{$search}%"));
            })
            ->orderByDesc('created_at')
            ->with('profile')
            ->get();
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
