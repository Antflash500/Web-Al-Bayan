<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes;

    protected $table = 'video';

    protected $fillable = [
        'materi_id',
        'judul_video',
        'deskripsi',
        'url_video',
        'durasi',
        'thumbnail',
        'status',
    ];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }
}
