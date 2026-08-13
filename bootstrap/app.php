<?php

use App\Http\Middleware\CheckUserStatus;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PreventAuthCaching;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\WebFirewall;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Auth;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(prepend: [
            PreventAuthCaching::class,
            SecurityHeaders::class,
            WebFirewall::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            CheckUserStatus::class,
        ]);

        $trustProxies = array_values(array_filter(array_map('trim', explode(',', (string) env('TRUST_PROXIES', '')))));

        if ($trustProxies !== []) {
            $middleware->trustProxies(at: $trustProxies);
        }

        $middleware->alias([
            'role' => EnsureRole::class,
            'status' => CheckUserStatus::class,
        ]);

        $middleware->redirectGuestsTo(fn (Request $request) => ($request->is('admin') || $request->is('admin/*') || $request->is('dashboard'))
            ? route('admin.login')
            : route('login'));
        $middleware->redirectUsersTo(fn () => auth()->user()?->isAdmin()
            ? route('admin.home')
            : route('siswa.dashboard'));
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (TokenMismatchException $e, Request $request) {
            if ($request->routeIs('logout')) {
                Auth::logout();

                if ($request->hasSession()) {
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                }

                return redirect()->route('home');
            }

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Sesi Anda telah berakhir. Silakan masuk kembali.'], 419);
            }

            return redirect()->route('login');
        });
    })->create();
