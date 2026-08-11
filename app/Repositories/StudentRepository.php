<?php

namespace App\Repositories;

use App\Models\StudentProfile;
use App\Models\User;

class StudentRepository
{
    public function createProfile(User $user, array $data): StudentProfile
    {
        return $user->profile()->create($data);
    }

    public function findByNim(string $nim): ?StudentProfile
    {
        return StudentProfile::where('nim', $nim)->first();
    }

    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }

    public function findByEmailOrNim(string $identifier): ?User
    {
        $user = User::where('email', $identifier)->first();

        if ($user) {
            return $user;
        }

        $user = User::where('username', $identifier)->first();

        if ($user) {
            return $user;
        }

        $profile = $this->findByNim($identifier);

        return $profile?->user;
    }

    public function updateProfile(User $user, array $data): StudentProfile
    {
        $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);
        $profile->update($data);

        return $profile->refresh();
    }
}
