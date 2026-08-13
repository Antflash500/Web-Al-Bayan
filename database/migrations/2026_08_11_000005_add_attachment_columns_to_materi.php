<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('materi', function (Blueprint $table): void {
            $table->string('gambar_path')->nullable();
            $table->string('gambar_name')->nullable();
            $table->unsignedInteger('gambar_size')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('pdf_name')->nullable();
            $table->unsignedInteger('pdf_size')->nullable();
            $table->string('video_path')->nullable();
            $table->string('video_name')->nullable();
            $table->unsignedInteger('video_size')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('materi', function (Blueprint $table): void {
            $table->dropColumn([
                'gambar_path',
                'gambar_name',
                'gambar_size',
                'pdf_path',
                'pdf_name',
                'pdf_size',
                'video_path',
                'video_name',
                'video_size',
            ]);
        });
    }
};
