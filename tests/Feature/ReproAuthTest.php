<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ReproAuthTest extends TestCase
{
    use DatabaseTransactions;

    public function test_student_registration_pending_admin_approval_login_flow(): void
    {
        // 1. Landing page renders programs
        $landing = $this->get('/');
        fwrite(STDERR, "\n[GET /] status=".$landing->status().PHP_EOL);

        // Register page loads
        $registerPage = $this->get('/register');
        fwrite(STDERR, '[GET /register] status='.$registerPage->status().PHP_EOL);

        // 2. Submit register WITHOUT email/password credentials
        $nik = '317205'.mt_rand(1000000000, 9999999999);
        $register = $this->post('/register', [
            'full_name' => 'Budi Flow Test',
            'nik' => $nik,
            'address' => 'Jl. Contoh No. 10, Jember',
            'birth_date' => '2001-06-14',
            'gender' => 'male',
        ], ['X-Inertia' => 'true']);
        fwrite(STDERR, '[POST /register] status='.$register->status().' redirect='.$register->headers->get('Location').PHP_EOL);
        fwrite(STDERR, '[POST /register] errors='.json_encode(session('errors') ?? []).PHP_EOL);

        // Register must NOT redirect to login anymore; it shows the "menunggu konfirmasi admin" page
        $register->assertRedirect(route('register.success'));

        $user = User::orderByDesc('id')->first();
        $this->assertNotNull($user, 'user harus tersimpan');
        fwrite(STDERR, '[DB] user id='.$user->id.' name='.$user->name.' username='.var_export($user->username, true).' status='.$user->status.PHP_EOL);

        // Pending accounts have NO credentials yet
        $this->assertNull($user->username);
        $this->assertNull($user->email);
        $this->assertNull($user->password);
        $this->assertEquals(User::STATUS_PENDING, $user->status);

        $profile = $user->profile;
        $this->assertNotNull($profile, 'student_profile harus ada');
        $this->assertEquals($nik, $profile->nik);
        $this->assertEquals('pending', $profile->registration_status);
        fwrite(STDERR, '[DB] profile full_name='.$profile?->full_name.' nik='.$profile?->nik.' registration_status='.$profile?->registration_status.PHP_EOL);

        // After register user must be GUEST (no auto-login)
        $this->assertGuest();

        // 3. Duplicate NIK must be rejected by backend (16-digit business rule + unique)
        $duplicate = $this->post('/register', [
            'full_name' => 'Dup Test',
            'nik' => $nik,
            'address' => 'Jl. Lain No. 1',
            'birth_date' => '2002-01-01',
            'gender' => 'female',
        ], ['X-Inertia' => 'true']);
        $duplicate->assertSessionHasErrors('nik');
        fwrite(STDERR, '[POST /register] duplicate NIK status='.$duplicate->status().PHP_EOL);

        // 4. NIK shorter/longer than 16 digits must be rejected even via manipulated request
        $badNik = $this->post('/register', [
            'full_name' => 'Bad Nik Test',
            'nik' => '1234567890',
            'address' => 'Jl. Test',
            'birth_date' => '2000-01-01',
            'gender' => 'male',
        ], ['X-Inertia' => 'true']);
        $badNik->assertSessionHasErrors('nik');
        fwrite(STDERR, '[POST /register] short NIK status='.$badNik->status().PHP_EOL);

        // 5. Pending student CANNOT login (no credentials + status pending)
        $loginAttempt = $this->post('/login', [
            'username' => 'whatever',
            'password' => 'Password123!',
        ]);
        $this->assertGuest();
        fwrite(STDERR, '[POST /login] pending attempt status='.$loginAttempt->status().PHP_EOL);

        // 6. Admin approves the registration and creates username + password
        $admin = User::create([
            'name' => 'Admin Test',
            'username' => 'admintest',
            'email' => 'admintest@example.com',
            'password' => bcrypt('Admin123!'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_AKTIF,
            'email_verified_at' => now(),
        ]);
        $this->actingAs($admin);

        $approve = $this->post("/admin/pendaftaran/{$user->id}/approve", [
            'username' => 'budi.flow',
            'password' => 'Siswa123!',
        ], ['X-Inertia' => 'true']);
        fwrite(STDERR, "[POST /admin/pendaftaran/{$user->id}/approve] status=".$approve->status().PHP_EOL);
        $approve->assertSessionHas('success');

        $user->refresh();
        $this->assertEquals('budi.flow', $user->username);
        $this->assertEquals(User::STATUS_AKTIF, $user->status);
        $this->assertTrue(password_verify('Siswa123!', $user->password));
        $this->assertEquals('approved', $user->profile->registration_status);

        $this->post('/logout');

        // 7. Now login with the admin-created username + password
        $login = $this->post('/login', [
            'username' => 'budi.flow',
            'password' => 'Siswa123!',
        ]);
        fwrite(STDERR, '[POST /login] status='.$login->status().' redirect='.$login->headers->get('Location').PHP_EOL);
        fwrite(STDERR, '[POST /login] errors='.json_encode(session('errors') ?? []).PHP_EOL);

        $this->assertAuthenticated();

        $dashboard = $this->get('/siswa');
        fwrite(STDERR, '[GET /siswa] status='.$dashboard->status().PHP_EOL);

        // 8. Logged-in student opening /login or /register should go to /siswa (NOT /admin)
        $this->get('/login')->assertRedirect(route('siswa.dashboard'));
        $this->get('/register')->assertRedirect(route('siswa.dashboard'));
    }

    public function test_admin_login_and_redirect_still_works(): void
    {
        $admin = User::create([
            'name' => 'Admin Test',
            'username' => 'admintest2',
            'email' => 'admintest2@example.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_AKTIF,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin);
        $this->get('/register')->assertRedirect(route('admin.home'));
        $this->get('/login')->assertRedirect(route('admin.home'));
    }
}
