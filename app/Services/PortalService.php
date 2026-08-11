<?php

namespace App\Services;

use App\Models\Materi;
use App\Models\Pengumuman;
use App\Models\ProgramKursus;
use App\Models\Sertifikat;
use App\Models\SiswaProgram;
use App\Models\User;
use Illuminate\Support\Collection;

class PortalService
{
    public function home(User $user): array
    {
        $programs = ProgramKursus::aktif()
            ->urut()
            ->with('kategori')
            ->withCount('materiList')
            ->get();

        $materis = Materi::aktif()
            ->with('program:id,nama_program,slug,thumbnail')
            ->latest('updated_at')
            ->limit(3)
            ->get();

        $announcements = Pengumuman::aktif()
            ->whereNotNull('tanggal_publish')
            ->orderByDesc('tanggal_publish')
            ->limit(3)
            ->get();

        return [
            'programs' => $programs,
            'materis' => $materis,
            'announcements' => $announcements,
            'continueLearning' => $this->continueLearning($user),
            'firstName' => $user->profile?->full_name ?? $user->email,
        ];
    }

    public function programs(?string $q): array
    {
        $programs = ProgramKursus::aktif()
            ->with('kategori')
            ->when($q, fn ($query) => $query
                ->where('nama_program', 'like', "%{$q}%")
                ->orWhere('tingkat', 'like', "%{$q}%")
                ->orWhereHas('kategori', fn ($kategori) => $kategori->where('nama_kategori', 'like', "%{$q}%")))
            ->urut()
            ->get();

        return [
            'programs' => $programs,
            'filters' => ['q' => $q ?? ''],
        ];
    }

    public function programDetail(string $slug): ProgramKursus
    {
        return ProgramKursus::aktif()
            ->with(['kategori', 'materiList'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function materi(string $materiSlug): array
    {
        $materi = Materi::aktif()
            ->with(['program', 'videos', 'pdfs', 'audios', 'quizes'])
            ->where('slug', $materiSlug)
            ->firstOrFail();

        $siblings = Materi::aktif()
            ->where('program_id', $materi->program_id)
            ->orderBy('urutan')
            ->get(['id', 'judul', 'slug', 'urutan']);

        return [
            'materi' => $materi,
            'siblings' => $siblings,
            'programSlug' => $materi->program?->slug,
        ];
    }

    public function sertifikat(User $user): Collection
    {
        return Sertifikat::where('user_id', $user->id)
            ->with('program:id,nama_program,slug')
            ->get();
    }

    private function continueLearning(User $user): ?array
    {
        $enrollment = SiswaProgram::where('user_id', $user->id)
            ->with('program')
            ->first();

        if (! $enrollment) {
            return null;
        }

        return [
            'program' => $enrollment->program,
            'status' => $enrollment->status,
            'progress' => 0,
            'lesson_terakhir' => 'Lanjutkan dari bagian terakhir',
        ];
    }
}
