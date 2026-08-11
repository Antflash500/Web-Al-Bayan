<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->cascadeOnDelete();
            $table->string('judul')->index();
            $table->text('deskripsi')->nullable();
            $table->unsignedInteger('nilai_minimum')->default(75);
            $table->unsignedInteger('durasi_menit')->default(0);
            $table->boolean('acak_soal')->default(false);
            $table->string('status', 16)->default('aktif')->index();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('soal_quiz', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
            $table->text('pertanyaan');
            $table->string('jenis', 16)->default('pilihan_ganda')->index();
            $table->unsignedInteger('poin')->default(1);
            $table->unsignedInteger('urutan')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('pilihan_jawaban', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('soal_id')->constrained('soal_quiz')->cascadeOnDelete();
            $table->string('pilihan');
            $table->boolean('benar')->default(false);
            $table->timestamps();
        });

        Schema::create('nilai_quiz', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->index()->constrained('pengguna')->cascadeOnDelete();
            $table->foreignId('quiz_id')->index()->constrained('quiz')->cascadeOnDelete();
            $table->unsignedInteger('jumlah_benar')->default(0);
            $table->unsignedInteger('jumlah_salah')->default(0);
            $table->unsignedInteger('nilai')->default(0);
            $table->string('status', 16)->default('belum_selesai')->index();
            $table->timestamp('tanggal_quiz')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_quiz');
        Schema::dropIfExists('pilihan_jawaban');
        Schema::dropIfExists('soal_quiz');
        Schema::dropIfExists('quiz');
    }
};
