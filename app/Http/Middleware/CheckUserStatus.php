<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();

            if (in_array($user->status, ['nonaktif', 'blocked', 'pending'], true)) {
                if ($request->route()?->getAction('uses') !== 'App\Http\Controllers\Auth\LogoutController@destroy') {
                    auth()->logout();

                    if ($request->expectsJson()) {
                        return response()->json(['message' => 'Akun Anda tidak aktif'], 403);
                    }

                    return redirect('/login')->withErrors([
                        'email' => $user->status === 'pending'
                            ? 'Akun Anda masih menunggu konfirmasi admin.'
                            : 'Akun Anda tidak aktif. Hubungi administrator.',
                    ]);
                }
            }
        }

        return $next($request);
    }
}
