<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgramKursus extends Model
{
    use SoftDeletes;

    protected $table = 'program';

    protected $fillable = [
        'kategori_program_id',
        'nama_program',
        'slug',
        'deskripsi',
        'thumbnail',
        'cover',
        'instruktur',
        'tingkat',
        'durasi_jam',
        'jumlah_materi',
        'status',
        'sort_order',
        'harga',
        'requires_dorm',
    ];

    protected function casts(): array
    {
        return [
            'durasi_jam' => 'integer',
            'jumlah_materi' => 'integer',
            'sort_order' => 'integer',
            'harga' => 'decimal:2',
            'requires_dorm' => 'boolean',
        ];
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriProgram::class, 'kategori_program_id');
    }

    public function materiList(): HasMany
    {
        return $this->hasMany(Materi::class, 'program_id');
    }

    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('status', 'aktif');
    }

    public function scopeUrut(Builder $query): Builder
    {
        return $query->orderBy('sort_order');
    }
}
