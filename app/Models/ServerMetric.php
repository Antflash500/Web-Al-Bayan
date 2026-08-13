<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerMetric extends Model
{
    protected $table = 'server_metrics';

    protected $fillable = [
        'cpu_load',
        'memory_total',
        'memory_used',
        'disk_total',
        'disk_free',
        'uptime',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'cpu_load' => 'float',
            'memory_total' => 'integer',
            'memory_used' => 'integer',
            'disk_total' => 'integer',
            'disk_free' => 'integer',
            'uptime' => 'integer',
            'recorded_at' => 'datetime',
        ];
    }
}
