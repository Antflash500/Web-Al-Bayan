<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksi';

    protected $fillable = [
        'kode_transaksi',
        'nomor_kwitansi',
        'user_id',
        'program_id',
        'jumlah',
        'status',
        'metode_pembayaran',
        'snap_token',
        'bukti_pembayaran',
        'verified_by',
        'paid_at',
        'expired_at',
        'verified_at',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramKursus::class, 'program_id');
    }
}
