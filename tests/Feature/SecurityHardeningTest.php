<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use DatabaseTransactions;

    public function test_halaman_login_tidak_boleh_di_cache(): void
    {
        $this->get('/login')->assertOk();

        $this->get('/login')
            ->assertHeaderContains('Cache-Control', 'no-store')
            ->assertHeader('Pragma', 'no-cache');
    }

    public function test_halaman_admin_login_tidak_boleh_di_cache(): void
    {
        $this->get('/admin/login')->assertOk()
            ->assertHeaderContains('Cache-Control', 'no-store');
    }

    public function test_halaman_panel_siswa_tidak_boleh_di_cache(): void
    {
        $siswa = User::create([
            'username' => 'siswacache',
            'name' => 'Siswa Cache',
            'email' => 'siswacache@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'student',
            'status' => 'aktif',
        ]);

        $this->actingAs($siswa)
            ->get('/siswa')
            ->assertOk()
            ->assertHeaderContains('Cache-Control', 'no-store');
    }

    public function test_halaman_public_landing_untuk_user_belum_login(): void
    {
        $this->get('/')->assertOk();
    }

    public function test_honeypot_login_siswa_ditolak_ketika_terisi(): void
    {
        $this->post('/login', [
            'username' => 'penyerang',
            'password' => 'sandi',
            'website' => 'https://spam.example.com',
        ])->assertSessionHasErrors('website');
    }

    public function test_honeypot_login_admin_ditolak_ketika_terisi(): void
    {
        $this->post('/admin/login', [
            'username' => 'admin',
            'password' => 'sandi',
            'website' => 'https://spam.example.com',
        ])->assertSessionHasErrors('website');
    }

    public function test_login_tanpa_honeypot_berjalan_normal(): void
    {
        $user = User::create([
            'username' => 'useraman',
            'name' => 'User Aman',
            'email' => 'useraman@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'student',
            'status' => 'aktif',
        ]);

        $this->post('/login', [
            'username' => 'useraman',
            'password' => 'secret123',
        ])->assertRedirect();
    }

    public function test_koneksi_postgresql_konfigurasi_sslmode(): void
    {
        $this->assertSame(
            env('DB_SSLMODE', 'prefer'),
            config('database.connections.pgsql.sslmode')
        );

        $this->assertSame(
            'pgsql',
            config('database.default')
        );
    }
}
