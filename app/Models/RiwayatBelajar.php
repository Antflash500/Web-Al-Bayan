<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatBelajar extends Model
{
    protected $table = 'riwayat_belajar';

    protected $fillable = [
        'user_id',
        'materi_id',
        'durasi',
        'persentase',
        'tanggal',
    ];

    protected function casts(): array
    {
        return [
            'durasi' => 'integer',
            'persentase' => 'integer',
            'tanggal' => 'date',
        ];
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }
}
