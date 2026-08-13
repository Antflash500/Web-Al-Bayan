<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Batas percobaan login siswa + admin (anti brute-force per akun & per IP).
        RateLimiter::for('auth-login', function (Request $request) {
            $identifier = strtolower((string) $request->input('username', ''));

            return [
                Limit::perMinute(5)->by($request->ip().'|'.$identifier),
                Limit::perMinute(20)->by($request->ip()),
            ];
        });

        // Batas pendaftaran akun baru (anti bom registrasi / spam).
        RateLimiter::for('auth-register', function (Request $request) {
            return [
                Limit::perMinute(5)->by($request->ip()),
                Limit::perHour(25)->by($request->ip()),
            ];
        });

        // Batas permintaan OTP & verifikasi (anti brute-force OTP).
        RateLimiter::for('auth-otp', function (Request $request) {
            $identifier = strtolower((string) $request->input('email', ''));

            return [
                Limit::perMinute(4)->by($request->ip().'|'.$identifier),
                Limit::perMinute(12)->by($request->ip()),
            ];
        });

        // Batas webhook pembayaran publik (harus menoleransi burst normal gateway).
        RateLimiter::for('webhook', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));

        // Batas umum untuk endpoint heartbeat (jarang — 45 detik).
        RateLimiter::for('heartbeat', fn (Request $request) => Limit::perMinute(20)->by($request->ip()));

        // Batas pemindaian port dari halaman admin Keamanan (anti abuse).
        RateLimiter::for('admin-port-scan', fn (Request $request) => Limit::perMinute(2)->by($request->ip()));

        // Batas aksi keamanan ringan: snapshot monitoring & self-test WAF.
        RateLimiter::for('admin-security-check', fn (Request $request) => [
            Limit::perMinute(5)->by($request->ip()),
            Limit::perHour(30)->by($request->ip()),
        ]);
    }
}
