<?php

use App\Http\Controllers\Admin\AdminAsramaController;
use App\Http\Controllers\Admin\AdminMateriController;
use App\Http\Controllers\Admin\AdminPembayaranController;
use App\Http\Controllers\Admin\SecurityController;
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

Route::get('/media/materi/{path}', [MediaController::class, 'materiFile'])
    ->where('path', '.*')
    ->name('media.materi-file');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:auth-login')->name('login.store');

    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:auth-register')->name('register.store');
    Route::get('/register/success', [RegisterController::class, 'success'])->name('register.success');

    Route::get('/forgot-password', [ForgotPasswordController::class, 'show'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp'])->middleware('throttle:auth-otp')->name('password.email');

    Route::get('/verify-otp', [ForgotPasswordController::class, 'showVerify'])->name('verify-otp');
    Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp'])->middleware('throttle:auth-otp')->name('verify-otp.store');

    Route::get('/reset-password', [ForgotPasswordController::class, 'showReset'])->name('password.reset');
    Route::post('/reset-password', [ForgotPasswordController::class, 'reset'])->middleware('throttle:auth-otp')->name('password.update');

    Route::get('/admin/login', [AdminLoginController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AdminLoginController::class, 'store'])->middleware('throttle:auth-login')->name('admin.login.store');
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
        Route::get('/programs/{program}/materi', [AdminMateriController::class, 'index'])->name('programs.materi');
        Route::post('/programs/{program}/materi', [AdminMateriController::class, 'storeMateri'])->name('programs.materi.store');
        Route::post('/programs/{program}/materi/{materi}/move/{direction}', [AdminMateriController::class, 'moveMateri'])->name('programs.materi.move');
        Route::patch('/programs/{program}/materi/{materi}', [AdminMateriController::class, 'updateMateri'])->name('programs.materi.update');
        Route::delete('/programs/{program}/materi/{materi}', [AdminMateriController::class, 'destroyMateri'])->name('programs.materi.destroy');
        Route::post('/programs/{program}/materi/{materi}/konten', [AdminMateriController::class, 'storeKonten'])->name('programs.materi.konten.store');
        Route::patch('/programs/{program}/materi/{materi}/konten/{konten}', [AdminMateriController::class, 'updateKonten'])->name('programs.materi.konten.update');
        Route::delete('/programs/{program}/materi/{materi}/konten/{konten}', [AdminMateriController::class, 'destroyKonten'])->name('programs.materi.konten.destroy');
        Route::post('/programs/{program}/materi/{materi}/konten/{konten}/move/{direction}', [AdminMateriController::class, 'moveKonten'])->name('programs.materi.konten.move');
        Route::get('/announcements', [AdminController::class, 'announcements'])->name('announcements');
        Route::post('/announcements', [AdminController::class, 'storeAnnouncement'])->name('announcements.store');
        Route::delete('/announcements/{pengumuman}', [AdminController::class, 'destroyAnnouncement'])->name('announcements.destroy');

        Route::get('/pembayaran', [AdminPembayaranController::class, 'index'])->name('pembayaran');
        Route::post('/pembayaran/{transaksi}/approve', [AdminPembayaranController::class, 'approve'])->name('pembayaran.approve');
        Route::post('/pembayaran/{transaksi}/reject', [AdminPembayaranController::class, 'reject'])->name('pembayaran.reject');

        Route::get('/asrama', [AdminAsramaController::class, 'index'])->name('asrama');
        Route::get('/asrama/riwayat', [AdminAsramaController::class, 'riwayat'])->name('asrama.riwayat');
        Route::get('/asrama/search-students', [AdminAsramaController::class, 'searchStudents'])->name('asrama.search-students');
        Route::post('/asrama/rumah', [AdminAsramaController::class, 'storeRumah'])->name('asrama.rumah.store');
        Route::patch('/asrama/rumah/{rumah}', [AdminAsramaController::class, 'updateRumah'])->name('asrama.rumah.update');
        Route::delete('/asrama/rumah/{rumah}', [AdminAsramaController::class, 'destroyRumah'])->name('asrama.rumah.destroy');
        Route::post('/asrama/kamar', [AdminAsramaController::class, 'storeKamar'])->name('asrama.kamar.store');
        Route::patch('/asrama/kamar/{kamar}', [AdminAsramaController::class, 'updateKamar'])->name('asrama.kamar.update');
        Route::delete('/asrama/kamar/{kamar}', [AdminAsramaController::class, 'destroyKamar'])->name('asrama.kamar.destroy');
        Route::post('/asrama/assign', [AdminAsramaController::class, 'assign'])->name('asrama.assign');
        Route::post('/asrama/vacate/{kasur}', [AdminAsramaController::class, 'vacate'])->name('asrama.vacate');

        Route::get('/security', [SecurityController::class, 'index'])->name('security');
        Route::get('/security/export', [SecurityController::class, 'exportCsv'])->name('security.export');
        Route::post('/security/monitor', [SecurityController::class, 'recordMonitoring'])
            ->middleware('throttle:admin-security-check')
            ->name('security.monitor');
        Route::post('/security/scan-ports', [SecurityController::class, 'scanPorts'])
            ->middleware('throttle:admin-port-scan')
            ->name('security.scan-ports');
        Route::post('/security/self-test', [SecurityController::class, 'selfTest'])
            ->middleware('throttle:admin-security-check')
            ->name('security.self-test');
        Route::post('/security/session/terminate', [SecurityController::class, 'terminateSession'])
            ->name('security.session.terminate');
        Route::post('/security/sessions/terminate-others', [SecurityController::class, 'terminateOtherSessions'])
            ->name('security.sessions.terminate-others');
        Route::post('/security/ban', [SecurityController::class, 'banIp'])->name('security.ban');
        Route::post('/security/unban', [SecurityController::class, 'unbanIp'])->name('security.unban');
    });

    Route::middleware('role:siswa')->group(function () {
        Route::get('/siswa', [SiswaDashboardController::class, 'index'])->name('siswa.dashboard');
        Route::get('/home', [SiswaDashboardController::class, 'index'])->name('portal.home');

        Route::get('/siswa/biodata/unduh', [SiswaDashboardController::class, 'unduhBiodata'])->name('siswa.biodata.unduh');

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
            ->middleware('throttle:heartbeat')
            ->name('siswa.heartbeat');
    });

    Route::redirect('/dashboard', '/admin');
});

// Public webhook endpoint (no auth required, signature-protected)
Route::post('/webhook/payment', [WebhookController::class, 'handlePayment'])
    ->middleware('throttle:webhook')
    ->name('webhook.payment');
