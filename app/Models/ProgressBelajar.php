<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressBelajar extends Model
{
    protected $table = 'progress_belajar';

    protected $fillable = [
        'user_id',
        'program_id',
        'materi_id',
        'video_id',
        'persentase',
        'durasi_tonton',
        'status',
        'terakhir_diakses',
    ];

    protected function casts(): array
    {
        return [
            'persentase' => 'integer',
            'durasi_tonton' => 'integer',
            'terakhir_diakses' => 'datetime',
        ];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramKursus::class, 'program_id');
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }
}
