<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\SecurityGuard;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SecurityPageTest extends TestCase
{
    use DatabaseTransactions;

    public function test_security_page_renders_for_admin(): void
    {
        $admin = User::create([
            'username' => 'adminsec',
            'name' => 'Admin Security',
            'email' => 'adminsec@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $this->actingAs($admin)
            ->get('/admin/security')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Security')
                ->has('summary')
                ->has('posture.score')
                ->has('sessions')
                ->has('loginHistory')
                ->has('events')
                ->has('bannedIps'));
    }

    public function test_security_page_rejects_student(): void
    {
        $student = User::create([
            'username' => 'siswasec',
            'name' => 'Siswa Security',
            'email' => 'siswasec@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'student',
            'status' => 'aktif',
        ]);

        $this->actingAs($student)
            ->get('/admin/security')
            ->assertForbidden();
    }

    public function test_successful_login_is_recorded(): void
    {
        $user = User::create([
            'username' => 'userlogin',
            'name' => 'User Login',
            'email' => 'userlogin@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'student',
            'status' => 'aktif',
        ]);

        $this->withHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0) Chrome/126.0')
            ->post('/login', [
                'username' => 'userlogin',
                'password' => 'secret123',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('riwayat_login', [
            'user_id' => $user->id,
            'browser' => 'Chrome',
            'status' => 'berhasil',
        ]);

        $this->assertDatabaseHas('security_logs', [
            'user_id' => $user->id,
            'tipe' => 'login_sukses',
        ]);
    }

    public function test_security_logs_record_failed_login(): void
    {
        $this->withHeader('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) Firefox/127.0')
            ->post('/login', [
                'username' => 'unknown-user',
                'password' => 'wrong',
            ])
            ->assertSessionHasErrors('username');

        $this->assertDatabaseHas('security_logs', [
            'tipe' => 'login_gagal',
            'browser' => 'Firefox',
            'sistem_operasi' => 'Linux',
        ]);
    }

    public function test_admin_can_ban_and_unban_ip(): void
    {
        $admin = User::create([
            'username' => 'adminban',
            'name' => 'Admin Ban',
            'email' => 'adminban@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $this->actingAs($admin)
            ->post('/admin/security/ban', ['ip' => '198.51.100.42'])
            ->assertRedirect();

        $this->assertTrue(SecurityGuard::isBanned('198.51.100.42'));
        $this->assertDatabaseHas('security_logs', [
            'tipe' => 'banned',
            'ip_address' => '198.51.100.42',
        ]);

        $this->actingAs($admin)
            ->post('/admin/security/unban', ['ip' => '198.51.100.42'])
            ->assertRedirect();

        $this->assertFalse(SecurityGuard::isBanned('198.51.100.42'));
    }
}