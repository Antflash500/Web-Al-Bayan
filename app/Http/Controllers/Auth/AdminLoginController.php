<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
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

    public function store(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $data = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('username', $data['username'])
            ->orWhere('email', $data['username'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password) || ! $user->isAdmin()) {
            throw ValidationException::withMessages([
                'username' => 'Username atau password tidak valid.',
            ]);
        }

        Auth::login($user, $request->boolean('remember'));

        return redirect()->route('admin.home');
    }
}
