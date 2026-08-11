<?php

namespace App\Http\Controllers\Admin;

use App\Events\BedAssignmentUpdated;
use App\Events\RoomUpdated;
use App\Http\Controllers\Controller;
use App\Models\Kamar;
use App\Models\PenempatanAsrama;
use App\Models\Ranjang;
use App\Models\RiwayatPenempatan;
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
        $rooms = Kamar::with(['ranjang.penempatanAktif.user.profile', 'ranjang.penempatanAktif.user.siswaPrograms.program'])
            ->orderBy('nomor_kamar')
            ->get();

        $totalKamar = $rooms->count();
        $totalRanjang = Ranjang::count();
        $terisi = Ranjang::where('status', 'terisi')->count();
        $tersedia = Ranjang::where('status', 'tersedia')->count();

        $roomsData = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'nomor_kamar' => $room->nomor_kamar,
                'status' => $room->status,
                'keterangan' => $room->keterangan,
                'ranjang' => $room->ranjang->map(function ($ranjang) {
                    $penempatan = $ranjang->penempatanAktif;
                    $student = null;
                    if ($penempatan && $penempatan->user) {
                        $user = $penempatan->user;
                        // Find active programs
                        $activeProgram = $user->siswaPrograms->first()?->program?->nama_program ?? '-';

                        // Check if online (activity within last 2 minutes)
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
                        'id' => $ranjang->id,
                        'nomor_ranjang' => sprintf('%02d', $ranjang->nomor_ranjang),
                        'status' => $ranjang->status,
                        'student' => $student,
                    ];
                }),
            ];
        });

        return Inertia::render('Admin/Asrama', [
            'stats' => [
                'totalKamar' => $totalKamar,
                'totalRanjang' => $totalRanjang,
                'terisi' => $terisi,
                'tersedia' => $tersedia,
            ],
            'rooms' => $roomsData,
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
            'ranjang_id' => ['required', 'exists:ranjang,id'],
        ]);

        $user = User::findOrFail($request->input('user_id'));
        $ranjangId = $request->input('ranjang_id');

        try {
            $penempatan = $this->asramaService->assignManualBed($user, $ranjangId, auth()->user());

            $kamar = $penempatan->kamar;
            $terisi = Ranjang::where('kamar_id', $kamar->id)->where('status', 'terisi')->count();
            $tersedia = Ranjang::where('kamar_id', $kamar->id)->where('status', 'tersedia')->count();
            $totalRanjang = Ranjang::where('kamar_id', $kamar->id)->count();

            SafeBroadcast::run(fn () => BedAssignmentUpdated::dispatch(
                $penempatan->user_id,
                $penempatan->kamar_id,
                $penempatan->ranjang_id,
                $penempatan->kamar?->nomor_kamar,
                sprintf('%02d', $penempatan->ranjang?->nomor_ranjang ?? 0),
                'terisi',
                'assigned'
            ));

            SafeBroadcast::run(fn () => RoomUpdated::dispatch(
                $kamar->id,
                $kamar->nomor_kamar,
                $terisi,
                $tersedia,
                $totalRanjang,
                'updated'
            ));

            return back()->with('message', 'Siswa berhasil ditempatkan di kamar.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function vacate(int $ranjangId)
    {
        $ranjang = Ranjang::findOrFail($ranjangId);

        $penempatanLama = PenempatanAsrama::where('ranjang_id', $ranjang->id)
            ->where('status', 'aktif')
            ->first();

        $userId = $penempatanLama?->user_id;

        try {
            $this->asramaService->vacateBed($ranjangId);

            SafeBroadcast::run(fn () => BedAssignmentUpdated::dispatch(
                $userId ?? 0,
                $ranjang->kamar_id,
                $ranjang->id,
                null,
                null,
                'tersedia',
                'vacated'
            ));

            $kamar = Kamar::find($ranjang->kamar_id);
            $terisi = $kamar ? Ranjang::where('kamar_id', $kamar->id)->where('status', 'terisi')->count() : 0;
            $tersedia = $kamar ? Ranjang::where('kamar_id', $kamar->id)->where('status', 'tersedia')->count() : 0;
            $totalRanjang = $kamar ? Ranjang::where('kamar_id', $kamar->id)->count() : 0;

            SafeBroadcast::run(fn () => RoomUpdated::dispatch(
                $kamar->id,
                $kamar?->nomor_kamar,
                $terisi,
                $tersedia,
                $totalRanjang,
                'updated'
            ));

            return back()->with('message', 'Ranjang berhasil dikosongkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function storeKamar(Request $request)
    {
        $request->validate([
            'nomor_kamar' => ['required', 'string', 'max:32', 'unique:kamar,nomor_kamar'],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', 'string', 'in:tersedia,maintenance,nonaktif'],
            'keterangan' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($request) {
            $kamar = Kamar::create([
                'nomor_kamar' => $request->input('nomor_kamar'),
                'kapasitas' => $request->input('kapasitas', 6),
                'status' => $request->input('status', 'tersedia'),
                'keterangan' => $request->input('keterangan'),
            ]);

            for ($i = 1; $i <= $kamar->kapasitas; $i++) {
                Ranjang::create([
                    'kamar_id' => $kamar->id,
                    'nomor_ranjang' => $i,
                    'status' => 'tersedia',
                ]);
            }

            SafeBroadcast::run(fn () => RoomUpdated::dispatch(
                $kamar->id,
                $kamar->nomor_kamar,
                0,
                $kamar->kapasitas,
                $kamar->kapasitas,
                'created'
            ));

            return back()->with('message', "Kamar {$kamar->nomor_kamar} berhasil dibuat dengan {$kamar->kapasitas} ranjang.");
        });
    }

    public function updateKamar(Request $request, int $kamarId)
    {
        $kamar = Kamar::with('ranjang')->findOrFail($kamarId);

        $request->validate([
            'nomor_kamar' => ['required', 'string', 'max:32', 'unique:kamar,nomor_kamar,'.$kamarId],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', 'string', 'in:tersedia,maintenance,nonaktif,penuh'],
            'keterangan' => ['nullable', 'string'],
        ]);

        return DB::transaction(function () use ($request, $kamar) {
            $oldKapasitas = $kamar->kapasitas;

            $kamar->update([
                'nomor_kamar' => $request->input('nomor_kamar'),
                'kapasitas' => $request->input('kapasitas', 6),
                'status' => $request->input('status', 'tersedia'),
                'keterangan' => $request->input('keterangan'),
            ]);

            if ($kamar->kapasitas > $oldKapasitas) {
                for ($i = $oldKapasitas + 1; $i <= $kamar->kapasitas; $i++) {
                    Ranjang::create([
                        'kamar_id' => $kamar->id,
                        'nomor_ranjang' => $i,
                        'status' => 'tersedia',
                    ]);
                }
            }

            return back()->with('message', "Kamar {$kamar->nomor_kamar} berhasil diperbarui.");
        });
    }

    public function destroyKamar(int $kamarId)
    {
        $kamar = Kamar::withCount('ranjang')->findOrFail($kamarId);

        if ($kamar->ranjang_count > 0) {
            return back()->withErrors([
                'error' => 'Kamar tidak dapat dihapus karena masih memiliki ranjang. Kosongkan semua ranjang terlebih dahulu.',
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
                return [
                    'id' => $r->id,
                    'siswa_nama' => $r->user?->name ?? $r->user?->profile?->full_name ?? $r->user?->email ?? '-',
                    'siswa_email' => $r->user?->email ?? '-',
                    'ranjang_lama' => $r->ranjangLama ? 'Kamar '.$r->ranjangLama->kamar?->nomor_kamar.' / Ranjang '.sprintf('%02d', $r->ranjangLama->nomor_ranjang) : 'N/A',
                    'ranjang_baru' => $r->ranjangBaru ? 'Kamar '.$r->ranjangBaru->kamar?->nomor_kamar.' / Ranjang '.sprintf('%02d', $r->ranjangBaru->nomor_ranjang) : 'N/A',
                    'dipindah_oleh' => $r->dipindahkanOleh?->name ?? $r->dipindahkanOleh?->username ?? 'Sistem',
                    'alasan' => $r->alasan ?? '-',
                    'waktu' => $r->created_at?->format('d M Y H:i') ?? '',
                ];
            });

        return Inertia::render('Admin/RiwayatPenempatan', [
            'riwayat' => $riwayat,
        ]);
    }
}
