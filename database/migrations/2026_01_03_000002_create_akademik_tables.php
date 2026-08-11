<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kategori_program', function (Blueprint $table): void {
            $table->id();
            $table->string('nama_kategori')->unique()->index();
            $table->string('slug')->unique()->index();
            $table->text('deskripsi')->nullable();
            $table->string('status', 16)->default('aktif')->index();
            $table->timestamps();
        });

        Schema::create('program', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('kategori_program_id')->nullable()->constrained('kategori_program')->nullOnDelete();
            $table->string('nama_program')->index();
            $table->string('slug')->unique()->index();
            $table->text('deskripsi')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('cover')->nullable();
            $table->string('instruktur')->nullable();
            $table->string('tingkat', 16)->default('pemula')->index();
            $table->unsignedInteger('durasi_jam')->default(0);
            $table->unsignedInteger('jumlah_materi')->default(0);
            $table->string('status', 16)->default('aktif')->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('materi', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('program_id')->constrained('program')->cascadeOnDelete();
            $table->string('judul')->index();
            $table->string('slug')->unique()->index();
            $table->text('deskripsi')->nullable();
            $table->unsignedInteger('urutan')->default(0)->index();
            $table->unsignedInteger('estimasi_menit')->default(0);
            $table->string('status', 16)->default('aktif')->index();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('video', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->cascadeOnDelete();
            $table->string('judul_video')->index();
            $table->text('deskripsi')->nullable();
            $table->string('url_video');
            $table->string('durasi', 12)->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('status', 16)->default('aktif')->index();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('pdf', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->cascadeOnDelete();
            $table->string('judul_file')->index();
            $table->string('nama_file');
            $table->string('ukuran_file', 32)->nullable();
            $table->unsignedInteger('jumlah_halaman')->default(0);
            $table->string('status', 16)->default('aktif')->index();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('audio', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->cascadeOnDelete();
            $table->string('judul_audio')->index();
            $table->string('nama_file');
            $table->string('durasi', 12)->nullable();
            $table->string('status', 16)->default('aktif')->index();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio');
        Schema::dropIfExists('pdf');
        Schema::dropIfExists('video');
        Schema::dropIfExists('materi');
        Schema::dropIfExists('program');
        Schema::dropIfExists('kategori_program');
    }
};
