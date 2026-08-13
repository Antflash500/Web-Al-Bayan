<?php

namespace App\Console\Commands;

use App\Services\VulnerabilityScanner;
use Illuminate\Console\Command;

class SecurityCveScan extends Command
{
    protected $signature = 'security:cve-scan';

    protected $description = 'Scan dependensi Composer untuk advisori CVE (via composer audit)';

    public function handle(VulnerabilityScanner $scanner): int
    {
        if (! \Illuminate\Support\Facades\Schema::hasTable('vulnerability_scans')) {
            $this->error('Tabel vulnerability_scans belum ada. Jalankan php artisan migrate dahulu.');

            return self::FAILURE;
        }

        $scan = $scanner->scanCve();

        match ($scan->status) {
            'clean' => $this->info($scan->summary),
            'error' => $this->error($scan->summary),
            default => $this->warn($scan->summary),
        };

        return $scan->status === 'error' ? self::FAILURE : self::SUCCESS;
    }
}
