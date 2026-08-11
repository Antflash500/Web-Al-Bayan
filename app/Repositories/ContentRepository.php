<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\Gallery;
use App\Models\ProgramKursus;
use Illuminate\Database\Eloquent\Collection;

class ContentRepository
{
    public function programs(): Collection
    {
        return ProgramKursus::aktif()
            ->with('kategori')
            ->withCount('materiList')
            ->urut()
            ->get();
    }

    public function gallery(): Collection
    {
        return Gallery::orderBy('sort_order')->get();
    }

    public function announcements(int $limit = 5): Collection
    {
        return Announcement::active()
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();
    }
}
