<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('program') && ! Schema::hasColumn('program', 'harga')) {
            Schema::table('program', function (Blueprint $table): void {
                $table->decimal('harga', 12, 2)->default(0)->after('jumlah_materi');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('program') && Schema::hasColumn('program', 'harga')) {
            Schema::table('program', function (Blueprint $table): void {
                $table->dropColumn('harga');
            });
        }
    }
};
