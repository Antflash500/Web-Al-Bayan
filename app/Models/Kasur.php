<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Kasur extends Model
{
    use HasFactory;

    protected $table = 'kasur';

    protected $fillable = [
        'ranjang_id',
        'posisi',
        'status',
    ];

    public function ranjang(): BelongsTo
    {
        return $this->belongsTo(Ranjang::class, 'ranjang_id');
    }

    public function penempatanAktif(): HasOne
    {
        return $this->hasOne(PenempatanAsrama::class, 'kasur_id')->where('status', 'aktif');
    }
}
