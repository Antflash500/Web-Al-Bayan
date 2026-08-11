<?php

namespace Tests\Feature;

use App\Models\Kamar;
use App\Models\ProgramKursus;
use App\Models\Ranjang;
use App\Models\User;
use App\Services\PembayaranService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AsramaAndPembayaranTest extends TestCase
{
    use DatabaseTransactions;

    public function test_automatic_random_bed_assignment_on_payment_success(): void
    {
        // 1. Create a student user
        /** @var User $student */
        $student = User::create([
            'username' => 'teststudent',
            'name' => 'Test Student',
            'email' => 'student@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        // 2. Create a program that requires dorm
        /** @var ProgramKursus $program */
        $program = ProgramKursus::create([
            'nama_program' => 'Arabic Intermediate',
            'slug' => 'arabic-intermediate',
            'harga' => 1500000,
            'status' => 'aktif',
            'requires_dorm' => true,
        ]);

        // 3. Create 2 rooms and 12 beds
        for ($i = 1; $i <= 2; $i++) {
            $kamar = Kamar::create([
                'nomor_kamar' => sprintf('%02d', $i),
                'kapasitas' => 6,
                'status' => 'tersedia',
            ]);

            for ($r = 1; $r <= 6; $r++) {
                Ranjang::create([
                    'kamar_id' => $kamar->id,
                    'nomor_ranjang' => $r,
                    'status' => 'tersedia',
                ]);
            }
        }

        // 4. Perform checkout
        /** @var PembayaranService $pembayaranService */
        $pembayaranService = app(PembayaranService::class);
        $transaksi = $pembayaranService->createCheckout($student, $program, 'QRIS');

        $this->assertEquals('pending', $transaksi->status);
        $this->assertEquals(1500000, $transaksi->jumlah);

        // 5. Simulate successful payment
        $pembayaranService->processPaymentSuccess($transaksi->kode_transaksi);

        // 6. Assertions
        $transaksi->refresh();
        $this->assertEquals('paid', $transaksi->status);

        // Student should be enrolled
        $this->assertDatabaseHas('siswa_program', [
            'user_id' => $student->id,
            'program_id' => $program->id,
            'status' => 'aktif',
        ]);

        // Student should have a bed placement
        $this->assertDatabaseHas('penempatan_asrama', [
            'user_id' => $student->id,
            'status' => 'aktif',
        ]);

        // One bed should be marked occupied
        $occupiedBedsCount = Ranjang::where('status', 'terisi')->count();
        $this->assertEquals(1, $occupiedBedsCount);
    }
}
