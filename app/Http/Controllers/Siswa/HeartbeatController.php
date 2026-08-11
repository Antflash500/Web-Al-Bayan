<?php

namespace App\Http\Controllers\Siswa;

use App\Events\StudentStatusUpdated;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HeartbeatController extends Controller
{
    public function ping(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $oldStatus = $user->getAttribute('last_activity_at')
                ? $user->last_activity_at->gt(now()->subMinutes(2))
                : false;

            $user->update(['last_activity_at' => now()]);

            $newStatus = true;

            if ($oldStatus !== $newStatus) {
                event(new StudentStatusUpdated(
                    $user->id,
                    'online',
                    now()->toDateTimeString()
                ));
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
