<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $user = $request->user();
        $profile = $user?->profile;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name ?? $profile?->full_name ?? $user->email,
                    'username' => $user->username,
                    'role' => $user->role,
                    'avatar' => $profile?->avatar,
                    'verified' => $user->email_verified_at !== null,
                    'asrama' => $user->hasAsramaAccess(),
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'message' => $request->session()->get('message'),
                'error' => $request->session()->get('error'),
                'status' => $request->session()->get('status'),
            ],
            'profile' => $profile,
            'access' => [
                'asrama' => $user ? $user->hasAsramaAccess() : false,
            ],
        ];
    }
}
