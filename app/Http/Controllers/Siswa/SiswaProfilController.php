<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SiswaProfilController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('profile');

        return Inertia::render('Siswa/Profil', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name ?? $user->profile?->full_name,
                'username' => $user->username,
                'phone' => $user->profile?->phone,
                'address' => $user->profile?->address,
                'avatar' => $user->profile?->avatar,
                'birth_date' => $user->profile?->birth_date?->format('Y-m-d'),
                'gender' => $user->profile?->gender,
                'nik' => $user->profile?->nik,
                'registration_status' => $user->profile?->registration_status,
                'account_status' => $user->status,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile;

        $data = $request->validate([
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $changed = [];

        if ($profile) {
            $oldPhone = $profile->phone;
            $oldAddress = $profile->address;

            $profile->update($data);

            if ($data['phone'] !== $oldPhone) {
                $changed[] = 'Nomor Telepon';
            }
            if ($data['address'] !== $oldAddress) {
                $changed[] = 'Alamat';
            }
        }

        LogAktivitas::create([
            'user_id' => $user->id,
            'aktivitas' => 'Profil diperbarui'.($changed ? ' ('.implode(', ', $changed).')' : ''),
        ]);

        return back()->with('message', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        LogAktivitas::create([
            'user_id' => $user->id,
            'aktivitas' => 'Password akun diubah',
        ]);

        return back()->with('message', 'Password berhasil diubah.');
    }
}
