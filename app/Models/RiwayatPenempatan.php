<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatPenempatan extends Model
{
    use HasFactory;

    protected $table = 'riwayat_penempatan';

    protected $fillable = [
        'user_id',
        'ranjang_lama_id',
        'ranjang_baru_id',
        'dipindahkan_oleh_user_id',
        'alasan',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ranjangLama(): BelongsTo
    {
        return $this->belongsTo(Ranjang::class, 'ranjang_lama_id');
    }

    public function ranjangBaru(): BelongsTo
    {
        return $this->belongsTo(Ranjang::class, 'ranjang_baru_id');
    }

    public function dipindahkanOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dipindahkan_oleh_user_id');
    }
}
