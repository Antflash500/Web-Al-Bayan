<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kamar extends Model
{
    use HasFactory;

    protected $table = 'kamar';

    protected $fillable = [
        'nomor_kamar',
        'kapasitas',
        'status',
        'keterangan',
    ];

    public function ranjang(): HasMany
    {
        return $this->hasMany(Ranjang::class, 'kamar_id');
    }

    public function penempatan(): HasMany
    {
        return $this->hasMany(PenempatanAsrama::class, 'kamar_id');
    }
}
