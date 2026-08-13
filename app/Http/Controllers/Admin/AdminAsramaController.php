<?php

namespace App\Http\Controllers\Admin;

use App\Events\BedAssignmentUpdated;
use App\Events\RoomUpdated;
use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\Kasur;
use App\Models\PenempatanAsrama;
use App\Models\Ranjang;
use App\Models\RiwayatPenempatan;
use App\Models\Rumah;
use App\Models\User;
use App\Services\AsramaService;
use App\Support\SafeBroadcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminAsramaController extends Controller
{
    public function __construct(private readonly AsramaService $asramaService) {}

    public function index(Request $request): Response
    {
        $rumahList = Rumah::with(['kamar.ranjang.kasur.penempatanAktif.user.profile', 'kamar.ranjang.kasur.penempatanAktif.user.siswaPrograms.program'])
            ->orderBy('nama')
            ->get();

        $totalRumah = $rumahList->count();
        $totalKamar = Kamar::count();
        $totalRanjang = Ranjang::count();
        $totalKasur = Kasur::count();
        $terisi = Kasur::where('status', 'terisi')->count();
        $tersedia = Kasur::where('status', 'tersedia')->count();

        $rumahData = $rumahList->map(function ($rumah) {
            return [
                'id' => $rumah->id,
                'nama' => $rumah->nama,
                'status' => $rumah->status,
                'keterangan' => $rumah->keterangan,
                'kamar' => $rumah->kamar->map(function ($room) {
                    return [
                        'id' => $room->id,
                        'nomor_kamar' => $room->nomor_kamar,
                        'status' => $room->status,
                        'keterangan' => $room->keterangan,
                        'ranjang' => $room->ranjang->map(function ($ranjang) {
                            return [
                                'id' => $ranjang->id,
                                'nomor_ranjang' => sprintf('%02d', $ranjang->nomor_ranjang),
                                'status' => $ranjang->status,
                                'kasur' => $ranjang->kasur->map(function ($kasur) {
                                    $penempatan = $kasur->penempatanAktif;
                                    $student = null;
                                    if ($penempatan && $penempatan->user) {
                                        $user = $penempatan->user;
                                        $activeProgram = $user->siswaPrograms->first()?->program?->nama_program ?? '-';
                                        $isOnline = $user->last_activity_at && $user->last_activity_at->gt(now()->subMinutes(2));

                                        $student = [
                                            'id' => $user->id,
                                            'name' => $user->name ?? $user->profile?->full_name ?? 'Siswa',
                                            'email' => $user->email,
                                            'program' => $activeProgram,
                                            'is_online' => (bool) $isOnline,
                                        ];
                                    }

                                    return [
                                        'id' => $kasur->id,
                                        'posisi' => $kasur->posisi,
                                        'status' => $kasur->status,
                                        'student' => $student,
                                    ];
                                })->values(),
                            ];
                        })->values(),
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('Admin/Asrama', [
            'stats' => [
                'totalRumah' => $totalRumah,
                'totalKamar' => $totalKamar,
                'totalRanjang' => $totalRanjang,
                'totalKasur' => $totalKasur,
                'terisi' => $terisi,
                'tersedia' => $tersedia,
            ],
            'rumah' => $rumahData,
        ]);
    }

    public function searchStudents(Request $request)
    {
        $q = trim((string) $request->query('q'));

        if ($q === '') {
            return response()->json([]);
        }

        // Find students who do NOT have an active dorm assignment yet
        $students = User::whereIn('role', ['student', 'siswa'])
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhereHas('profile', function ($pQuery) use ($q) {
                        $pQuery->where('full_name', 'like', "%{$q}%");
                    });
            })
            ->whereDoesntHave('penempatanAsrama', function ($query) {
                $query->where('status', 'aktif');
            })
            ->with('profile')
            ->limit(10)
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name ?? $u->profile?->full_name ?? $u->email,
                    'email' => $u->email,
                ];
            });

        return response()->json($students);
    }

    public function assign(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'kasur_id' => ['required', 'exists:kasur,id'],
        ]);

        $user = User::findOrFail($request->input('user_id'));
        $kasurId = $request->input('kasur_id');

        try {
            $penempatan = $this->asramaService->assignManualBed($user, $kasurId, auth()->user());

            $kasur = Kasur::with('ranjang.kamar')->findOrFail($kasurId);
            $kamar = $kasur->ranjang->kamar;

            $terisi = $this->kamarKasurCount($kamar->id, 'terisi');
            $tersedia = $this->kamarKasurCount($kamar->id, 'tersedia');
            $totalKasur = $this->kamarKasurCount($kamar->id);

            SafeBroadcast::run(fn () => BedAssignmentUpdated::dispatch(
                $penempatan->user_id,
                $kamar->id,
                $kasur->ranjang_id,
                $kasur->id,
                $kamar->nomor_kamar,
                sprintf('%02d', $kasur->ranjang->nomor_ranjang),
                $kasur->posisi,
                'terisi',
                'assigned'
            ));

            SafeBroadcast::run(fn () => RoomUpdated::dispatch(
                $kamar->id,
                $kamar->nomor_kamar,
                $terisi,
                $tersedia,
                $totalKasur,
                'updated'
            ));

            return back()->with('message', 'Siswa berhasil ditempatkan di kasur.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function vacate(int $kasurId)
    {
        $kasur = Kasur::with('ranjang.kamar')->findOrFail($kasurId);

        $penempatanLama = PenempatanAsrama::where('kasur_id', $kasur->id)
            ->where('status', 'aktif')
            ->first();

        $userId = $penempatanLama?->user_id;

        try {
            $this->asramaService->vacateBed($kasurId);

            $kamar = $kasur->ranjang?->kamar;

            SafeBroadcast::run(fn () => BedAssignmentUpdated::dispatch(
                $userId ?? 0,
                $kamar?->id,
                $kasur->ranjang_id,
                $kasur->id,
                $kamar?->nomor_kamar,
                $kasur->ranjang ? sprintf('%02d', $kasur->ranjang->nomor_ranjang) : null,
                $kasur->posisi,
                'tersedia',
                'vacated'
            ));

            if ($kamar) {
                $terisi = $this->kamarKasurCount($kamar->id, 'terisi');
                $tersedia = $this->kamarKasurCount($kamar->id, 'tersedia');
                $totalKasur = $this->kamarKasurCount($kamar->id);

                SafeBroadcast::run(fn () => RoomUpdated::dispatch(
                    $kamar->id,
                    $kamar->nomor_kamar,
                    $terisi,
                    $tersedia,
                    $totalKasur,
                    'updated'
                ));
            }

            return back()->with('message', 'Kasur berhasil dikosongkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function storeRumah(Request $request)
    {
        $request->validate([
            'nama' => ['required', 'string', 'max:64', 'unique:rumah,nama'],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
            'keterangan' => ['nullable', 'string'],
        ]);

        $rumah = Rumah::create([
            'nama' => $request->input('nama'),
            'status' => $request->input('status', 'aktif'),
            'keterangan' => $request->input('keterangan'),
        ]);

        return back()->with('message', "Rumah {$rumah->nama} berhasil dibuat.");
    }

    public function updateRumah(Request $request, int $rumahId)
    {
        $rumah = Rumah::findOrFail($rumahId);

        $request->validate([
            'nama' => ['required', 'string', 'max:64', 'unique:rumah,nama,'.$rumahId],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
            'keterangan' => ['nullable', 'string'],
        ]);

        $rumah->update([
            'nama' => $request->input('nama'),
            'status' => $request->input('status', 'aktif'),
            'keterangan' => $request->input('keterangan'),
        ]);

        return back()->with('message', "Rumah {$rumah->nama} berhasil diperbarui.");
    }

    public function destroyRumah(int $rumahId)
    {
        $rumah = Rumah::withCount('kamar')->findOrFail($rumahId);

        if ($rumah->kamar_count > 0) {
            return back()->withErrors([
                'error' => 'Rumah tidak dapat dihapus karena masih memiliki kamar.',
            ]);
        }

        $rumah->delete();

        return back()->with('message', "Rumah {$rumah->nama} berhasil dihapus.");
    }

    public function storeKamar(Request $request)
    {
        $request->validate([
            'rumah_id' => ['required', 'exists:rumah,id'],
            'nomor_kamar' => ['required', 'string', 'max:32', 'unique:kamar,nomor_kamar'],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', 'string', 'in:tersedia,maintenance,nonaktif'],
            'keterangan' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($request) {
            $kamar = Kamar::create([
                'rumah_id' => $request->input('rumah_id'),
                'nomor_kamar' => $request->input('nomor_kamar'),
                'kapasitas' => $request->input('kapasitas', 6),
                'status' => $request->input('status', 'tersedia'),
                'keterangan' => $request->input('keterangan'),
            ]);

            $this->createRanjangKasur($kamar->id, $kamar->kapasitas);

            $totalKasur = $this->kamarKasurCount($kamar->id);

            SafeBroadcast::run(fn () => RoomUpdated::dispatch(
                $kamar->id,
                $kamar->nomor_kamar,
                0,
                $totalKasur,
                $totalKasur,
                'created'
            ));

            return back()->with('message', "Kamar {$kamar->nomor_kamar} berhasil dibuat dengan {$kamar->kapasitas} ranjang tingkat (2 kasur per ranjang).");
        });
    }

    public function updateKamar(Request $request, int $kamarId)
    {
        $kamar = Kamar::with('ranjang')->findOrFail($kamarId);

        $request->validate([
            'rumah_id' => ['required', 'exists:rumah,id'],
            'nomor_kamar' => ['required', 'string', 'max:32', 'unique:kamar,nomor_kamar,'.$kamarId],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', 'string', 'in:tersedia,maintenance,nonaktif,penuh'],
            'keterangan' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($request, $kamar) {
            $oldKapasitas = $kamar->kapasitas;

            $kamar->update([
                'rumah_id' => $request->input('rumah_id'),
                'nomor_kamar' => $request->input('nomor_kamar'),
                'kapasitas' => $request->input('kapasitas', 6),
                'status' => $request->input('status', 'tersedia'),
                'keterangan' => $request->input('keterangan'),
            ]);

            if ($kamar->kapasitas > $oldKapasitas) {
                $this->createRanjangKasur($kamar->id, $kamar->kapasitas, $oldKapasitas + 1);
            }

            return back()->with('message', "Kamar {$kamar->nomor_kamar} berhasil diperbarui.");
        });
    }

    public function destroyKamar(int $kamarId)
    {
        $kamar = Kamar::findOrFail($kamarId);

        $occupiedKasur = Kasur::whereHas('ranjang', fn ($q) => $q->where('kamar_id', $kamar->id))
            ->where('status', 'terisi')
            ->count();

        if ($occupiedKasur > 0) {
            return back()->withErrors([
                'error' => 'Kamar tidak dapat dihapus karena masih ada kasur terisi. Kosongkan semua kasur terlebih dahulu.',
            ]);
        }

        SafeBroadcast::run(fn () => RoomUpdated::dispatch(
            $kamar->id,
            $kamar->nomor_kamar,
            0,
            0,
            0,
            'deleted'
        ));

        $kamar->delete();

        return back()->with('message', "Kamar {$kamar->nomor_kamar} berhasil dihapus.");
    }

    public function riwayat(Request $request): Response
    {
        $riwayat = RiwayatPenempatan::with(['user.profile', 'ranjangLama.kamar', 'ranjangBaru.kamar', 'dipindahkanOleh'])
            ->latest()
            ->limit(100)
            ->get()
            ->map(function ($r) {
                $lama = $r->ranjangLama ? 'Kamar '.$r->ranjangLama->kamar?->nomor_kamar.' / Ranjang '.sprintf('%02d', $r->ranjangLama->nomor_ranjang).($r->posisi_lama ? ' / Kasur '.ucfirst($r->posisi_lama) : '') : 'N/A';
                $baru = $r->ranjangBaru ? 'Kamar '.$r->ranjangBaru->kamar?->nomor_kamar.' / Ranjang '.sprintf('%02d', $r->ranjangBaru->nomor_ranjang).($r->posisi_baru ? ' / Kasur '.ucfirst($r->posisi_baru) : '') : 'N/A';

                return [
                    'id' => $r->id,
                    'siswa_nama' => $r->user?->name ?? $r->user?->profile?->full_name ?? $r->user?->email ?? '-',
                    'siswa_email' => $r->user?->email ?? '-',
                    'ranjang_lama' => $lama,
                    'ranjang_baru' => $baru,
                    'dipindah_oleh' => $r->dipindahkanOleh?->name ?? $r->dipindahkanOleh?->username ?? 'Sistem',
                    'alasan' => $r->alasan ?? '-',
                    'waktu' => $r->created_at?->format('d M Y H:i') ?? '',
                ];
            });

        return Inertia::render('Admin/RiwayatPenempatan', [
            'riwayat' => $riwayat,
        ]);
    }

    private function createRanjangKasur(int $kamarId, int $totalKapasitas, int $startFrom = 1): void
    {
        for ($i = $startFrom; $i <= $totalKapasitas; $i++) {
            $ranjang = Ranjang::create([
                'kamar_id' => $kamarId,
                'nomor_ranjang' => $i,
                'status' => 'tersedia',
            ]);

            Kasur::create([
                'ranjang_id' => $ranjang->id,
                'posisi' => 'atas',
                'status' => 'tersedia',
            ]);

            Kasur::create([
                'ranjang_id' => $ranjang->id,
                'posisi' => 'bawah',
                'status' => 'tersedia',
            ]);
        }
    }

    private function kamarKasurCount(int $kamarId, ?string $status = null): int
    {
        $query = Kasur::whereHas('ranjang', fn ($q) => $q->where('kamar_id', $kamarId));

        if ($status) {
            $query->where('status', $status);
        }

        return $query->count();
    }
}
