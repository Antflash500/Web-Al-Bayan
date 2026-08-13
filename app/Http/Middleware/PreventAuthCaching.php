<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventAuthCaching
{
    /**
     * Cegah halaman yang sensitif disimpan di cache browser/CDN.
     * Berlaku untuk halaman login, profil siswa, panel admin, dan pembayaran.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->sensitive($request)) {
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
        }

        return $response;
    }

    private function sensitive(Request $request): bool
    {
        $path = $request->path();

        if (in_array($path, ['login', 'admin/login', 'register', 'verify-otp', 'forgot-password'], true)) {
            return true;
        }

        return in_array($path, ['dashboard', 'admin', 'siswa', 'profil', 'pembayaran'], true)
            || $request->is('dashboard/*') || $request->is('admin/*')
            || $request->is('siswa/*') || $request->is('profil/*')
            || $request->is('pembayaran/*');
    }
}
