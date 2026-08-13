<?php

namespace Tests\Feature;

use App\Models\ProgramKursus;
use App\Models\Transaksi;
use App\Models\User;
use App\Services\PembayaranService;
use App\Services\PythonRunner;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UnduhDokumenTest extends TestCase
{
    use DatabaseTransactions;

    private function pythonAvailable(): bool
    {
        try {
            $runner = new PythonRunner;

            return $runner->run([$runner->binary(), '-c', 'import PIL; print(1)'], 15)['code'] === 0;
        } catch (\Throwable) {
            return false;
        }
    }

    public function test_unduh_biodata_png(): void
    {
        if (! $this->pythonAvailable()) {
            $this->markTestSkipped('Python + PIL tidak tersedia di mesin ini.');
        }

        $student = User::create([
            'username' => 'unduhbiodata',
            'name' => 'Siswa Unduh',
            'email' => 'unduh@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($student);

        $response = $this->get('/siswa/biodata/unduh');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'image/png');

        $disposition = (string) $response->headers->get('Content-Disposition', '');
        $this->assertStringStartsWith('attachment; filename="biodata_', $disposition);
    }

    public function test_unduh_kwitansi_png_untuk_transaksi_lunas(): void
    {
        if (! $this->pythonAvailable()) {
            $this->markTestSkipped('Python + PIL tidak tersedia di mesin ini.');
        }

        $student = User::create([
            'username' => 'unduhkwitansi',
            'name' => 'Siswa Kwitansi',
            'email' => 'kwitansi@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        $program = ProgramKursus::create([
            'nama_program' => 'Test Kwitansi Program',
            'slug' => 'test-kwitansi-program-'.uniqid(),
            'harga' => 100000,
            'status' => 'aktif',
            'requires_dorm' => false,
        ]);

        /** @var PembayaranService $pembayaran */
        $pembayaran = app(PembayaranService::class);
        $transaksi = $pembayaran->createCheckout($student, $program, 'QRIS');
        $pembayaran->processPaymentSuccess($transaksi->kode_transaksi);

        $this->actingAs($student);

        $response = $this->get("/siswa/pembayaran/{$transaksi->id}/kwitansi");

        $response->assertOk();
        $response->assertHeader('Content-Type', 'image/png');

        $disposition = (string) $response->headers->get('Content-Disposition', '');
        $this->assertStringStartsWith('attachment; filename="kwitansi_', $disposition);
    }

    public function test_kwitansi_ditolak_untuk_transaksi_milik_user_lain(): void
    {
        $owner = User::create([
            'username' => 'pemilikkwitansi',
            'name' => 'Pemilik',
            'email' => 'pemilik@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        $transaksi = Transaksi::create([
            'user_id' => $owner->id,
            'kode_transaksi' => 'TEST-'.strtoupper(uniqid()),
            'jumlah' => 100000,
            'status' => 'paid',
        ]);

        $intruder = User::create([
            'username' => 'penyusup',
            'name' => 'Penyusup',
            'email' => 'penyusup@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($intruder);

        $response = $this->get("/siswa/pembayaran/{$transaksi->id}/kwitansi");

        $response->assertStatus(403);
    }
}