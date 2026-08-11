<?php

namespace App\Support;

use Illuminate\Broadcasting\BroadcastException;

final class SafeBroadcast
{
    /**
     * Dispatch a broadcast event without failing the main operation
     * when the realtime server (Reverb) is unreachable.
     */
    public static function run(callable $dispatch): void
    {
        try {
            $dispatch();
        } catch (BroadcastException) {
            // Realtime server tidak tersedia; broadcast bersifat opsional.
        }
    }
}