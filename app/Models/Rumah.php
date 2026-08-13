<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rumah extends Model
{
    use HasFactory;

    protected $table = 'rumah';

    protected $fillable = [
        'nama',
        'keterangan',
        'status',
    ];

    public function kamar(): HasMany
    {
        return $this->hasMany(Kamar::class, 'rumah_id');
    }
}
