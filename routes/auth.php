<?php

use App\Http\Controllers\Admin\AdminAsramaController;
use App\Http\Controllers\Admin\AdminPembayaranController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\Siswa\HeartbeatController;
use App\Http\Controllers\Siswa\SiswaAsramaController;
use App\Http\Controllers\Siswa\SiswaDashboardController;
use App\Http\Controllers\Siswa\SiswaPembayaranController;
use App\Http\Controllers\Siswa\SiswaProfilController;
use App\Http\Controllers\Siswa\SiswaProgramController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/tentang', [LandingController::class, 'tentang'])->name('landing.tentang');
Route::get('/programs', [LandingController::class, 'program'])->name('landing.program');
Route::get('/galeri', [LandingController::class, 'galeri'])->name('landing.galeri');
Route::get('/kontak', [LandingController::class, 'kontak'])->name('landing.kontak');
Route::get('/media/programs/{path}', [MediaController::class, 'programImage'])
    ->where('path', '.*')
    ->name('media.program-image');

Route::get('/media/bukti/{path}', [MediaController::class, 'buktiImage'])
    ->where('path', '.*')
    ->name('media.bukti-image');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');

    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::get('/register/success', [RegisterController::class, 'success'])->name('register.success');

    Route::get('/forgot-password', [ForgotPasswordController::class, 'show'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp'])->name('password.email');

    Route::get('/verify-otp', [ForgotPasswordController::class, 'showVerify'])->name('verify-otp');
    Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp'])->name('verify-otp.store');

    Route::get('/reset-password', [ForgotPasswordController::class, 'showReset'])->name('password.reset');
    Route::post('/reset-password', [ForgotPasswordController::class, 'reset'])->name('password.update');

    Route::get('/admin/login', [AdminLoginController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AdminLoginController::class, 'store'])->name('admin.login.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/verify-email', [VerifyEmailController::class, 'create'])->name('verify-email');
    Route::post('/verify-email', [VerifyEmailController::class, 'store'])->name('verify-email.store');
    Route::post('/verify-email/resend', [VerifyEmailController::class, 'resend'])->name('verify-email.resend');

    Route::post('/logout', [LogoutController::class, 'destroy'])->name('logout');

    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('/', [AdminController::class, 'home'])->name('home');
        Route::get('/pendaftaran', [AdminController::class, 'pendaftaran'])->name('pendaftaran');
        Route::post('/pendaftaran/{user}/approve', [AdminController::class, 'approveRegistration'])->name('pendaftaran.approve');
        Route::post('/pendaftaran/{user}/reject', [AdminController::class, 'rejectRegistration'])->name('pendaftaran.reject');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::post('/users', [AdminController::class, 'storeUser'])->name('users.store');
        Route::post('/users/{user}/status', [AdminController::class, 'toggleStatus'])->name('users.status');
        Route::patch('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::get('/programs', [AdminController::class, 'programs'])->name('programs');
        Route::post('/programs', [AdminController::class, 'storeProgram'])->name('programs.store');
        Route::patch('/programs/{program}', [AdminController::class, 'updateProgram'])->name('programs.update');
        Route::delete('/programs/{program}', [AdminController::class, 'destroyProgram'])->name('programs.destroy');
        Route::get('/announcements', [AdminController::class, 'announcements'])->name('announcements');
        Route::post('/announcements', [AdminController::class, 'storeAnnouncement'])->name('announcements.store');
        Route::delete('/announcements/{pengumuman}', [AdminController::class, 'destroyAnnouncement'])->name('announcements.destroy');

        Route::get('/pembayaran', [AdminPembayaranController::class, 'index'])->name('pembayaran');
        Route::post('/pembayaran/{transaksi}/approve', [AdminPembayaranController::class, 'approve'])->name('pembayaran.approve');
        Route::post('/pembayaran/{transaksi}/reject', [AdminPembayaranController::class, 'reject'])->name('pembayaran.reject');

        Route::get('/asrama', [AdminAsramaController::class, 'index'])->name('asrama');
        Route::get('/asrama/riwayat', [AdminAsramaController::class, 'riwayat'])->name('asrama.riwayat');
        Route::get('/asrama/search-students', [AdminAsramaController::class, 'searchStudents'])->name('asrama.search-students');
        Route::post('/asrama/kamar', [AdminAsramaController::class, 'storeKamar'])->name('asrama.kamar.store');
        Route::patch('/asrama/kamar/{kamar}', [AdminAsramaController::class, 'updateKamar'])->name('asrama.kamar.update');
        Route::delete('/asrama/kamar/{kamar}', [AdminAsramaController::class, 'destroyKamar'])->name('asrama.kamar.destroy');
        Route::post('/asrama/assign', [AdminAsramaController::class, 'assign'])->name('asrama.assign');
        Route::post('/asrama/vacate/{ranjangId}', [AdminAsramaController::class, 'vacate'])->name('asrama.vacate');
    });

    Route::middleware('role:siswa')->group(function () {
        Route::get('/siswa', [SiswaDashboardController::class, 'index'])->name('siswa.dashboard');
        Route::get('/home', [SiswaDashboardController::class, 'index'])->name('portal.home');

        Route::get('/siswa/program', [SiswaProgramController::class, 'index'])->name('siswa.program');
        Route::get('/siswa/program/cari', [SiswaProgramController::class, 'cari'])->name('siswa.program.cari');

        Route::get('/siswa/pembayaran', [SiswaPembayaranController::class, 'index'])->name('siswa.pembayaran');
        Route::get('/siswa/checkout/{slug}', [SiswaPembayaranController::class, 'checkout'])->name('siswa.checkout');
        Route::post('/siswa/checkout', [SiswaPembayaranController::class, 'storeCheckout'])->name('siswa.checkout.store');
        Route::post('/siswa/pembayaran/{kode}/bukti', [SiswaPembayaranController::class, 'storeBukti'])->name('siswa.pembayaran.bukti');
        Route::get('/siswa/pembayaran/{transaksi}/kwitansi', [SiswaPembayaranController::class, 'unduhKwitansi'])->name('siswa.pembayaran.kwitansi');
        Route::get('/siswa/asrama', [SiswaAsramaController::class, 'index'])->name('siswa.asrama');

        Route::get('/siswa/profil', [SiswaProfilController::class, 'index'])->name('siswa.profil');
        Route::post('/siswa/profil', [SiswaProfilController::class, 'update'])->name('siswa.profil.update');
        Route::post('/siswa/profil/password', [SiswaProfilController::class, 'updatePassword'])->name('siswa.profil.password');

        Route::get('/program', [PortalController::class, 'programs'])->name('portal.programs');
        Route::get('/program/{slug}', [PortalController::class, 'programDetail'])->name('portal.program');
        Route::get('/program/{programSlug}/materi/{materiSlug}', [PortalController::class, 'materi'])->name('portal.materi');
        Route::get('/sertifikat', [PortalController::class, 'sertifikat'])->name('portal.sertifikat');
        Route::get('/profil', [SiswaProfilController::class, 'index'])->name('portal.profil');

        // Heartbeat endpoint for online/offline status
        Route::post('/siswa/heartbeat', [HeartbeatController::class, 'ping'])
            ->name('siswa.heartbeat');
    });

    Route::redirect('/dashboard', '/admin');
});

// Public webhook endpoint (no auth required, signature-protected)
Route::post('/webhook/payment', [WebhookController::class, 'handlePayment'])
    ->name('webhook.payment');
