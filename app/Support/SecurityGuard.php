<?php

namespace App\Support;

use App\Models\SecurityLog;
use Illuminate\Support\Facades\Cache;

class SecurityGuard
{
    public static function isBanned(string $ip): bool
    {
        return Cache::has(config('firewall.ban_cache_prefix').$ip);
    }

    public static function ban(string $ip, ?int $minutes = null, string $reason = 'melanggar batas keamanan'): void
    {
        $minutes ??= (int) config('firewall.ban_minutes', 60);

        Cache::put(config('firewall.ban_cache_prefix').$ip, now()->timestamp, now()->addMinutes($minutes));

        logger()->channel('security')->warning('IP diban sementara', [
            'ip' => $ip,
            'minutes' => $minutes,
            'reason' => $reason,
        ]);

        self::recordEndpoint('banned', $ip, [
            'keterangan' => $reason,
            'path' => null,
        ]);
    }

    public static function unban(string $ip): void
    {
        Cache::forget(config('firewall.ban_cache_prefix').$ip);

        self::recordEndpoint('unbanned', $ip, [
            'keterangan' => 'Pembatalan banned secara manual oleh admin.',
            'path' => null,
        ]);
    }

    /**
     * Daftar IP yang sedang diban aktif beserta sisa waktunya.
     * Sumber kebenaran adalah cache, namun daftar direkonstruksi dari
     * catatan database dengan memotong entri yang sudah kedaluwarsa.
     *
     * @return array<int, array{ip: string, reason: ?string, banned_at: string, remaining_minutes: int}>
     */
    public static function activeBans(): array
    {
        try {
            $entries = SecurityLog::query()
                ->where('tipe', SecurityLog::TIPE_BANNED)
                ->orderByDesc('created_at')
                ->get();
        } catch (\Throwable $e) {
            return [];
        }

        $latestByIp = [];

        foreach ($entries as $entry) {
            $ip = (string) $entry->ip_address;

            if ($ip === '' || isset($latestByIp[$ip])) {
                continue;
            }

            $latestByIp[$ip] = $entry;
        }

        $minutes = (int) config('firewall.ban_minutes', 60);
        $now = now();
        $result = [];

        foreach ($latestByIp as $ip => $entry) {
            $expiresAt = $entry->created_at->addMinutes($minutes);

            if ($expiresAt->isPast()) {
                continue;
            }

            if (! self::isBanned($ip)) {
                continue;
            }

            $result[] = [
                'ip' => $ip,
                'reason' => $entry->keterangan,
                'banned_at' => $entry->created_at->toIso8601String(),
                'remaining_minutes' => max(0, $now->diffInMinutes($expiresAt)),
            ];
        }

        return $result;
    }

    /**
     * Tulis satu entri ke tabel security_logs. Dipanggil dalam konteks
     * firewall sehingga kegagalan database tidak boleh menghentikan request.
     */
    public static function recordEndpoint(string $tipe, ?string $ip, array $data = [], ?int $userId = null): void
    {
        try {
            SecurityLog::create([
                'tipe' => $tipe,
                'user_id' => $userId,
                'ip_address' => $ip,
                'browser' => $data['browser'] ?? null,
                'sistem_operasi' => $data['sistem_operasi'] ?? null,
                'path' => $data['path'] ?? null,
                'keterangan' => $data['keterangan'] ?? null,
            ]);
        } catch (\Throwable $e) {
            logger()->channel('security')->warning('Gagal mencatat security_log', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Catat satu pelanggaran pola dari IP tersebut.
     * Mengembalikan true jika IP sudah melewati batas dan harus diban.
     */
    public static function registerBlocked(string $ip, string $reason): bool
    {
        $key = config('firewall.cache_prefix').'hits:'.$ip;
        $hits = (int) Cache::get($key, 0) + 1;

        Cache::put($key, $hits, now()->addMinutes(10));

        logger()->channel('security')->warning('Aktivitas mencurigakan diblokir', [
            'ip' => $ip,
            'reason' => $reason,
            'hits' => $hits,
        ]);

        self::recordEndpoint(SecurityLog::TIPE_DIBLOKIR, $ip, [
            'keterangan' => $reason,
        ]);

        $max = (int) config('firewall.max_blocked_hits', 5);

        if ($hits >= $max) {
            Cache::forget($key);
            self::ban($ip, reason: 'banyak pelanggaran: '.$reason);

            return true;
        }

        return false;
    }

    public static function recordLoginFailure(string $ip): void
    {
        $key = config('firewall.cache_prefix').'login:'.$ip;
        $count = (int) Cache::get($key, 0) + 1;

        Cache::put($key, $count, now()->addMinutes(15));

        if ($count >= (int) config('firewall.failed_login_threshold', 8)) {
            Cache::forget($key);
            self::ban($ip, reason: 'terlalu banyak percobaan login gagal');
            logger()->channel('security')->error('Terlalu banyak percobaan login gagal', [
                'ip' => $ip,
                'count' => $count,
            ]);
        }
    }

    public static function clearLoginFailures(string $ip): void
    {
        Cache::forget(config('firewall.cache_prefix').'login:'.$ip);
    }

    /**
     * Pindai satu string terhadap pola firewall.
     * Mengembalikan label pola yang cocok, atau null jika aman.
     */
    public static function scanString(string $value, bool $isUri): ?string
    {
        $length = strlen($value);

        if ($length === 0 || $length > (int) config('firewall.max_input_scan_length', 4096)) {
            return null;
        }

        $patterns = $isUri
            ? (array) config('firewall.uri_patterns')
            : (array) config('firewall.body_patterns');

        foreach ($patterns as $label => $pattern) {
            if (@preg_match($pattern, $value)) {
                return (string) $label;
            }
        }

        return null;
    }

    /**
     * Periksa apakah IP cocok dengan daftar (dukung CIDR & wildcard parsial).
     */
    public static function ipInList(string $ip, array $list): bool
    {
        foreach ($list as $entry) {
            $entry = trim($entry);

            if ($entry === '') {
                continue;
            }

            if (str_contains($entry, '/')) {
                if (self::ipMatchesCidr($ip, $entry)) {
                    return true;
                }

                continue;
            }

            if (str_contains($entry, '*')) {
                $pattern = '/^'.str_replace('\*', '[0-9]+', preg_quote($entry, '/')).'$/';

                if (preg_match($pattern, $ip)) {
                    return true;
                }

                continue;
            }

            if ($ip === $entry) {
                return true;
            }
        }

        return false;
    }

    private static function ipMatchesCidr(string $ip, string $cidr): bool
    {
        [$subnet, $bits] = array_pad(explode('/', $cidr, 2), 2, null);

        if ($bits === null || ! ctype_digit($bits)) {
            return $ip === $subnet;
        }

        $bits = (int) $bits;

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) && filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $mask = (-1 << (32 - $bits)) & 0xFFFFFFFF;
            $ipLong = ip2long($ip);
            $subnetLong = ip2long($subnet);

            return $ipLong !== false && $subnetLong !== false
                && ($ipLong & $mask) === ($subnetLong & $mask);
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) && filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)
            && $bits >= 0 && $bits <= 128) {
            $ipBin = inet_pton($ip);
            $subnetBin = inet_pton($subnet);
            $fullBytes = intdiv($bits, 8);
            $remainderBits = $bits % 8;

            if ($ipBin === false || $subnetBin === false) {
                return false;
            }

            for ($i = 0; $i < $fullBytes; $i++) {
                if ($ipBin[$i] !== $subnetBin[$i]) {
                    return false;
                }
            }

            if ($remainderBits > 0) {
                $mask = (0xFF << (8 - $remainderBits)) & 0xFF;

                return (ord($ipBin[$fullBytes]) & $mask) === (ord($subnetBin[$fullBytes]) & $mask);
            }

            return true;
        }

        return $ip === $subnet;
    }
}
