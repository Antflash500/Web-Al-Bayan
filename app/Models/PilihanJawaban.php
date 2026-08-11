<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PilihanJawaban extends Model
{
    protected $table = 'pilihan_jawaban';

    protected $fillable = [
        'soal_id',
        'pilihan',
        'benar',
    ];

    protected function casts(): array
    {
        return [
            'benar' => 'boolean',
        ];
    }

    public function soal(): BelongsTo
    {
        return $this->belongsTo(SoalQuiz::class, 'soal_id');
    }
}
