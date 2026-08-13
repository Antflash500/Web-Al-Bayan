<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\MateriKonten;
use App\Models\ProgramKursus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminMateriController extends Controller
{
    public function index(ProgramKursus $program): Response
    {
        $materis = $program->materiList()
            ->with('kontens')
            ->orderBy('urutan')
            ->get();

        return Inertia::render('Admin/ProgramMateri', [
            'program' => [
                'id' => $program->id,
                'nama_program' => $program->nama_program,
                'slug' => $program->slug,
            ],
            'materis' => $materis->map(fn (Materi $materi) => [
                'id' => $materi->id,
                'judul' => $materi->judul,
                'slug' => $materi->slug,
                'deskripsi' => $materi->deskripsi,
                'urutan' => $materi->urutan,
                'estimasi_menit' => $materi->estimasi_menit,
                'status' => $materi->status,
                'gambar_url' => $materi->gambar_url,
                'gambar_name' => $materi->gambar_name,
                'gambar_size' => $materi->gambar_size,
                'pdf_url' => $materi->pdf_url,
                'pdf_name' => $materi->pdf_name,
                'pdf_size' => $materi->pdf_size,
                'video_url' => $materi->video_url,
                'video_name' => $materi->video_name,
                'video_size' => $materi->video_size,
                'kontens' => $materi->kontens->map(fn (MateriKonten $konten) => [
                    'id' => $konten->id,
                    'tipe' => $konten->tipe,
                    'judul' => $konten->judul,
                    'konten' => $konten->konten,
                    'url' => $konten->url,
                    'file_path' => $konten->file_path,
                    'file_name' => $konten->file_name,
                    'file_size' => $konten->file_size,
                    'urutan' => $konten->urutan,
                    'media_url' => $konten->file_path ? url('/media/materi/'.basename($konten->file_path)) : null,
                ])->values(),
            ])->values(),
        ]);
    }

    public function storeMateri(Request $request, ProgramKursus $program)
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:5000'],
            'estimasi_menit' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'string', 'in:aktif,draft,arsip'],
            'gambar' => ['nullable', 'file', 'image', 'max:10240'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/ogg', 'max:204800'],
        ]);

        $urutan = (int) $program->materiList()->max('urutan') + 1;

        Materi::create([
            'program_id' => $program->id,
            'judul' => $data['judul'],
            'slug' => Str::slug($data['judul']).'-'.Str::lower(Str::random(5)),
            'deskripsi' => $data['deskripsi'] ?? null,
            'urutan' => $urutan,
            'estimasi_menit' => $data['estimasi_menit'] ?? 0,
            'status' => $data['status'] ?? 'aktif',
        ] + $this->resolveBabFiles($request));

        $program->update(['jumlah_materi' => $program->materiList()->count()]);

        return back()->with('success', 'Bab materi ditambahkan.');
    }

    public function updateMateri(Request $request, ProgramKursus $program, Materi $materi)
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:5000'],
            'estimasi_menit' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'string', 'in:aktif,draft,arsip'],
            'gambar' => ['nullable', 'file', 'image', 'max:10240'],
            'pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/ogg', 'max:204800'],
        ]);

        $files = [];
        foreach (['gambar', 'pdf', 'video'] as $field) {
            $files = array_merge($files, $this->syncBabFile($request, $materi, $field));
        }

        $materi->update([
            'judul' => $data['judul'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'estimasi_menit' => $data['estimasi_menit'] ?? 0,
            'status' => $data['status'] ?? 'aktif',
        ] + $files);

        return back()->with('success', 'Bab materi diperbarui.');
    }

    public function destroyMateri(ProgramKursus $program, Materi $materi)
    {
        $materi->delete();
        $program->update(['jumlah_materi' => $program->materiList()->count()]);

        return back()->with('success', 'Bab materi dihapus.');
    }

    public function moveMateri(ProgramKursus $program, Materi $materi, string $direction)
    {
        abort_unless(in_array($direction, ['up', 'down'], true), 422);

        $siblings = $program->materiList()->orderBy('urutan')->pluck('urutan', 'id')->toArray();

        $this->swapWithNeighbor($materi->id, $materi->urutan, $direction, $siblings, Materi::class, 'program_id', $program->id);

        return back()->with('success', 'Urutan bab materi disimpan.');
    }

    public function storeKonten(Request $request, ProgramKursus $program, Materi $materi)
    {
        $data = $request->validate([
            'tipe' => ['required', 'string', 'in:teks,pdf,video,gambar,video_link'],
            'judul' => ['nullable', 'string', 'max:255'],
            'konten' => ['nullable', 'string', 'max:20000'],
            'url' => ['nullable', 'string', 'max:500'],
            'file' => ['nullable', 'file', 'max:204800'],
        ]);

        $tipe = $data['tipe'];

        if ($tipe === 'teks' && blank($data['konten'] ?? null)) {
            return back()->withErrors(['error' => 'Konten teks wajib diisi.']);
        }

        if ($tipe === 'video_link' && blank($data['url'] ?? null)) {
            return back()->withErrors(['error' => 'Link video wajib diisi.']);
        }

        if (in_array($tipe, ['pdf', 'video', 'gambar'], true) && ! $request->hasFile('file')) {
            return back()->withErrors(['error' => 'File wajib diunggah untuk tipe ini.']);
        }

        $fileData = $this->resolveUploadedFile($request, $tipe);

        $urutan = (int) MateriKonten::where('materi_id', $materi->id)->max('urutan') + 1;

        MateriKonten::create([
            'materi_id' => $materi->id,
            'tipe' => $tipe,
            'judul' => $data['judul'] ?? null,
            'konten' => $data['konten'] ?? null,
            'url' => $data['url'] ?? null,
            'urutan' => $urutan,
            'status' => 'aktif',
        ] + $fileData);

        return back()->with('success', 'Konten materi ditambahkan.');
    }

    public function updateKonten(Request $request, ProgramKursus $program, Materi $materi, MateriKonten $konten)
    {
        $data = $request->validate([
            'tipe' => ['nullable', 'string', 'in:teks,pdf,video,gambar,video_link'],
            'judul' => ['nullable', 'string', 'max:255'],
            'konten' => ['nullable', 'string', 'max:20000'],
            'url' => ['nullable', 'string', 'max:500'],
            'file' => ['nullable', 'file', 'max:204800'],
        ]);

        $tipe = $data['tipe'] ?? $konten->tipe;

        if ($tipe === 'teks' && blank($data['konten'] ?? null)) {
            return back()->withErrors(['error' => 'Konten teks wajib diisi.']);
        }

        $fileData = $this->resolveUploadedFile($request, $tipe);

        $konten->update([
            'tipe' => $tipe,
            'judul' => array_key_exists('judul', $data) ? ($data['judul'] ?? null) : $konten->judul,
            'konten' => array_key_exists('konten', $data) ? ($data['konten'] ?? null) : $konten->konten,
            'url' => array_key_exists('url', $data) ? ($data['url'] ?? null) : $konten->url,
        ] + $fileData);

        return back()->with('success', 'Konten materi diperbarui.');
    }

    public function destroyKonten(ProgramKursus $program, Materi $materi, MateriKonten $konten)
    {
        if ($konten->file_path) {
            Storage::disk('public')->delete($konten->file_path);
        }

        $konten->delete();

        return back()->with('success', 'Konten materi dihapus.');
    }

    public function moveKonten(ProgramKursus $program, Materi $materi, MateriKonten $konten, string $direction)
    {
        abort_unless(in_array($direction, ['up', 'down'], true), 422);

        $siblings = MateriKonten::where('materi_id', $materi->id)->orderBy('urutan')->pluck('urutan', 'id')->toArray();

        $this->swapWithNeighbor($konten->id, $konten->urutan, $direction, $siblings, MateriKonten::class, 'materi_id', $materi->id);

        return back()->with('success', 'Urutan konten disimpan.');
    }

    private function resolveBabFiles(Request $request): array
    {
        $files = [];

        foreach (['gambar', 'pdf', 'video'] as $field) {
            if (! $request->hasFile($field)) {
                continue;
            }

            $file = $request->file($field);
            $path = $file->store('materi', 'public');

            $files[$field.'_path'] = $path;
            $files[$field.'_name'] = $file->getClientOriginalName();
            $files[$field.'_size'] = $file->getSize();
        }

        return $files;
    }

    private function syncBabFile(Request $request, Materi $materi, string $field): array
    {
        $pathKey = $field.'_path';
        $nameKey = $field.'_name';
        $sizeKey = $field.'_size';
        $existing = $materi->{$pathKey};

        if ($request->boolean('remove_'.$field)) {
            if ($existing) {
                Storage::disk('public')->delete($existing);
            }

            return [$pathKey => null, $nameKey => null, $sizeKey => null];
        }

        if (! $request->hasFile($field)) {
            return [];
        }

        if ($existing) {
            Storage::disk('public')->delete($existing);
        }

        $file = $request->file($field);
        $path = $file->store('materi', 'public');

        return [
            $pathKey => $path,
            $nameKey => $file->getClientOriginalName(),
            $sizeKey => $file->getSize(),
        ];
    }

    private function resolveUploadedFile(Request $request, string $tipe): array
    {
        $file = $request->file('file');

        if (! $file) {
            return [];
        }

        $mime = strtolower((string) $file->getMimeType());

        $allowed = match ($tipe) {
            'pdf' => $mime === 'application/pdf',
            'gambar' => str_starts_with($mime, 'image/'),
            'video' => str_starts_with($mime, 'video/'),
            default => false,
        };

        if (! $allowed) {
            abort(422, 'Jenis file tidak sesuai dengan tipe konten.');
        }

        $path = $file->store('materi', 'public');

        return [
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
        ];
    }

    private function swapWithNeighbor(int $id, int $urutan, string $direction, array $siblings, string $model, string $parentKey, int $parentId): void
    {
        $ids = array_keys($siblings);
        $index = array_search($id, $ids, true);

        if ($index === false) {
            return;
        }

        $neighborIndex = $direction === 'up' ? $index - 1 : $index + 1;

        if ($neighborIndex < 0 || $neighborIndex >= count($ids)) {
            return;
        }

        $neighborId = $ids[$neighborIndex];

        $model::where('id', $id)->where($parentKey, $parentId)->update(['urutan' => $siblings[$neighborId]]);
        $model::where('id', $neighborId)->where($parentKey, $parentId)->update(['urutan' => $urutan]);
    }
}
