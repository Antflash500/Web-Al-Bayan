<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materi_konten', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('materi_id')->constrained('materi')->cascadeOnDelete();
            $table->string('tipe', 16)->index(); // teks, pdf, video, gambar, video_link
            $table->string('judul')->nullable();
            $table->text('konten')->nullable(); // isi untuk tipe teks
            $table->string('url')->nullable(); // link video / embed (youtube)
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->unsignedInteger('file_size')->nullable();
            $table->unsignedInteger('urutan')->default(0)->index();
            $table->string('status', 16)->default('aktif')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materi_konten');
    }
};
