<?php

namespace App\Console\Commands;

use App\Services\SecurityService;
use Illuminate\Console\Command;

class SecurityIntegrity extends Command
{
    protected $signature = 'security:integrity';

    protected $description = 'Buat baseline SHA-256 berkas penting aplikasi (Integrity monitoring)';

    public function handle(SecurityService $security): int
    {
        if (! \Illuminate\Support\Facades\Schema::hasTable('file_integrity_baselines')) {
            $this->error('Tabel file_integrity_baselines belum ada. Jalankan php artisan migrate dahulu.');

            return self::FAILURE;
        }

        $count = $security->rebuildFileIntegrityBaseline();

        $this->info("Baseline integritas dibangun untuk {$count} berkas.");

        return self::SUCCESS;
    }
}