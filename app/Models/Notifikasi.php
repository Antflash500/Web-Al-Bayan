<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasi';

    protected $fillable = [
        'user_id',
        'judul',
        'pesan',
        'dibaca',
        'jenis',
    ];

    protected function casts(): array
    {
        return [
            'dibaca' => 'boolean',
        ];
    }
}
