<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    public const ROLE_ADMIN = 'admin';

    public const ROLE_STUDENT = 'student';

    public const STATUS_AKTIF = 'aktif';

    public const STATUS_NONAKTIF = 'nonaktif';

    public const STATUS_PENDING = 'pending';

    protected $table = 'users';

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role',
        'status',
        'last_activity_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    public function penempatanAsrama(): HasOne
    {
        return $this->hasOne(PenempatanAsrama::class)->where('status', 'aktif');
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function siswaPrograms()
    {
        return $this->hasMany(SiswaProgram::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isStudent(): bool
    {
        return $this->role === self::ROLE_STUDENT || $this->role === 'siswa';
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function hasAsramaAccess(): bool
    {
        // Ambil semua program yang requires_dorm = true
        $dormProgramIds = ProgramKursus::where('requires_dorm', true)->pluck('id');

        if ($dormProgramIds->isEmpty()) {
            return false;
        }

        // Asrama tampil jika siswa memiliki transaksi paid untuk program requires_dorm
        return $this->transaksi()
            ->whereIn('program_id', $dormProgramIds)
            ->where('status', 'paid')
            ->exists();
    }
}
