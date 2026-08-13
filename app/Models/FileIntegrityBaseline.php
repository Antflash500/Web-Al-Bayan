<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileIntegrityBaseline extends Model
{
    protected $table = 'file_integrity_baselines';

    protected $fillable = [
        'path',
        'checksum',
        'size',
        'baseline_at',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'baseline_at' => 'datetime',
        ];
    }
}
