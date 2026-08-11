<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(private readonly AuthenticationService $authService) {}

    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $user = $this->authService->login($data['username'], $data['password']);

        if (! $user) {
            return back()->withErrors([
                'username' => 'Username atau password salah, atau akun belum diaktifkan admin.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));

        return redirect()->route($user->isAdmin() ? 'admin.home' : 'siswa.dashboard');
    }
}
