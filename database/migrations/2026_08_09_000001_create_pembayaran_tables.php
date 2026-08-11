<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table): void {
            $table->id();
            $table->string('kode_transaksi', 64)->unique()->index();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('program_id')->nullable()->constrained('program')->nullOnDelete();
            $table->decimal('jumlah', 12, 2)->default(0);
            $table->string('status', 32)->default('pending')->index(); // pending, paid, failed, expired, cancelled, refunded
            $table->string('metode_pembayaran', 64)->nullable();
            $table->string('snap_token')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
