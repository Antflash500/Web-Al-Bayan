<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengguna', function (Blueprint $table): void {
            $table->id();
            $table->string('email')->unique()->index();
            $table->string('password');
            $table->string('role', 16)->default('siswa')->index();
            $table->string('status', 16)->default('aktif')->index();
            $table->boolean('email_terverifikasi')->default(false)->index();
            $table->timestamp('terakhir_login')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('biodata_siswa', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->unique()->constrained('pengguna')->cascadeOnDelete();
            $table->string('nama_lengkap')->index();
            $table->string('nama_panggilan')->nullable();
            $table->string('jenis_kelamin', 16)->default('laki_laki')->index();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable()->index();
            $table->string('nomor_hp')->nullable()->index();
            $table->text('alamat')->nullable();
            $table->string('kota')->nullable()->index();
            $table->string('provinsi')->nullable();
            $table->string('foto')->nullable();
            $table->boolean('agreed_terms')->default(false);
            $table->timestamps();
        });

        Schema::create('admin', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('pengguna_id')->unique()->constrained('pengguna')->cascadeOnDelete();
            $table->string('nama_admin')->index();
            $table->string('jabatan', 32)->default('administrator');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin');
        Schema::dropIfExists('biodata_siswa');
        Schema::dropIfExists('pengguna');
    }
};
