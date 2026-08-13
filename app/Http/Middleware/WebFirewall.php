<?php

namespace App\Http\Middleware;

use App\Support\SecurityGuard;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WebFirewall
{
    public function handle(Request $request, Closure $next): Response
    {
        $ip = (string) $request->ip();

        // IP yang masuk allowlist selalu dilewati (mis. admin internal / payment gateway).
        if (SecurityGuard::ipInList($ip, (array) config('firewall.allowed_ips'))) {
            return $next($request);
        }

        // IP yang sedang diban sementara.
        if (SecurityGuard::isBanned($ip)) {
            return $this->deny($ip, 'Akses ditolak karena aktivitas mencurigakan.');
        }

        // IP blocklist permanen.
        if (SecurityGuard::ipInList($ip, (array) config('firewall.blocked_ips'))) {
            return $this->deny($ip, 'Akses ditolak.');
        }

        // Firewall khusus area admin: hanya IP terdaftar (jika dikonfigurasi).
        if ($request->is('admin') || $request->is('admin/*')) {
            $adminAllowed = (array) config('firewall.admin_allowed_ips');

            if ($adminAllowed !== [] && ! SecurityGuard::ipInList($ip, $adminAllowed)) {
                logger()->channel('security')->warning('Akses admin diblokir oleh IP allowlist', [
                    'ip' => $ip,
                    'path' => $request->path(),
                ]);

                return $this->deny($ip, 'Akses ditolak.');
            }
        }

        // User-agent scanner.
        foreach ((array) config('firewall.bad_user_agents') as $token) {
            if (stripos((string) $request->userAgent(), $token) !== false) {
                SecurityGuard::registerBlocked($ip, 'bad-user-agent:'.strtolower($token));

                return $this->deny($ip, 'Akses ditolak.');
            }
        }

        // Path & query string. Aset statis & berkas media dikecualikan dari
        // pindai pola umum karena nama file hashed bisa menyerupai token berbahaya;
        // namun pindai traversal/CRLF tetap diberlakukan di atasnya.
        $uriValues = [$request->getRequestUri(), rawurldecode($request->getRequestUri())];
        $uriReason = null;

        if ($request->is('media/*') || $request->is('build/*') || $request->is('storage/*') || $request->path() === 'up') {
            $restricted = [
                'traversal' => '/(?:\.\.\/|\.\.\\\\)/',
                'traversal-encode' => '/%2e%2e(?:%2f|%5c|\/)/i',
                'crlf' => '/%0d%0a/i',
                'nullbyte' => '/%00/i',
            ];

            foreach ($uriValues as $uriValue) {
                foreach ($restricted as $label => $pattern) {
                    if (preg_match($pattern, $uriValue)) {
                        $uriReason = $label;
                        break 2;
                    }
                }
            }
        } else {
            foreach ($uriValues as $uriValue) {
                $uriReason = SecurityGuard::scanString($uriValue, true);

                if ($uriReason !== null) {
                    break;
                }
            }
        }

        if ($uriReason !== null) {
            SecurityGuard::registerBlocked($ip, 'uri:'.$uriReason);

            return $this->deny($ip, 'Akses ditolak.');
        }

        // Referer (CRLF/null byte).
        $referer = (string) $request->headers->get('referer', '');

        if ($referer !== '') {
            $refererReason = SecurityGuard::scanString($referer, false);

            if (in_array($refererReason, ['crlf-null', 'nullbyte', 'crlf'], true)) {
                SecurityGuard::registerBlocked($ip, 'referer:'.$refererReason);

                return $this->deny($ip, 'Akses ditolak.');
            }
        }

        // Body / form input (kecuali password agar tidak memblokir pengguna sah).
        foreach ($request->all() as $key => $value) {
            if ($key === 'password' || $key === 'password_confirmation') {
                continue;
            }

            $reason = $this->scanValue($value);

            if ($reason !== null) {
                SecurityGuard::registerBlocked($ip, 'payload:'.$reason);

                return $this->deny($ip, 'Akses ditolak.');
            }
        }

        return $next($request);
    }

    private function scanValue(mixed $value): ?string
    {
        if (is_array($value)) {
            foreach ($value as $nested) {
                $reason = $this->scanValue($nested);

                if ($reason !== null) {
                    return $reason;
                }
            }

            return null;
        }

        if (! is_string($value)) {
            return null;
        }

        return SecurityGuard::scanString($value, false);
    }

    private function deny(string $ip, string $message): Response
    {
        return response($message, 403, [
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}