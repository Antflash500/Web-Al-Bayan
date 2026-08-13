<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MateriKonten extends Model
{
    protected $table = 'materi_konten';

    protected $fillable = [
        'materi_id',
        'tipe',
        'judul',
        'konten',
        'url',
        'file_path',
        'file_name',
        'file_size',
        'urutan',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'urutan' => 'integer',
        ];
    }

    protected function mediaUrl(): Attribute
    {
        return Attribute::get(
            fn (): ?string => $this->file_path
                ? url('/media/materi/'.basename($this->file_path))
                : null
        );
    }

    protected $appends = ['media_url'];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }
}
