<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use App\Models\PenempatanAsrama;
use App\Models\SiswaProgram;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Update heartbeat / last_activity_at
        if ($user) {
            $user->update(['last_activity_at' => now()]);
        }

        // Program Saya count & list
        $enrolledPrograms = SiswaProgram::with('program')
            ->where('user_id', $user->id)
            ->get();

        $programsList = $enrolledPrograms->map(function ($sp) {
            return [
                'id' => $sp->id,
                'nama' => $sp->program?->nama_program ?? 'Program Tanpa Nama',
                'slug' => $sp->program?->slug ?? '',
                'status' => $sp->status ?? 'aktif',
                'progress' => $sp->progress ?? 0,
            ];
        });

        // Pembayaran status
        $pendingCount = Transaksi::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $pembayaranSummary = [
            'status' => $pendingCount === 0 ? 'lunas' : 'pending',
            'pending_count' => $pendingCount,
        ];

        // Asrama status
        $penempatan = PenempatanAsrama::with(['kamar', 'ranjang'])
            ->where('user_id', $user->id)
            ->where('status', 'aktif')
            ->first();

        $asramaSummary = $penempatan ? [
            'is_assigned' => true,
            'kamar' => $penempatan->kamar?->nomor_kamar ?? '-',
            'ranjang' => sprintf('%02d', $penempatan->ranjang?->nomor_ranjang ?? 0),
        ] : [
            'is_assigned' => false,
            'kamar' => null,
            'ranjang' => null,
        ];

        // Activity log
        $aktivitas = LogAktivitas::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'aktivitas' => $log->aktivitas,
                    'waktu' => $log->created_at?->diffForHumans() ?? 'Baru saja',
                ];
            });

        return Inertia::render('Siswa/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name ?? $user->profile?->full_name ?? 'Siswa',
                    'role' => $user->role,
                    'avatar' => $user->profile?->avatar,
                ],
            ],
            'summary' => [
                'programCount' => $enrolledPrograms->count(),
                'pembayaran' => $pembayaranSummary,
                'asrama' => $asramaSummary,
            ],
            'programs' => $programsList,
            'aktivitas' => $aktivitas,
        ]);
    }
}
