<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'full_name',
        'nim',
        'nik',
        'birth_date',
        'gender',
        'phone',
        'address',
        'avatar',
        'agreed_terms',
        'registration_status',
        'father_name',
        'father_address',
        'father_occupation',
        'father_phone',
        'mother_name',
        'mother_address',
        'mother_occupation',
        'mother_phone',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'agreed_terms' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
