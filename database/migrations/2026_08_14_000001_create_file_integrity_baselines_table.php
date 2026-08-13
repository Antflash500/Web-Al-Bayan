<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('file_integrity_baselines', function (Blueprint $table): void {
            $table->id();
            $table->string('path', 500)->unique();
            $table->string('checksum', 64);
            $table->unsignedBigInteger('size')->nullable();
            $table->timestamp('baseline_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_integrity_baselines');
    }
};
