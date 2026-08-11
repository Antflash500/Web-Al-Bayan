<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenempatanAsrama extends Model
{
    use HasFactory;

    protected $table = 'penempatan_asrama';

    protected $fillable = [
        'user_id',
        'kamar_id',
        'ranjang_id',
        'tanggal_masuk',
        'tanggal_keluar',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class, 'kamar_id');
    }

    public function ranjang(): BelongsTo
    {
        return $this->belongsTo(Ranjang::class, 'ranjang_id');
    }
}
