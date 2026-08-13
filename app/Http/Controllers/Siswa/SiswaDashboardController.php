<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use App\Models\PenempatanAsrama;
use App\Models\SiswaProgram;
use App\Models\Transaksi;
use App\Services\BiodataService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaDashboardController extends Controller
{
    public function __construct(private readonly BiodataService $biodataService) {}

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
        $penempatan = PenempatanAsrama::with(['kasur.ranjang.kamar.rumah'])
            ->where('user_id', $user->id)
            ->where('status', 'aktif')
            ->first();

        $asramaSummary = $penempatan ? [
            'is_assigned' => true,
            'rumah' => $penempatan->kasur?->ranjang?->kamar?->rumah?->nama ?? '-',
            'kamar' => $penempatan->kasur?->ranjang?->kamar?->nomor_kamar ?? '-',
            'ranjang' => sprintf('%02d', $penempatan->kasur?->ranjang?->nomor_ranjang ?? 0),
            'posisi' => $penempatan->kasur?->posisi ?? null,
        ] : [
            'is_assigned' => false,
            'rumah' => null,
            'kamar' => null,
            'ranjang' => null,
            'posisi' => null,
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

        $profile = $user->profile;

        return Inertia::render('Siswa/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name ?? $user->profile?->full_name ?? 'Siswa',
                    'role' => $user->role,
                    'avatar' => $user->profile?->avatar,
                    'username' => $user->username,
                    'nik' => $profile?->nik,
                    'birth_date' => $profile?->birth_date?->format('d F Y'),
                    'gender' => $profile?->gender,
                    'phone' => $profile?->phone,
                    'address' => $profile?->address,
                    'father_name' => $profile?->father_name,
                    'father_address' => $profile?->father_address,
                    'father_occupation' => $profile?->father_occupation,
                    'father_phone' => $profile?->father_phone,
                    'mother_name' => $profile?->mother_name,
                    'mother_address' => $profile?->mother_address,
                    'mother_occupation' => $profile?->mother_occupation,
                    'mother_phone' => $profile?->mother_phone,
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

    public function unduhBiodata(Request $request)
    {
        $result = $this->biodataService->generate($request->user());

        return response($result['bytes'], 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="'.$result['filename'].'"',
        ]);
    }
}
