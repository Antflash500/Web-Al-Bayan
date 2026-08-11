<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa_program', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->foreignId('program_id')->index()->constrained('program')->cascadeOnDelete();
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->string('status', 16)->default('aktif')->index();
            $table->timestamps();
        });

        Schema::create('progress_belajar', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->foreignId('program_id')->index()->constrained('program')->cascadeOnDelete();
            $table->foreignId('materi_id')->index()->constrained('materi')->cascadeOnDelete();
            $table->foreignId('video_id')->nullable()->constrained('video')->nullOnDelete();
            $table->unsignedInteger('persentase')->default(0);
            $table->unsignedInteger('durasi_tonton')->default(0);
            $table->string('status', 16)->default('belum_dimulai')->index();
            $table->timestamp('terakhir_diakses')->nullable()->index();
            $table->timestamps();

            $table->unique(['pengguna_id', 'materi_id']);
        });

        Schema::create('riwayat_belajar', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->foreignId('materi_id')->index()->constrained('materi')->cascadeOnDelete();
            $table->unsignedInteger('durasi')->default(0);
            $table->unsignedInteger('persentase')->default(0);
            $table->date('tanggal')->nullable();
            $table->timestamps();
        });

        Schema::create('sertifikat', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->foreignId('program_id')->index()->constrained('program')->cascadeOnDelete();
            $table->string('nomor_sertifikat')->unique()->index();
            $table->date('tanggal_terbit')->nullable();
            $table->string('lokasi_file')->nullable();
            $table->string('status', 16)->default('aktif')->index();
            $table->timestamps();
        });

        Schema::create('bookmark', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->foreignId('materi_id')->index()->constrained('materi')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['pengguna_id', 'materi_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookmark');
        Schema::dropIfExists('sertifikat');
        Schema::dropIfExists('riwayat_belajar');
        Schema::dropIfExists('progress_belajar');
        Schema::dropIfExists('siswa_program');
    }
};
