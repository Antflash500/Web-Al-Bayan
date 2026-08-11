<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriProgram extends Model
{
    protected $table = 'kategori_program';

    protected $fillable = [
        'nama_kategori',
        'slug',
        'deskripsi',
        'status',
    ];

    public function programs()
    {
        return $this->hasMany(ProgramKursus::class, 'kategori_program_id');
    }
}
