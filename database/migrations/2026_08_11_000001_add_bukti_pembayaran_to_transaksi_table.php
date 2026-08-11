<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi', function (Blueprint $table): void {
            $table->string('bukti_pembayaran')->nullable()->after('snap_token');
            $table->foreignId('verified_by')->nullable()->after('bukti_pembayaran')->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable()->after('verified_by');
        });
    }

    public function down(): void
    {
        Schema::table('transaksi', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('verified_by');
            $table->dropColumn(['bukti_pembayaran', 'verified_at']);
        });
    }
};