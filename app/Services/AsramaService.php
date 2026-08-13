<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\Kasur;
use App\Models\PenempatanAsrama;
use App\Models\Ranjang;
use App\Models\RiwayatPenempatan;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class AsramaService
{
    /**
     * Randomly assigns an available kasur to a student with DB row locking to prevent double booking.
     */
    public function assignRandomBed(User $user): ?PenempatanAsrama
    {
        return DB::transaction(function () use ($user) {
            // Check if user already has an active kasur placement
            $existing = PenempatanAsrama::where('user_id', $user->id)
                ->where('status', 'aktif')
                ->first();

            if ($existing) {
                return $existing;
            }

            // Lock available kasur for update
            $availableKasur = Kasur::where('status', 'tersedia')
                ->lockForUpdate()
                ->get();

            if ($availableKasur->isEmpty()) {
                return null; // No available kasur (waiting list)
            }

            // Pick a random kasur
            /** @var Kasur $selectedKasur */
            $selectedKasur = $availableKasur->random();

            // Mark kasur as occupied
            $selectedKasur->update(['status' => 'terisi']);
            $this->syncRanjangStatus($selectedKasur->ranjang_id);
            $this->syncKamarStatus($selectedKasur->ranjang->kamar_id);

            // Create placement
            return PenempatanAsrama::create([
                'user_id' => $user->id,
                'kamar_id' => $selectedKasur->ranjang->kamar_id,
                'kasur_id' => $selectedKasur->id,
                'tanggal_masuk' => now()->toDateString(),
                'status' => 'aktif',
                'catatan' => 'Penempatan otomatis setelah pembayaran lunas',
            ]);
        });
    }

    /**
     * Manually assigns a student to a specific kasur (atas/bawah).
     */
    public function assignManualBed(User $user, int $kasurId, ?User $assignedBy = null): PenempatanAsrama
    {
        return DB::transaction(function () use ($user, $kasurId, $assignedBy) {
            /** @var Kasur $kasur */
            $kasur = Kasur::with('ranjang')->where('id', $kasurId)->lockForUpdate()->firstOrFail();

            if ($kasur->status === 'terisi') {
                throw new Exception('Kasur ini sudah terisi.');
            }

            // Deactivate any existing active placement for student
            $existing = PenempatanAsrama::where('user_id', $user->id)
                ->where('status', 'aktif')
                ->first();

            if ($existing) {
                $oldKasur = Kasur::find($existing->kasur_id);
                if ($oldKasur) {
                    $oldKasur->update(['status' => 'tersedia']);
                    $this->syncRanjangStatus($oldKasur->ranjang_id);
                    $this->syncKamarStatus($oldKasur->ranjang->kamar_id);
                }
                $existing->update(['status' => 'selesai', 'tanggal_keluar' => now()->toDateString()]);

                RiwayatPenempatan::create([
                    'user_id' => $user->id,
                    'ranjang_lama_id' => $oldKasur?->ranjang_id,
                    'ranjang_baru_id' => $kasur->ranjang_id,
                    'posisi_lama' => $oldKasur?->posisi,
                    'posisi_baru' => $kasur->posisi,
                    'dipindahkan_oleh_user_id' => $assignedBy?->id,
                    'alasan' => 'Penempatan manual oleh administrator',
                ]);
            }

            $kasur->update(['status' => 'terisi']);
            $this->syncRanjangStatus($kasur->ranjang_id);
            $this->syncKamarStatus($kasur->ranjang->kamar_id);

            return PenempatanAsrama::create([
                'user_id' => $user->id,
                'kamar_id' => $kasur->ranjang->kamar_id,
                'kasur_id' => $kasur->id,
                'tanggal_masuk' => now()->toDateString(),
                'status' => 'aktif',
                'catatan' => 'Penempatan manual oleh administrator',
            ]);
        });
    }

    /**
     * Vacates an occupied kasur.
     */
    public function vacateBed(int $kasurId): bool
    {
        return DB::transaction(function () use ($kasurId) {
            /** @var Kasur $kasur */
            $kasur = Kasur::with('ranjang')->where('id', $kasurId)->lockForUpdate()->firstOrFail();

            PenempatanAsrama::where('kasur_id', $kasur->id)
                ->where('status', 'aktif')
                ->update(['status' => 'selesai', 'tanggal_keluar' => now()->toDateString()]);

            $kasur->update(['status' => 'tersedia']);
            $this->syncRanjangStatus($kasur->ranjang_id);
            $this->syncKamarStatus($kasur->ranjang->kamar_id);

            return true;
        });
    }

    /**
     * Recalculate ranjang status based on its 2 kasur.
     * tersedia (both free) / sebagian (one occupied) / terisi (both occupied).
     */
    private function syncRanjangStatus(int $ranjangId): void
    {
        $kasurCount = Kasur::where('ranjang_id', $ranjangId)->count();
        $terisiCount = Kasur::where('ranjang_id', $ranjangId)->where('status', 'terisi')->count();

        $status = $terisiCount >= $kasurCount ? 'terisi' : ($terisiCount > 0 ? 'sebagian' : 'tersedia');

        Ranjang::where('id', $ranjangId)->update(['status' => $status]);
    }

    /**
     * Recalculate kamar status: penuh when every kasur inside is occupied.
     */
    private function syncKamarStatus(int $kamarId): void
    {
        $kamar = Kamar::find($kamarId);
        if (! $kamar || ! in_array($kamar->status, ['tersedia', 'penuh'], true)) {
            return;
        }

        $totalKasur = Kasur::whereHas('ranjang', fn ($q) => $q->where('kamar_id', $kamarId))->count();
        $terisiKasur = Kasur::whereHas('ranjang', fn ($q) => $q->where('kamar_id', $kamarId))
            ->where('status', 'terisi')
            ->count();

        $kamar->update(['status' => $totalKasur > 0 && $terisiKasur >= $totalKasur ? 'penuh' : 'tersedia']);
    }
}
