<?php

namespace App\Services;

use App\Events\BedAssignmentUpdated;
use App\Events\DataChanged;
use App\Events\PaymentStatusUpdated;
use App\Events\ProgramEnrollmentUpdated;
use App\Models\ProgramKursus;
use App\Models\SiswaProgram;
use App\Models\Transaksi;
use App\Models\User;
use App\Support\SafeBroadcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PembayaranService
{
    public function __construct(private readonly AsramaService $asramaService) {}

    public function createCheckout(User $user, ProgramKursus $program, string $metode = 'Bank Transfer'): Transaksi
    {
        // Check for existing pending transaction for this program
        $existing = Transaksi::where('user_id', $user->id)
            ->where('program_id', $program->id)
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return $existing;
        }

        $kode = 'TRX-'.date('Ymd').'-'.strtoupper(Str::random(6));

        return Transaksi::create([
            'kode_transaksi' => $kode,
            'user_id' => $user->id,
            'program_id' => $program->id,
            'jumlah' => $program->harga ?? 0,
            'status' => 'pending',
            'metode_pembayaran' => $metode,
            'expired_at' => now()->addDays(1),
        ]);
    }

    public function processPaymentSuccess(string $kodeTransaksi, ?int $verifiedBy = null): Transaksi
    {
        return DB::transaction(function () use ($kodeTransaksi, $verifiedBy) {
            /** @var Transaksi $transaksi */
            $transaksi = Transaksi::where('kode_transaksi', $kodeTransaksi)
                ->lockForUpdate()
                ->firstOrFail();

            if ($transaksi->status === 'paid') {
                return $transaksi; // Idempotent check
            }

            $oldStatus = $transaksi->status;

            $transaksi->update([
                'status' => 'paid',
                'paid_at' => now(),
                'verified_by' => $verifiedBy ?? $transaksi->verified_by,
                'verified_at' => now(),
            ]);

            SafeBroadcast::run(fn () => PaymentStatusUpdated::dispatch(
                $transaksi->user_id,
                $transaksi->kode_transaksi,
                $oldStatus,
                'paid',
                $transaksi->paid_at->toDateTimeString()
            ));

            // Activate program enrollment
            if ($transaksi->program_id) {
                $enrolledProgramName = $transaksi->program?->nama_program ?? 'Program';

                SiswaProgram::firstOrCreate(
                    [
                        'user_id' => $transaksi->user_id,
                        'program_id' => $transaksi->program_id,
                    ],
                    [
                        'status' => 'aktif',
                        'progress' => 0,
                    ]
                );

                SafeBroadcast::run(fn () => ProgramEnrollmentUpdated::dispatch(
                    $transaksi->user_id,
                    $transaksi->program_id,
                    $enrolledProgramName,
                    'aktif',
                    0.0,
                    'created'
                ));

                /** @var ProgramKursus $program */
                $program = ProgramKursus::find($transaksi->program_id);

                // If program requires dorm and user doesn't have bed yet, assign dorm bed
                if ($program && ($program->requires_dorm ?? false)) {
                    $user = User::find($transaksi->user_id);
                    if ($user) {
                        $penempatan = $this->asramaService->assignRandomBed($user);

                        if ($penempatan) {
                            SafeBroadcast::run(fn () => BedAssignmentUpdated::dispatch(
                                $transaksi->user_id,
                                $penempatan->kamar_id,
                                $penempatan->ranjang_id,
                                $penempatan->kamar?->nomor_kamar,
                                sprintf('%02d', $penempatan->ranjang?->nomor_ranjang ?? 0),
                                'terisi',
                                'assigned'
                            ));
                        }
                    }
                }
            }

            return $transaksi;
        });
    }

    public function cancelPayment(Transaksi $transaksi): Transaksi
    {
        $oldStatus = $transaksi->status;

        $transaksi->update([
            'status' => 'cancelled',
        ]);

        SafeBroadcast::run(fn () => PaymentStatusUpdated::dispatch(
            $transaksi->user_id,
            $transaksi->kode_transaksi,
            $oldStatus,
            'cancelled',
            null
        ));

        return $transaksi;
    }

    public function submitBuktiProof(Transaksi $transaksi, string $metode, string $buktiPath): Transaksi
    {
        $transaksi->update([
            'metode_pembayaran' => $metode,
            'bukti_pembayaran' => $buktiPath,
            'expired_at' => null,
            'status' => 'pending',
        ]);

        SafeBroadcast::run(fn () => DataChanged::dispatch('pembayaran', 'updated'));
        SafeBroadcast::run(fn () => PaymentStatusUpdated::dispatch(
            $transaksi->user_id,
            $transaksi->kode_transaksi,
            $transaksi->status,
            $transaksi->status,
            null
        ));

        return $transaksi;
    }

    public function approvePayment(Transaksi $transaksi, User $verifier): Transaksi
    {
        if ($transaksi->status === 'paid') {
            return $transaksi;
        }

        return $this->processPaymentSuccess($transaksi->kode_transaksi, $verifier->id);
    }

    public function rejectPayment(Transaksi $transaksi, User $verifier): Transaksi
    {
        if ($transaksi->status !== 'pending') {
            return $transaksi;
        }

        $oldStatus = $transaksi->status;

        $transaksi->update([
            'status' => 'failed',
            'verified_by' => $verifier->id,
            'verified_at' => now(),
        ]);

        SafeBroadcast::run(fn () => PaymentStatusUpdated::dispatch(
            $transaksi->user_id,
            $transaksi->kode_transaksi,
            $oldStatus,
            'failed',
            null
        ));
        SafeBroadcast::run(fn () => DataChanged::dispatch('pembayaran', 'updated'));

        return $transaksi;
    }
}
