<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('server_metrics', function (Blueprint $table): void {
            $table->id();
            $table->float('cpu_load')->nullable();
            $table->unsignedBigInteger('memory_total')->nullable();
            $table->unsignedBigInteger('memory_used')->nullable();
            $table->unsignedBigInteger('disk_total')->nullable();
            $table->unsignedBigInteger('disk_free')->nullable();
            $table->unsignedBigInteger('uptime')->nullable();
            $table->timestamp('recorded_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('server_metrics');
    }
};
