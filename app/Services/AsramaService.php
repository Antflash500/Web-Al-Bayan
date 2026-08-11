<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\PenempatanAsrama;
use App\Models\Ranjang;
use App\Models\RiwayatPenempatan;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class AsramaService
{
    /**
     * Randomly assigns an available bed to a student with DB row locking to prevent double booking.
     */
    public function assignRandomBed(User $user): ?PenempatanAsrama
    {
        return DB::transaction(function () use ($user) {
            // Check if user already has an active bed placement
            $existing = PenempatanAsrama::where('user_id', $user->id)
                ->where('status', 'aktif')
                ->first();

            if ($existing) {
                return $existing;
            }

            // Lock available beds for update
            $availableBeds = Ranjang::where('status', 'tersedia')
                ->lockForUpdate()
                ->get();

            if ($availableBeds->isEmpty()) {
                return null; // No available beds (waiting list)
            }

            // Pick a random bed
            /** @var Ranjang $selectedBed */
            $selectedBed = $availableBeds->random();

            // Mark bed as occupied
            $selectedBed->update(['status' => 'terisi']);

            // Update room status if full
            $kamar = Kamar::find($selectedBed->kamar_id);
            if ($kamar) {
                $terisiCount = Ranjang::where('kamar_id', $kamar->id)->where('status', 'terisi')->count();
                if ($terisiCount >= $kamar->kapasitas) {
                    $kamar->update(['status' => 'penuh']);
                }
            }

            // Create placement
            return PenempatanAsrama::create([
                'user_id' => $user->id,
                'kamar_id' => $selectedBed->kamar_id,
                'ranjang_id' => $selectedBed->id,
                'tanggal_masuk' => now()->toDateString(),
                'status' => 'aktif',
                'catatan' => 'Penempatan otomatis setelah pembayaran lunas',
            ]);
        });
    }

    /**
     * Manually assigns a student to a specific bed.
     */
    public function assignManualBed(User $user, int $ranjangId, ?User $assignedBy = null): PenempatanAsrama
    {
        return DB::transaction(function () use ($user, $ranjangId, $assignedBy) {
            /** @var Ranjang $bed */
            $bed = Ranjang::where('id', $ranjangId)->lockForUpdate()->firstOrFail();

            if ($bed->status === 'terisi') {
                throw new Exception('Ranjang ini sudah terisi.');
            }

            // Deactivate any existing active placement for student
            $existing = PenempatanAsrama::where('user_id', $user->id)
                ->where('status', 'aktif')
                ->first();

            if ($existing) {
                $oldBed = Ranjang::find($existing->ranjang_id);
                if ($oldBed) {
                    $oldBed->update(['status' => 'tersedia']);
                }
                $existing->update(['status' => 'selesai', 'tanggal_keluar' => now()->toDateString()]);

                RiwayatPenempatan::create([
                    'user_id' => $user->id,
                    'ranjang_lama_id' => $existing->ranjang_id,
                    'ranjang_baru_id' => $bed->id,
                    'dipindahkan_oleh_user_id' => $assignedBy?->id,
                    'alasan' => 'Penempatan manual oleh administrator',
                ]);
            }

            $bed->update(['status' => 'terisi']);

            return PenempatanAsrama::create([
                'user_id' => $user->id,
                'kamar_id' => $bed->kamar_id,
                'ranjang_id' => $bed->id,
                'tanggal_masuk' => now()->toDateString(),
                'status' => 'aktif',
                'catatan' => 'Penempatan manual oleh administrator',
            ]);
        });
    }

    /**
     * Vacates an occupied bed.
     */
    public function vacateBed(int $ranjangId): bool
    {
        return DB::transaction(function () use ($ranjangId) {
            /** @var Ranjang $bed */
            $bed = Ranjang::where('id', $ranjangId)->lockForUpdate()->firstOrFail();

            PenempatanAsrama::where('ranjang_id', $bed->id)
                ->where('status', 'aktif')
                ->update(['status' => 'selesai', 'tanggal_keluar' => now()->toDateString()]);

            $bed->update(['status' => 'tersedia']);

            // Update room status
            $kamar = Kamar::find($bed->kamar_id);
            if ($kamar && $kamar->status === 'penuh') {
                $kamar->update(['status' => 'tersedia']);
            }

            return true;
        });
    }
}
