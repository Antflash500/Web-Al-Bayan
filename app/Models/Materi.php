<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'gambar_path',
        'gambar_name',
        'gambar_size',
        'pdf_path',
        'pdf_name',
        'pdf_size',
        'video_path',
        'video_name',
        'video_size',
    ];

    protected $appends = ['gambar_url', 'pdf_url', 'video_url'];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
            'estimasi_menit' => 'integer',
            'gambar_size' => 'integer',
            'pdf_size' => 'integer',
            'video_size' => 'integer',
        ];
    }

    protected function gambarUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->gambar_path
                ? url('/media/materi/'.basename($this->gambar_path))
                : null
        );
    }

    protected function pdfUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->pdf_path
                ? url('/media/materi/'.basename($this->pdf_path))
                : null
        );
    }

    protected function videoUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->video_path
                ? url('/media/materi/'.basename($this->video_path))
                : null
        );
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

    public function kontens(): HasMany
    {
        return $this->hasMany(MateriKonten::class, 'materi_id')->orderBy('urutan');
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
