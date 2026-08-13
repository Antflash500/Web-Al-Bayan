<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\SecurityService;
use App\Support\SecurityGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminLoginController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Login');
    }

    public function store(Request $request, SecurityService $security): \Symfony\Component\HttpFoundation\Response
    {
        $data = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            // Honeypot anti-bot: field tersembunyi yang harus tetap kosong.
            'website' => ['prohibited'],
        ]);

        $user = User::where('username', $data['username'])
            ->orWhere('email', $data['username'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password) || ! $user->isAdmin()) {
            SecurityGuard::recordLoginFailure((string) $request->ip());
            $security->recordLogin($user, (string) $request->ip(), (string) $request->userAgent(), false, 'admin');

            throw ValidationException::withMessages([
                'username' => 'Username atau password tidak valid.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();
        SecurityGuard::clearLoginFailures((string) $request->ip());
        $security->recordLogin($user, (string) $request->ip(), (string) $request->userAgent(), true, 'admin');

        return redirect()->route('admin.home');
    }
}
