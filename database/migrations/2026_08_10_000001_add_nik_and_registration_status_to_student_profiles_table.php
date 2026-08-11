<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Adds identity data required by the new registration flow:
 *
 *  - `nik`: Indonesian citizen identity number. Business rule is exactly 16
 *    digits, unique per student. Kept nullable so legacy rows without a NIK
 *    remain valid; new registrations are enforced by backend validation and a
 *    database check constraint.
 *  - `registration_status`: pending / approved / rejected. Pending students
 *    have no login credentials until an admin reviews and activates the account.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table): void {
            if (! Schema::hasColumn('student_profiles', 'nik')) {
                $table->string('nik', 16)->nullable()->unique()->after('nim');
            }

            if (! Schema::hasColumn('student_profiles', 'registration_status')) {
                $table->string('registration_status', 20)->default('pending')->index()->after('agreed_terms');
            }
        });

        try {
            DB::statement(
                'ALTER TABLE student_profiles
                 ADD CONSTRAINT student_profiles_nik_digits_check
                 CHECK (nik IS NULL OR nik ~ \'^[0-9]{16}$\')'
            );
        } catch (Throwable $e) {
            // Constraint already exists or not supported on this driver.
        }
    }

    public function down(): void
    {
        try {
            Schema::table('student_profiles', function (Blueprint $table): void {
                $table->dropUnique(['nik']);
            });
        } catch (Throwable $e) {
            // Index name may differ on this driver.
        }

        try {
            DB::statement('ALTER TABLE student_profiles DROP CONSTRAINT student_profiles_nik_digits_check');
        } catch (Throwable $e) {
            // Constraint already removed or not supported.
        }

        Schema::table('student_profiles', function (Blueprint $table): void {
            if (Schema::hasColumn('student_profiles', 'registration_status')) {
                $table->dropColumn('registration_status');
            }

            if (Schema::hasColumn('student_profiles', 'nik')) {
                $table->dropColumn('nik');
            }
        });
    }
};
