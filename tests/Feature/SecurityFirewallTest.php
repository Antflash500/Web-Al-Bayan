<?php

namespace Tests\Feature;

use App\Support\SecurityGuard;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SecurityFirewallTest extends TestCase
{
    use DatabaseTransactions;

    public function test_security_headers_present_on_all_pages(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Content-Security-Policy');
        $this->assertStringContainsString("frame-ancestors 'none'", $response->headers->get('Content-Security-Policy'));
        $this->assertStringContainsString("object-src 'none'", $response->headers->get('Content-Security-Policy'));
    }

    public function test_malicious_query_is_blocked(): void
    {
        $this->get('/login?username=admin%27%20UNION%20SELECT%20password%20FROM%20users--')
            ->assertForbidden();
    }

    public function test_plain_sql_injection_in_query_is_blocked(): void
    {
        $this->get('/login?q=1+UNION+SELECT+1,2,3')
            ->assertForbidden();
    }

    public function test_script_tag_in_form_is_blocked(): void
    {
        $this->post('/register', [
            'full_name' => '<script>alert(1)</script>',
            'nik' => '3172051234567890',
            'email' => 'aman@example.com',
            'address' => 'Jl. Test',
            'birth_date' => '2000-01-01',
            'gender' => 'male',
        ])->assertForbidden();
    }

    public function test_known_scanner_user_agent_is_blocked(): void
    {
        $this->withHeader('User-Agent', 'sqlmap/1.7')
            ->get('/')
            ->assertForbidden();
    }

    public function test_login_is_rate_limited_after_repeated_attempts(): void
    {
        // 5x gagal seharusnya normal ditolak (redirect), yang ke-6 diblock 429.
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'username' => 'attacker',
                'password' => 'wrong-password',
            ])->assertSessionHasErrors('username');
        }

        $this->post('/login', [
            'username' => 'attacker',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    public function test_admin_ip_allowlist_blocks_unknown_ip(): void
    {
        config()->set('firewall.admin_allowed_ips', ['198.51.100.10']);

        $this->get('/admin/login')->assertForbidden();

        config()->set('firewall.admin_allowed_ips', ['127.0.0.1']);

        $this->get('/admin/login')->assertOk();
    }

    public function test_blocked_and_banned_ip_are_rejected(): void
    {
        SecurityGuard::ban('203.0.113.7', 30);

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.7'])
            ->get('/')
            ->assertForbidden();

        config()->set('firewall.blocked_ips', ['198.51.100.99']);

        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.99'])
            ->get('/')
            ->assertForbidden();
    }

    public function test_normal_pages_still_work(): void
    {
        $this->get('/')->assertOk();
        $this->get('/login')->assertOk();
        $this->get('/register')->assertOk();
        $this->get('/admin/login')->assertOk();
        $this->get('/tentang')->assertOk();
    }
}