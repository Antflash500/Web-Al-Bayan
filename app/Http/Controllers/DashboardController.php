<?php

namespace App\Http\Controllers;

use App\Repositories\ContentRepository;
use App\Repositories\StudentRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly ContentRepository $content,
        private readonly StudentRepository $studentRepository,
    ) {}

    public function index(): Response
    {
        $user = auth()->user();
        $profile = $this->studentRepository->updateProfile($user, []);

        return Inertia::render('Dashboard/Home', [
            'profile' => $profile,
            'announcements' => $this->content->announcements(),
            'programs' => $this->content->programs(),
        ]);
    }

    public function programs(): Response
    {
        return Inertia::render('Dashboard/Programs', [
            'programs' => $this->content->programs(),
        ]);
    }

    public function announcements(): Response
    {
        return Inertia::render('Dashboard/Announcements', [
            'announcements' => $this->content->announcements(50),
        ]);
    }

    public function profile(): Response
    {
        $user = auth()->user();
        $profile = $this->studentRepository->updateProfile($user, []);

        return Inertia::render('Dashboard/Profile', [
            'profile' => $profile,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->studentRepository->updateProfile(auth()->user(), $data);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
