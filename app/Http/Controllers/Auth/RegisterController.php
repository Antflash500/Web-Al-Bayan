<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthenticationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function __construct(private readonly AuthenticationService $authService) {}

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function success(): Response
    {
        return Inertia::render('Auth/RegisterSuccess');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'string', 'digits:16', 'unique:student_profiles,nik'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],
            'birth_date' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'in:male,female'],
        ]);

        $this->authService->register($data);

        return redirect()->route('register.success');
    }
}
