<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kamar', function (Blueprint $table): void {
            $table->id();
            $table->string('nomor_kamar', 32)->unique()->index();
            $table->unsignedInteger('kapasitas')->default(6);
            $table->string('status', 32)->default('tersedia')->index(); // tersedia, terisi, maintenance, nonaktif
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('ranjang', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('kamar_id')->constrained('kamar')->cascadeOnDelete();
            $table->unsignedInteger('nomor_ranjang')->index(); // 1..6
            $table->string('status', 32)->default('tersedia')->index(); // tersedia, terisi, maintenance, nonaktif
            $table->timestamps();

            $table->unique(['kamar_id', 'nomor_ranjang']);
        });

        Schema::create('penempatan_asrama', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('kamar_id')->constrained('kamar')->cascadeOnDelete();
            $table->foreignId('ranjang_id')->constrained('ranjang')->cascadeOnDelete();
            $table->date('tanggal_masuk')->index();
            $table->date('tanggal_keluar')->nullable();
            $table->string('status', 32)->default('aktif')->index(); // aktif, selesai, dibatalkan
            $table->text('catatan')->nullable();
            $table->timestamps();
        });

        Schema::create('riwayat_penempatan', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('ranjang_lama_id')->nullable()->constrained('ranjang')->nullOnDelete();
            $table->foreignId('ranjang_baru_id')->nullable()->constrained('ranjang')->nullOnDelete();
            $table->foreignId('dipindahkan_oleh_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('alasan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_penempatan');
        Schema::dropIfExists('penempatan_asrama');
        Schema::dropIfExists('ranjang');
        Schema::dropIfExists('kamar');
    }
};
