<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Materi extends Model
{
    use SoftDeletes;

    protected $table = 'materi';

    protected $fillable = [
        'program_id',
        'judul',
        'slug',
        'deskripsi',
        'urutan',
        'estimasi_menit',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
            'estimasi_menit' => 'integer',
        ];
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramKursus::class, 'program_id');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class, 'materi_id');
    }

    public function pdfs(): HasMany
    {
        return $this->hasMany(Pdf::class, 'materi_id');
    }

    public function audios(): HasMany
    {
        return $this->hasMany(Audio::class, 'materi_id');
    }

    public function quizes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'materi_id');
    }

    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('status', 'aktif');
    }
}
