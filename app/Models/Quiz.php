<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quiz extends Model
{
    use SoftDeletes;

    protected $table = 'quiz';

    protected $fillable = [
        'materi_id',
        'judul',
        'deskripsi',
        'nilai_minimum',
        'durasi_menit',
        'acak_soal',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'nilai_minimum' => 'integer',
            'durasi_menit' => 'integer',
            'acak_soal' => 'boolean',
        ];
    }

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }

    public function soalList(): HasMany
    {
        return $this->hasMany(SoalQuiz::class, 'quiz_id');
    }
}
