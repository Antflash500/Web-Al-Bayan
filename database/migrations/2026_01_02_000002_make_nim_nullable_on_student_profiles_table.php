<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE student_profiles ALTER COLUMN nim DROP NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE student_profiles ALTER COLUMN nim SET NOT NULL');
    }
};
