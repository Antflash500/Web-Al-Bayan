<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Pemantauan metrik server otomatis setiap 5 menit (jalankan scheduler saat production).
Schedule::command('security:metrics')->everyFiveMinutes();

// Bangun ulang baseline integritas berkas setiap hari (jalankan scheduler saat production).
Schedule::command('security:integrity')->daily();

// Scan CVE dependensi Composer + scan malware/webshell setiap hari.
Schedule::command('security:cve-scan')->dailyAt('02:15');
Schedule::command('security:malware-scan')->dailyAt('02:30');
