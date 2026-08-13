<?php

namespace App\Console\Commands;

use App\Services\SecurityService;
use Illuminate\Console\Command;

class SecurityServerMetrics extends Command
{
    protected $signature = 'security:metrics';

    protected $description = 'Catat snapshot metrik server (CPU, memori, disk) ke tabel server_metrics';

    public function handle(SecurityService $security): int
    {
        $record = $security->recordServerMetrics();

        if ($record === null) {
            $this->error('Gagal merekam metrik server.');

            return self::FAILURE;
        }

        $this->info("Metrik server tercatat (disk {$record['disk_percent']}% / memori ".($record['memory_percent'] ?? 'N/A').'%).');

        return self::SUCCESS;
    }
}
