<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ranjang extends Model
{
    use HasFactory;

    protected $table = 'ranjang';

    protected $fillable = [
        'kamar_id',
        'nomor_ranjang',
        'status',
    ];

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class, 'kamar_id');
    }

    public function penempatanAktif(): HasOne
    {
        return $this->hasOne(PenempatanAsrama::class, 'ranjang_id')->where('status', 'aktif');
    }
}
