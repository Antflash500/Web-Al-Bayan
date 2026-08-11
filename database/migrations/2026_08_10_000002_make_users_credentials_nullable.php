<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Students no longer create login credentials during registration. A freshly
 * registered student is stored as a `users` row without an email or password
 * (status = pending). The admin later assigns the username + password and
 * activates the account, so those columns must accept NULL.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE users ALTER COLUMN email DROP NOT NULL');
        DB::statement('ALTER TABLE users ALTER COLUMN password DROP NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE users ALTER COLUMN email SET NOT NULL');
        DB::statement('ALTER TABLE users ALTER COLUMN password SET NOT NULL');
    }
};
