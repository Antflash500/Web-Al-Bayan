<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rumah', function (Blueprint $table): void {
            $table->id();
            $table->string('nama', 64)->unique()->index();
            $table->text('keterangan')->nullable();
            $table->string('status', 32)->default('aktif')->index(); // aktif, nonaktif
            $table->timestamps();
        });

        Schema::table('kamar', function (Blueprint $table): void {
            $table->foreignId('rumah_id')->nullable()->constrained('rumah')->nullOnDelete();
        });

        Schema::create('kasur', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('ranjang_id')->constrained('ranjang')->cascadeOnDelete();
            $table->string('posisi', 16); // atas, bawah
            $table->string('status', 32)->default('tersedia')->index(); // tersedia, terisi, maintenance, nonaktif
            $table->timestamps();

            $table->unique(['ranjang_id', 'posisi']);
        });

        // Backfill: buat satu rumah default dan pindahkan semua kamar ke dalamnya.
        $defaultRumahId = DB::table('rumah')->insertGetId([
            'nama' => 'Rumah 01',
            'keterangan' => 'Asrama utama',
            'status' => 'aktif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('kamar')->whereNull('rumah_id')->update(['rumah_id' => $defaultRumahId]);

        // Backfill: setiap ranjang lama otomatis mendapat 2 kasur (atas & bawah).
        $ranjangIds = DB::table('ranjang')->pluck('id');
        foreach ($ranjangIds as $ranjangId) {
            $exists = DB::table('kasur')->where('ranjang_id', $ranjangId)->exists();
            if (! $exists) {
                $now = now();
                DB::table('kasur')->insert([
                    ['ranjang_id' => $ranjangId, 'posisi' => 'atas', 'status' => 'tersedia', 'created_at' => $now, 'updated_at' => $now],
                    ['ranjang_id' => $ranjangId, 'posisi' => 'bawah', 'status' => 'tersedia', 'created_at' => $now, 'updated_at' => $now],
                ]);
            }
        }

        Schema::table('penempatan_asrama', function (Blueprint $table): void {
            $table->foreignId('kasur_id')->nullable()->after('ranjang_id')->constrained('kasur')->cascadeOnDelete();
        });

        // Backfill: penempatan aktif lama dipindahkan ke kasur bawah, kasur ditandai terisi.
        $penempatans = DB::table('penempatan_asrama')->whereNull('kasur_id')->get();
        foreach ($penempatans as $penempatan) {
            $kasur = DB::table('kasur')
                ->where('ranjang_id', $penempatan->ranjang_id)
                ->where('posisi', 'bawah')
                ->first();

            if ($kasur) {
                DB::table('penempatan_asrama')->where('id', $penempatan->id)->update(['kasur_id' => $kasur->id]);

                if ($penempatan->status === 'aktif') {
                    DB::table('kasur')->where('id', $kasur->id)->update(['status' => 'terisi']);
                }
            }
        }

        Schema::table('penempatan_asrama', function (Blueprint $table): void {
            $table->dropForeign(['ranjang_id']);
            $table->dropColumn('ranjang_id');
            $table->foreignId('kasur_id')->nullable(false)->change();
        });

        Schema::table('riwayat_penempatan', function (Blueprint $table): void {
            $table->string('posisi_lama', 16)->nullable()->after('ranjang_lama_id');
            $table->string('posisi_baru', 16)->nullable()->after('ranjang_baru_id');
        });
    }

    public function down(): void
    {
        Schema::table('riwayat_penempatan', function (Blueprint $table): void {
            $table->dropColumn(['posisi_lama', 'posisi_baru']);
        });

        Schema::table('penempatan_asrama', function (Blueprint $table): void {
            $table->foreignId('ranjang_id')->nullable()->after('kamar_id')->constrained('ranjang')->cascadeOnDelete();
        });

        // Kembalikan ranjang_id berdasarkan kasur penempatan.
        $penempatans = DB::table('penempatan_asrama')->whereNull('ranjang_id')->get();
        foreach ($penempatans as $penempatan) {
            $kasur = DB::table('kasur')->where('id', $penempatan->kasur_id)->first();
            if ($kasur) {
                DB::table('penempatan_asrama')->where('id', $penempatan->id)->update(['ranjang_id' => $kasur->ranjang_id]);
            }
        }

        Schema::table('penempatan_asrama', function (Blueprint $table): void {
            $table->dropForeign(['kasur_id']);
            $table->dropColumn('kasur_id');
        });

        Schema::dropIfExists('kasur');

        Schema::table('kamar', function (Blueprint $table): void {
            $table->dropForeign(['rumah_id']);
            $table->dropColumn('rumah_id');
        });

        Schema::dropIfExists('rumah');
    }
};
