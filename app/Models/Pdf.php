<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pdf extends Model
{
    use SoftDeletes;

    protected $table = 'pdf';

    protected $fillable = [
        'materi_id',
        'judul_file',
        'nama_file',
        'ukuran_file',
        'jumlah_halaman',
        'status',
    ];

    public function materi(): BelongsTo
    {
        return $this->belongsTo(Materi::class, 'materi_id');
    }
}
