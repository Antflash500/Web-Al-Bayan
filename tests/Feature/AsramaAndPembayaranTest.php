<?php

namespace Tests\Feature;

use App\Models\Kamar;
use App\Models\Kasur;
use App\Models\ProgramKursus;
use App\Models\Ranjang;
use App\Models\Rumah;
use App\Models\User;
use App\Services\AsramaService;
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

        // 3. Create 1 house, 2 rooms and 24 kasur (12 ranjang tingkat)
        $rumah = Rumah::create([
            'nama' => 'Rumah Test Auto',
            'status' => 'aktif',
        ]);

        for ($i = 1; $i <= 2; $i++) {
            $kamar = Kamar::create([
                'rumah_id' => $rumah->id,
                'nomor_kamar' => 'AUTO-'.sprintf('%02d', $i),
                'kapasitas' => 6,
                'status' => 'tersedia',
            ]);

            for ($r = 1; $r <= 6; $r++) {
                $ranjang = Ranjang::create([
                    'kamar_id' => $kamar->id,
                    'nomor_ranjang' => $r,
                    'status' => 'tersedia',
                ]);

                Kasur::create(['ranjang_id' => $ranjang->id, 'posisi' => 'atas', 'status' => 'tersedia']);
                Kasur::create(['ranjang_id' => $ranjang->id, 'posisi' => 'bawah', 'status' => 'tersedia']);
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

        // Student should have a kasur placement
        $this->assertDatabaseHas('penempatan_asrama', [
            'user_id' => $student->id,
            'status' => 'aktif',
        ]);

        // Satu kasur pada rumah baru ini harus terisi (asisasi tanpa
        // terganggu data kasur lain yang mungkin sudah ada di database).
        $this->assertEquals(1, Kasur::where('status', 'terisi')
            ->whereHas('ranjang.kamar', fn ($q) => $q->where('rumah_id', $rumah->id))
            ->count()
        );

        // Ranjang pada rumah baru seharusnya batas (sebagian/terisi)
        $this->assertGreaterThanOrEqual(1, Ranjang::whereHas('kamar', fn ($q) => $q->where('rumah_id', $rumah->id))
            ->whereIn('status', ['sebagian', 'terisi'])
            ->count()
        );

        // Student can open the asrama page (renders without error)
        $this->actingAs($student);
        $this->get('/siswa/asrama')->assertOk();
    }

    public function test_admin_asrama_page_renders(): void
    {
        $admin = User::create([
            'username' => 'asramaadmin',
            'name' => 'Asrama Admin',
            'email' => 'asramaadmin@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_AKTIF,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin);
        $this->get('/admin/asrama')->assertOk();
    }

    public function test_manual_assign_and_vacate_kasur_by_position(): void
    {
        $student = User::create([
            'username' => 'manualstudent',
            'name' => 'Manual Student',
            'email' => 'manual@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        $rumah = Rumah::create(['nama' => 'Rumah Test Manual', 'status' => 'aktif']);
        $kamar = Kamar::create([
            'rumah_id' => $rumah->id,
            'nomor_kamar' => 'MANUAL-01',
            'kapasitas' => 1,
            'status' => 'tersedia',
        ]);
        $ranjang = Ranjang::create(['kamar_id' => $kamar->id, 'nomor_ranjang' => 1, 'status' => 'tersedia']);
        $kasurAtas = Kasur::create(['ranjang_id' => $ranjang->id, 'posisi' => 'atas', 'status' => 'tersedia']);
        $kasurBawah = Kasur::create(['ranjang_id' => $ranjang->id, 'posisi' => 'bawah', 'status' => 'tersedia']);

        /** @var AsramaService $service */
        $service = app(AsramaService::class);

        $penempatan = $service->assignManualBed($student, $kasurAtas->id, $student);

        $this->assertDatabaseHas('penempatan_asrama', [
            'user_id' => $student->id,
            'kasur_id' => $kasurAtas->id,
            'status' => 'aktif',
        ]);
        $this->assertEquals('terisi', $kasurAtas->fresh()->status);
        $this->assertEquals('sebagian', $ranjang->fresh()->status);

        // Vacate
        $service->vacateBed($kasurAtas->id);

        $this->assertEquals('tersedia', $kasurAtas->fresh()->status);
        $this->assertEquals('tersedia', $ranjang->fresh()->status);
        $this->assertDatabaseMissing('penempatan_asrama', [
            'user_id' => $student->id,
            'kasur_id' => $kasurAtas->id,
            'status' => 'aktif',
        ]);
    }
}
