<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiQuiz extends Model
{
    protected $table = 'nilai_quiz';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'jumlah_benar',
        'jumlah_salah',
        'nilai',
        'status',
        'tanggal_quiz',
    ];

    protected function casts(): array
    {
        return [
            'jumlah_benar' => 'integer',
            'jumlah_salah' => 'integer',
            'nilai' => 'integer',
            'tanggal_quiz' => 'datetime',
        ];
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }
}
