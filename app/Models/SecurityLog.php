<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityLog extends Model
{
    use HasFactory;

    public const TIPE_LOGIN_SUKSES = 'login_sukses';

    public const TIPE_LOGIN_GAGAL = 'login_gagal';

    public const TIPE_DIBLOKIR = 'diblokir';

    public const TIPE_BANNED = 'banned';

    public const TIPE_UNBANNED = 'unbanned';

    public const TIPE_PORT_SCAN = 'port_scan';

    public const TIPES = [
        self::TIPE_LOGIN_SUKSES => 'Login Sukses',
        self::TIPE_LOGIN_GAGAL => 'Login Gagal',
        self::TIPE_DIBLOKIR => 'Diblokir',
        self::TIPE_BANNED => 'Diban',
        self::TIPE_UNBANNED => 'Di-unban',
        self::TIPE_PORT_SCAN => 'Port Scan',
    ];

    protected $table = 'security_logs';

    protected $fillable = [
        'tipe',
        'user_id',
        'ip_address',
        'browser',
        'sistem_operasi',
        'path',
        'keterangan',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
