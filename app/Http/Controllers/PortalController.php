<?php

namespace App\Http\Controllers;

use App\Models\SiswaProgram;
use App\Services\PortalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function __construct(private readonly PortalService $portal) {}

    public function home(): Response
    {
        return Inertia::render('Portal/Home', $this->portal->home(auth()->user()));
    }

    public function programs(Request $request): Response
    {
        $q = trim((string) $request->query('q'));

        return Inertia::render('Portal/Programs', $this->portal->programs($q !== '' ? $q : null));
    }

    public function programDetail(string $slug): Response
    {
        $program = $this->portal->programDetail($slug);
        $user = auth()->user();

        $isEnrolled = false;
        if ($user) {
            $isEnrolled = SiswaProgram::where('user_id', $user->id)
                ->where('program_id', $program->id)
                ->exists();
        }

        return Inertia::render('Portal/ProgramDetail', [
            'program' => $program,
            'isEnrolled' => $isEnrolled,
        ]);
    }

    public function materi(string $programSlug, string $materiSlug): Response
    {
        return Inertia::render('Portal/MateriShow', $this->portal->materi($materiSlug));
    }

    public function sertifikat(): Response
    {
        return Inertia::render('Portal/Sertifikat', [
            'certificates' => $this->portal->sertifikat(auth()->user()),
        ]);
    }

    public function profil(): Response
    {
        $user = auth()->user();

        return Inertia::render('Portal/Profil', [
            'email' => $user?->email,
            'profile' => $user?->profile,
        ]);
    }
}
