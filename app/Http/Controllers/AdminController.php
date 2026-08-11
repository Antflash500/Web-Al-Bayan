<?php

namespace App\Http\Controllers;

use App\Events\DataChanged;
use App\Models\Pengumuman;
use App\Models\ProgramKursus;
use App\Models\User;
use App\Services\AdminService;
use App\Support\SafeBroadcast;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AdminController extends Controller
{
    public function __construct(private readonly AdminService $admin) {}

    public function home(): Response
    {
        return Inertia::render('Admin/Home', $this->admin->home());
    }

    public function users(Request $request): Response
    {
        $q = trim((string) $request->query('q'));

        return Inertia::render('Admin/Users', [
            'users' => $this->admin->users($q !== '' ? $q : null),
            'programs' => $this->admin->programOptions(),
            'filters' => ['q' => $q],
        ]);
    }

    public function pendaftaran(Request $request): Response
    {
        $status = $request->query('status', 'pending');

        return Inertia::render('Admin/Pendaftaran', [
            'pendaftaran' => $this->admin->pendaftaran(in_array($status, ['pending', 'approved', 'rejected'], true) ? $status : 'pending'),
            'activeStatus' => $status,
        ]);
    }

    public function approveRegistration(Request $request, User $user): SymfonyResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers()],
        ]);

        $this->admin->approveRegistration($user, $data['username'], $data['password']);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('users', 'updated')));

        return back()->with('success', 'Pendaftaran disetujui. Username & password telah dibuat untuk siswa.');
    }

    public function rejectRegistration(User $user): SymfonyResponse
    {
        $this->admin->rejectRegistration($user);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('users', 'updated')));

        return back()->with('success', 'Pendaftaran ditolak. Siswa tidak dapat login.');
    }

    public function toggleStatus(User $user): SymfonyResponse
    {
        $this->admin->toggleStatus($user);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('users', 'updated')));

        return back()->with('success', 'Status pengguna diperbarui.');
    }

    public function storeUser(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'nomor_hp' => ['nullable', 'string', 'max:30'],
            'alamat' => ['nullable', 'string', 'max:500'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers()],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['nullable', 'in:laki_laki,perempuan'],
            'role' => ['required', 'in:siswa,admin'],
        ]);

        $this->admin->createUser($data);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('users', 'created')));

        return back()->with('success', 'Pengguna baru berhasil dibuat dan dapat langsung login.');
    }

    public function updateUser(Request $request, User $user): SymfonyResponse
    {
        $data = $request->validate([
            'username' => ['nullable', 'string', 'max:255', 'unique:users,username,'.$user->id],
            'nama_lengkap' => ['nullable', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'nomor_hp' => ['nullable', 'string', 'max:30'],
            'alamat' => ['nullable', 'string', 'max:500'],
            'password' => ['nullable', 'string', Password::min(8)->letters()->numbers()],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['nullable', 'in:laki_laki,perempuan'],
            'role' => ['sometimes', 'in:siswa,admin'],
            'status' => ['sometimes', 'in:aktif,nonaktif'],
            'program_ids' => ['nullable', 'array'],
            'program_ids.*' => ['integer', 'exists:program,id'],
        ]);

        $this->admin->updateUser($user, $data);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('users', 'updated')));

        return back()->with('success', 'Pengguna diperbarui.');
    }

    public function destroyUser(User $user): SymfonyResponse
    {
        $this->admin->destroyUser($user);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('users', 'deleted')));

        return back()->with('success', 'Pengguna dihapus.');
    }

    public function programs(): Response
    {
        return Inertia::render('Admin/Programs', $this->admin->programs());
    }

    public function storeProgram(Request $request): SymfonyResponse
    {
        $request->merge(['tingkat' => strtolower((string) $request->input('tingkat'))]);

        $data = $request->validate([
            'nama_program' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:2000'],
            'instruktur' => ['nullable', 'string', 'max:255'],
            'tingkat' => ['required', 'in:pemula,menengah,lanjutan'],
            'durasi_jam' => ['required', 'numeric', 'min:1'],
            'harga' => ['nullable', 'numeric', 'min:0'],
            'requires_dorm' => ['sometimes', 'boolean'],
            'status' => ['required', 'in:aktif,nonaktif,draft'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:8192'],
        ]);

        $this->admin->storeProgram($data, $request->file('thumbnail'));

        SafeBroadcast::run(fn () => broadcast(new DataChanged('programs', 'created')));

        return back()->with('success', 'Program ditambahkan.');
    }

    public function updateProgram(Request $request, ProgramKursus $program): SymfonyResponse
    {
        $request->merge(['tingkat' => strtolower((string) $request->input('tingkat'))]);

        $data = $request->validate([
            'nama_program' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:2000'],
            'instruktur' => ['nullable', 'string', 'max:255'],
            'tingkat' => ['required', 'in:pemula,menengah,lanjutan'],
            'durasi_jam' => ['required', 'numeric', 'min:1'],
            'harga' => ['nullable', 'numeric', 'min:0'],
            'requires_dorm' => ['sometimes', 'boolean'],
            'status' => ['required', 'in:aktif,nonaktif,draft'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:8192'],
        ]);

        $this->admin->updateProgram($program, $data, $request->file('thumbnail'));

        SafeBroadcast::run(fn () => broadcast(new DataChanged('programs', 'updated')));

        return back()->with('success', 'Program diperbarui.');
    }

    public function destroyProgram(ProgramKursus $program): SymfonyResponse
    {
        $this->admin->destroyProgram($program);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('programs', 'deleted')));

        return back()->with('success', 'Program dihapus.');
    }

    public function announcements(): Response
    {
        return Inertia::render('Admin/Announcements', [
            'announcements' => $this->admin->announcements(),
        ]);
    }

    public function storeAnnouncement(Request $request): SymfonyResponse
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'isi' => ['required', 'string', 'max:5000'],
        ]);

        $this->admin->storeAnnouncement($data);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('announcements', 'created')));

        return back()->with('success', 'Pengumuman diterbitkan.');
    }

    public function destroyAnnouncement(Pengumuman $pengumuman): SymfonyResponse
    {
        $this->admin->destroyAnnouncement($pengumuman);

        SafeBroadcast::run(fn () => broadcast(new DataChanged('announcements', 'deleted')));

        return back()->with('success', 'Pengumuman dihapus.');
    }
}
