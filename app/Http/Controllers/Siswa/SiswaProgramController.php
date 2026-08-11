<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\ProgramKursus;
use App\Models\SiswaProgram;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaProgramController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $enrolled = SiswaProgram::with('program')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($sp) {
                return [
                    'id' => $sp->id,
                    'nama' => $sp->program?->nama_program ?? 'Program Tanpa Nama',
                    'slug' => $sp->program?->slug ?? '',
                    'deskripsi' => $sp->program?->deskripsi ?? '',
                    'status' => $sp->status ?? 'aktif',
                    'progress' => $sp->progress ?? 0,
                ];
            });

        return Inertia::render('Siswa/ProgramSaya', [
            'programs' => $enrolled,
        ]);
    }

    public function cari(Request $request): Response
    {
        $q = trim((string) $request->query('q'));
        $user = $request->user();

        // Status siswa terhadap tiap program: 'enrolled' (sudah lunas),
        // 'pending' (belum bayar / menunggu konfirmasi admin), null (belum ada).
        $stateByProgram = [];
        Transaksi::where('user_id', $user->id)
            ->whereNotNull('program_id')
            ->get(['program_id', 'status'])
            ->each(function ($t) use (&$stateByProgram) {
                if ($t->status === 'paid') {
                    $stateByProgram[$t->program_id] = 'enrolled';
                } elseif ($t->status === 'pending' && ! isset($stateByProgram[$t->program_id])) {
                    $stateByProgram[$t->program_id] = 'pending';
                }
            });

        foreach (SiswaProgram::where('user_id', $user->id)->pluck('program_id') as $programId) {
            $stateByProgram[$programId] = 'enrolled';
        }

        $query = ProgramKursus::query();
        if ($q !== '') {
            $query->where('nama_program', 'like', "%{$q}%")
                ->orWhere('deskripsi', 'like', "%{$q}%");
        }

        $allPrograms = $query->aktif()->latest()->get()->map(function ($p) use ($stateByProgram) {
            return [
                'id' => $p->id,
                'nama' => $p->nama_program ?? '',
                'slug' => $p->slug,
                'harga' => $p->harga ?? 0,
                'durasi' => $p->durasi_jam > 0 ? $p->durasi_jam.' Jam' : '1 Bulan',
                'deskripsi' => $p->deskripsi ?? '',
                'requires_dorm' => (bool) ($p->requires_dorm ?? false),
                'status' => $stateByProgram[$p->id] ?? null,
            ];
        });

        return Inertia::render('Siswa/CariProgram', [
            'programs' => $allPrograms,
            'searchQuery' => $q,
        ]);
    }
}
