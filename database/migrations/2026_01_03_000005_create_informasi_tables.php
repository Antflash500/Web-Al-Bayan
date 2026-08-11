<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table): void {
            $table->id();
            $table->string('judul')->index();
            $table->text('isi');
            $table->string('gambar')->nullable();
            $table->timestamp('tanggal_publish')->nullable()->index();
            $table->string('status', 16)->default('aktif')->index();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('notifikasi', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->string('judul');
            $table->text('pesan')->nullable();
            $table->boolean('dibaca')->default(false)->index();
            $table->string('jenis', 24)->default('pengumuman')->index();
            $table->timestamps();
        });

        Schema::create('riwayat_login', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('browser')->nullable();
            $table->string('sistem_operasi')->nullable();
            $table->timestamp('login_pada')->nullable();
            $table->timestamp('logout_pada')->nullable();
            $table->string('status', 16)->default('berhasil')->index();
            $table->timestamps();
        });

        Schema::create('log_aktivitas', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->nullable()->constrained('pengguna')->nullOnDelete();
            $table->string('aktivitas');
            $table->string('ip_address', 45)->nullable();
            $table->string('browser')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
        Schema::dropIfExists('riwayat_login');
        Schema::dropIfExists('notifikasi');
        Schema::dropIfExists('pengumuman');
    }
};
