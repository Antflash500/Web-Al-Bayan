<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Pemantauan metrik server otomatis setiap 5 menit (jalankan scheduler saat production).
Schedule::command('security:metrics')->everyFiveMinutes();
