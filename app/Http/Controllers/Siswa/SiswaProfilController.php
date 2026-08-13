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
        $user = $request->user()->load(['profile', 'penempatanAsrama.kasur.ranjang.kamar.rumah']);

        $penempatan = $user->penempatanAsrama;

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
                'father_name' => $user->profile?->father_name,
                'father_address' => $user->profile?->father_address,
                'father_occupation' => $user->profile?->father_occupation,
                'father_phone' => $user->profile?->father_phone,
                'mother_name' => $user->profile?->mother_name,
                'mother_address' => $user->profile?->mother_address,
                'mother_occupation' => $user->profile?->mother_occupation,
                'mother_phone' => $user->profile?->mother_phone,
            ],
            'asrama' => $penempatan ? [
                'rumah' => $penempatan->kasur?->ranjang?->kamar?->rumah?->nama,
                'kamar' => $penempatan->kasur?->ranjang?->kamar?->nomor_kamar,
                'ranjang' => sprintf('%02d', $penempatan->kasur?->ranjang?->nomor_ranjang ?? 0),
                'posisi' => $penempatan->kasur?->posisi,
                'status' => $penempatan->status,
                'tanggal_masuk' => $penempatan->tanggal_masuk?->format('d M Y'),
                'catatan' => $penempatan->catatan,
            ] : null,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $profile = $user->profile;

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:100'],
            'nik' => ['nullable', 'string', 'max:30'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:20'],
            'account_status' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:500'],
            'father_name' => ['nullable', 'string', 'max:100'],
            'father_address' => ['nullable', 'string', 'max:255'],
            'father_occupation' => ['nullable', 'string', 'max:100'],
            'father_phone' => ['nullable', 'string', 'max:20'],
            'mother_name' => ['nullable', 'string', 'max:100'],
            'mother_address' => ['nullable', 'string', 'max:255'],
            'mother_occupation' => ['nullable', 'string', 'max:100'],
            'mother_phone' => ['nullable', 'string', 'max:20'],
        ]);

        $changed = [];

        $userData = [
            'name' => $data['name'],
            'username' => $data['username'],
            'status' => $data['account_status'],
        ];

        $profileData = [
            'nik' => $data['nik'],
            'birth_date' => $data['birth_date'],
            'gender' => $data['gender'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'full_name' => $data['name'],
            'father_name' => $data['father_name'],
            'father_address' => $data['father_address'],
            'father_occupation' => $data['father_occupation'],
            'father_phone' => $data['father_phone'],
            'mother_name' => $data['mother_name'],
            'mother_address' => $data['mother_address'],
            'mother_occupation' => $data['mother_occupation'],
            'mother_phone' => $data['mother_phone'],
        ];

        $userData = array_filter($userData, fn ($v) => $v !== null);
        $profileData = array_filter($profileData, fn ($v) => $v !== null);

        if (!empty($userData)) {
            $oldUserName = $user->name;
            $oldUsername = $user->username;
            $oldStatus = $user->status;

            $user->update($userData);

            if (array_key_exists('name', $userData) && $userData['name'] !== $oldUserName) {
                $changed[] = 'Nama Lengkap';
            }
            if (array_key_exists('username', $userData) && $userData['username'] !== $oldUsername) {
                $changed[] = 'Username';
            }
            if (array_key_exists('status', $userData) && $userData['status'] !== $oldStatus) {
                $changed[] = 'Status Akun';
            }
        }

        if ($profile) {
            $oldNik = $profile->nik;
            $oldBirthDate = $profile->birth_date?->format('Y-m-d');
            $oldGender = $profile->gender;
            $oldPhone = $profile->phone;
            $oldAddress = $profile->address;
            $oldFatherName = $profile->father_name;
            $oldFatherAddress = $profile->father_address;
            $oldFatherOccupation = $profile->father_occupation;
            $oldFatherPhone = $profile->father_phone;
            $oldMotherName = $profile->mother_name;
            $oldMotherAddress = $profile->mother_address;
            $oldMotherOccupation = $profile->mother_occupation;
            $oldMotherPhone = $profile->mother_phone;

            $profile->update($profileData);

            if (array_key_exists('nik', $profileData) && $profileData['nik'] !== $oldNik) {
                $changed[] = 'NIK';
            }
            if (array_key_exists('birth_date', $profileData) && $profileData['birth_date'] !== $oldBirthDate) {
                $changed[] = 'Tanggal Lahir';
            }
            if (array_key_exists('gender', $profileData) && $profileData['gender'] !== $oldGender) {
                $changed[] = 'Jenis Kelamin';
            }
            if (array_key_exists('phone', $profileData) && $profileData['phone'] !== $oldPhone) {
                $changed[] = 'Nomor Telepon';
            }
            if (array_key_exists('address', $profileData) && $profileData['address'] !== $oldAddress) {
                $changed[] = 'Alamat';
            }
            if (array_key_exists('father_name', $profileData) && $profileData['father_name'] !== $oldFatherName) {
                $changed[] = 'Nama Ayah';
            }
            if (array_key_exists('father_address', $profileData) && $profileData['father_address'] !== $oldFatherAddress) {
                $changed[] = 'Alamat Ayah';
            }
            if (array_key_exists('father_occupation', $profileData) && $profileData['father_occupation'] !== $oldFatherOccupation) {
                $changed[] = 'Pekerjaan Ayah';
            }
            if (array_key_exists('father_phone', $profileData) && $profileData['father_phone'] !== $oldFatherPhone) {
                $changed[] = 'Nomor HP Ayah';
            }
            if (array_key_exists('mother_name', $profileData) && $profileData['mother_name'] !== $oldMotherName) {
                $changed[] = 'Nama Ibu';
            }
            if (array_key_exists('mother_address', $profileData) && $profileData['mother_address'] !== $oldMotherAddress) {
                $changed[] = 'Alamat Ibu';
            }
            if (array_key_exists('mother_occupation', $profileData) && $profileData['mother_occupation'] !== $oldMotherOccupation) {
                $changed[] = 'Pekerjaan Ibu';
            }
            if (array_key_exists('mother_phone', $profileData) && $profileData['mother_phone'] !== $oldMotherPhone) {
                $changed[] = 'Nomor HP Ibu';
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
