<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Consolidates duplicated user data across the legacy "pengguna"/"biodata_siswa"
 * tables and the real auth "users"/"student_profiles" tables. This migration
 * turns `users` into the single source of truth:
 *
 *  - adds `users.status` (aktif / nonaktif),
 *  - migrates existing `pengguna` accounts into `users` (email matching),
 *  - migrates `biodata_siswa` rows into `student_profiles`,
 *  - rewires every `.pengguna_id` foreign key to point at `users.id`.
 *
 * The legacy tables are intentionally left in place (harmless) so this
 * migration is reversible; application code no longer references them.
 */
return new class extends Migration
{
    public $withinTransaction = false;

    private const CHILD_TABLES = [
        'siswa_program',
        'progress_belajar',
        'riwayat_belajar',
        'sertifikat',
        'bookmark',
        'nilai_quiz',
        'notifikasi',
        'riwayat_login',
        'log_aktivitas',
    ];

    public function up(): void
    {
        try {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('role', 16)->default('student')->index()->after('email');
            });
        } catch (Throwable $e) {
            // Already exists or not supported
        }

        try {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('status', 16)->default('aktif')->index()->after('role');
            });
        } catch (Throwable $e) {
            // Already exists or not supported
        }

        // Clear connection cache for Postgres compatibility
        DB::purge();

        // Existing rows may still hold the legacy "siswa" role value.
        try {
            if (DB::table('users')->count() > 0) {
                DB::table('users')->where('role', 'siswa')->update(['role' => 'student']);
            }
        } catch (Throwable $e) {
            // Role column might not be resolved yet on the connection
        }

        if (! Schema::hasTable('pengguna')) {
            $this->ensureStatusFilled();
            $this->rewireForeignKeys();

            return;
        }

        $this->migratePenggunaToUsers();
        $this->migrateBiodataToStudentProfiles();
        $this->ensureStatusFilled();
        $this->rewireForeignKeys();
    }

    public function down(): void
    {
        // Copy the canonical users back into the legacy tables (best effort).
        if (Schema::hasTable('pengguna') && Schema::hasTable('users')) {
            foreach (DB::table('users')->get() as $user) {
                $existing = DB::table('pengguna')->where('email', $user->email)->first();
                if ($existing) {
                    DB::table('pengguna')->where('id', $existing->id)->update([
                        'role' => $user->role === 'admin' ? 'admin' : 'siswa',
                        'status' => $user->status ?? 'aktif',
                        'email_terverifikasi' => $existing->email_terverifikasi || ($user->email_verified_at !== null),
                        'password' => $user->password,
                    ]);

                    continue;
                }

                DB::table('pengguna')->insert([
                    'email' => $user->email,
                    'password' => $user->password,
                    'role' => $user->role === 'admin' ? 'admin' : 'siswa',
                    'status' => $user->status ?? 'aktif',
                    'email_terverifikasi' => $user->email_verified_at !== null,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ]);
            }

            foreach (DB::table('users')->get() as $user) {
                if (DB::table('student_profiles')->where('user_id', $user->id)->doesntExist()) {
                    continue;
                }

                $biodataId = DB::table('pengguna')->where('email', $user->email)->value('id');
                if (! $biodataId) {
                    continue;
                }

                DB::table('biodata_siswa')->insert([
                    'pengguna_id' => $biodataId,
                    'nama_lengkap' => DB::table('student_profiles')->where('user_id', $user->id)->value('full_name'),
                    'agreed_terms' => DB::table('student_profiles')->where('user_id', $user->id)->value('agreed_terms') ?? false,
                ]);
            }
        }

        if (Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->dropColumn('status');
            });
        }

        $this->rewireForeignKeys(true);
    }

    private function migratePenggunaToUsers(): void
    {
        $now = now();

        foreach (DB::table('pengguna')->get() as $pengguna) {
            if (DB::table('users')->where('email', $pengguna->email)->exists()) {
                DB::table('users')->where('email', $pengguna->email)->update([
                    'password' => $pengguna->password,
                    'status' => $pengguna->status ?? 'aktif',
                ]);

                continue;
            }

            DB::table('users')->insert([
                'email' => $pengguna->email,
                'password' => $pengguna->password,
                'role' => $pengguna->role === 'admin' ? 'admin' : 'student',
                'status' => $pengguna->status ?? 'aktif',
                'email_verified_at' => $pengguna->email_terverifikasi ? now() : null,
                'created_at' => $pengguna->created_at ?? $now,
                'updated_at' => $now,
            ]);
        }
    }

    private function migrateBiodataToStudentProfiles(): void
    {
        if (! Schema::hasTable('biodata_siswa') || ! Schema::hasTable('student_profiles')) {
            return;
        }

        $genderMap = ['perempuan' => 'female'];

        foreach (DB::table('biodata_siswa')->get() as $biodata) {
            $pengguna = DB::table('pengguna')->where('id', $biodata->pengguna_id)->first();
            $user = $pengguna ? DB::table('users')->where('email', $pengguna->email)->first() : null;

            if (! $user || DB::table('student_profiles')->where('user_id', $user->id)->exists()) {
                continue;
            }

            DB::table('student_profiles')->insert([
                'user_id' => $user->id,
                'full_name' => $biodata->nama_lengkap ?? $user->email,
                'nim' => null,
                'birth_date' => $biodata->tanggal_lahir ?? '2000-01-01',
                'gender' => $genderMap[$biodata->jenis_kelamin] ?? 'male',
                'phone' => $biodata->nomor_hp,
                'address' => $biodata->alamat,
                'avatar' => $biodata->foto,
                'agreed_terms' => (bool) $biodata->agreed_terms,
                'created_at' => $biodata->created_at ?? now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function ensureStatusFilled(): void
    {
        DB::table('users')->whereNull('status')->update(['status' => 'aktif']);
    }

    private function rewireForeignKeys(bool $revert = false): void
    {
        foreach (self::CHILD_TABLES as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            if (! $revert) {
                if (Schema::hasColumn($table, 'user_id')) {
                    continue;
                }

                Schema::table($table, function (Blueprint $table): void {
                    $table->unsignedBigInteger('user_id')->nullable()->after('id');
                });

                if (Schema::hasTable('pengguna')) {
                    DB::statement(
                        "UPDATE {$table} SET user_id = (
                            SELECT u.id FROM users u JOIN pengguna p ON u.email = p.email
                            WHERE p.id = {$table}.pengguna_id
                        )"
                    );
                }

                Schema::table($table, function (Blueprint $table): void {
                    $table->dropConstrainedForeignId('pengguna_id');
                    $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
                    $table->index('user_id');
                });
            } else {
                if (Schema::hasColumn($table, 'pengguna_id')) {
                    continue;
                }

                Schema::table($table, function (Blueprint $table): void {
                    $table->unsignedBigInteger('pengguna_id')->nullable()->after('id');
                });

                DB::statement(
                    "UPDATE {$table} SET pengguna_id = (
                        SELECT p.id FROM users u JOIN pengguna p ON u.email = p.email
                        WHERE u.id = {$table}.user_id
                    )"
                );

                Schema::table($table, function (Blueprint $table): void {
                    $table->dropConstrainedForeignId('user_id');
                    $table->foreign('pengguna_id')->references('id')->on('pengguna')->cascadeOnDelete();
                    $table->index('pengguna_id');
                });
            }
        }
    }
};
