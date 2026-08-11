<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_if(! $user, 401);

        $normalized = $user->isAdmin() ? 'admin' : 'siswa';

        if (! in_array($normalized, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
