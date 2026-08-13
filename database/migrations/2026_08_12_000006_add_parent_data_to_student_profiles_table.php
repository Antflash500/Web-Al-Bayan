<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->string('father_name', 100)->nullable()->after('address');
            $table->string('father_address', 255)->nullable()->after('father_name');
            $table->string('father_occupation', 100)->nullable()->after('father_address');
            $table->string('father_phone', 20)->nullable()->after('father_occupation');
            $table->string('mother_name', 100)->nullable()->after('father_phone');
            $table->string('mother_address', 255)->nullable()->after('mother_name');
            $table->string('mother_occupation', 100)->nullable()->after('mother_address');
            $table->string('mother_phone', 20)->nullable()->after('mother_occupation');
        });
    }

    public function down(): void
    {
        Schema::table('student_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'father_name',
                'father_address',
                'father_occupation',
                'father_phone',
                'mother_name',
                'mother_address',
                'mother_occupation',
                'mother_phone',
            ]);
        });
    }
};
