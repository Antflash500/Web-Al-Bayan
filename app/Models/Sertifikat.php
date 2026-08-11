<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sertifikat extends Model
{
    protected $table = 'sertifikat';

    protected $fillable = [
        'user_id',
        'program_id',
        'nomor_sertifikat',
        'tanggal_terbit',
        'lokasi_file',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_terbit' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramKursus::class, 'program_id');
    }
}
