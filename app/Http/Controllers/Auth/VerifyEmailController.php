<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VerifyEmailController extends Controller
{
    public function __construct(private readonly AuthenticationService $authService) {}

    public function create(): Response
    {
        return Inertia::render('Auth/VerifyEmail');
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        abort_unless($user, 401);

        $data = $request->validate([
            'code' => ['required', 'string', 'size:6', 'numeric'],
        ]);

        $verified = $this->authService->verifyOtp($user->email, $data['code']);

        if (! $verified) {
            return back()->withErrors(['code' => 'Kode OTP salah atau telah kedaluwarsa.']);
        }

        $this->authService->markEmailVerified($user);

        return redirect()->route(auth()->user()->isAdmin() ? 'dashboard' : 'portal.home');
    }

    public function resend(Request $request)
    {
        $user = $request->user();

        abort_unless($user, 401);

        $result = $this->authService->sendOtp($user->email);

        return back()->with('status', $result['sent'] ? 'Kode OTP baru telah dikirim.' : 'Silakan tunggu sebelum mengirim ulang.');
    }
}
