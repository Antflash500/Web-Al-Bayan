<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Audio extends Model
{
    use SoftDeletes;

    protected $table = 'audio';

    protected $fillable = [
        'materi_id',
        'judul_audio',
        'nama_file',
        'durasi',
        'status',
    ];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }
}
