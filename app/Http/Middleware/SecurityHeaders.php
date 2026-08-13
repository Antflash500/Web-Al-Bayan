<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $isProduction = app()->environment('production');

        // Hardening sesi saat production (dieksekusi sebelum session middleware).
        if ($isProduction) {
            config()->set('session.secure', true);
            config()->set('session.encrypt', true);
        }

        // Jangan pernah menyalakan debug di production — ini kebocoran data.
        if ($isProduction && config('app.debug')) {
            Log::channel('security')->critical('APP_DEBUG diset ke true di environment production');

            return response('Service Unavailable', 503, [
                'Cache-Control' => 'no-store',
            ]);
        }

        // Paksa HTTPS saat dipasang di belakang proxy (contoh nginx) dan diaktifkan.
        if ($isProduction && config('app.force_https') && ! $request->isSecure()) {
            $query = $request->getQueryString();

            return redirect()->secure($request->path().($query ? '?'.$query : ''));
        }

        $response = $next($request);

        if (! $response instanceof Response) {
            return $response;
        }

        foreach ($this->headers($request, $isProduction) as $name => $value) {
            if (! $response->headers->has($name)) {
                $response->headers->set($name, $value);
            }
        }

        return $response;
    }

    private function headers(Request $request, bool $isProduction): array
    {
        $headers = [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Permissions-Policy' => 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
            'X-Permitted-Cross-Domain-Policies' => 'none',
            'Content-Security-Policy' => $this->csp($isProduction, $request->isSecure()),
        ];

        if ($request->isSecure()) {
            $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
        }

        return $headers;
    }

    private function csp(bool $isProduction, bool $isSecure): string
    {
        // 'unsafe-inline' untuk script hanya diizinkan saat non-production
        // karena Vite/React-refresh menyuntikkan preamble inline di mode dev.
        $scriptSrc = $isProduction ? "'self'" : "'self' 'unsafe-inline'";

        $directives = [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "manifest-src 'self'",
            "script-src {$scriptSrc}",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob:",
            'connect-src \'self\' ws: wss:',
            'frame-src https://www.youtube.com https://www.youtube-nocookie.com',
        ];

        if ($isSecure) {
            $directives[] = 'upgrade-insecure-requests';
        }

        return implode('; ', $directives);
    }
}