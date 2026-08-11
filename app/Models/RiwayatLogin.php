<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatLogin extends Model
{
    protected $table = 'riwayat_login';

    protected $fillable = [
        'user_id',
        'ip_address',
        'browser',
        'sistem_operasi',
        'login_pada',
        'logout_pada',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'login_pada' => 'datetime',
            'logout_pada' => 'datetime',
        ];
    }
}
