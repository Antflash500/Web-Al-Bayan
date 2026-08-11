<?php

namespace App\Http\Controllers;

use App\Repositories\ContentRepository;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __construct(private readonly ContentRepository $content) {}

    public function index(): Response
    {
        return $this->render();
    }

    public function tentang(): Response
    {
        return $this->render('tentang');
    }

    public function program(): Response
    {
        return $this->render('program');
    }

    public function galeri(): Response
    {
        return $this->render('galeri');
    }

    public function kontak(): Response
    {
        return $this->render('kontak');
    }

    private function render(?string $initialSection = null): Response
    {
        return Inertia::render('Landing', [
            'programs' => $this->content->programs(),
            'gallery' => $this->content->gallery(),
            'initialSection' => $initialSection,
        ]);
    }
}
