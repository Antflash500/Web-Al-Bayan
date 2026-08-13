<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kamar extends Model
{
    use HasFactory;

    protected $table = 'kamar';

    protected $fillable = [
        'rumah_id',
        'nomor_kamar',
        'kapasitas',
        'status',
        'keterangan',
    ];

    public function rumah(): BelongsTo
    {
        return $this->belongsTo(Rumah::class, 'rumah_id');
    }

    public function ranjang(): HasMany
    {
        return $this->hasMany(Ranjang::class, 'kamar_id');
    }

    public function penempatan(): HasMany
    {
        return $this->hasMany(PenempatanAsrama::class, 'kamar_id');
    }
}
