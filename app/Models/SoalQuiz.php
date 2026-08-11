<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SoalQuiz extends Model
{
    protected $table = 'soal_quiz';

    protected $fillable = [
        'quiz_id',
        'pertanyaan',
        'jenis',
        'poin',
        'urutan',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    public function pilihan(): HasMany
    {
        return $this->hasMany(PilihanJawaban::class, 'soal_id');
    }
}
