<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\PenempatanAsrama;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaAsramaController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasAsramaAccess()) {
            return redirect()->route('siswa.dashboard')
                ->with('error', 'Fitur Asrama hanya tersedia untuk peserta program yang membutuhkan asrama dan pembayarannya telah dikonfirmasi.');
        }

        $penempatan = PenempatanAsrama::with(['kasur.ranjang.kamar.rumah'])
            ->where('user_id', $user->id)
            ->where('status', 'aktif')
            ->first();

        return Inertia::render('Siswa/Asrama', [
            'penempatan' => $penempatan ? [
                'is_assigned' => true,
                'rumah' => $penempatan->kasur?->ranjang?->kamar?->rumah?->nama,
                'kamar' => $penempatan->kasur?->ranjang?->kamar?->nomor_kamar,
                'ranjang' => sprintf('%02d', $penempatan->kasur?->ranjang?->nomor_ranjang ?? 0),
                'posisi' => $penempatan->kasur?->posisi,
                'status' => $penempatan->status,
                'tanggal_masuk' => $penempatan->tanggal_masuk?->format('d M Y'),
                'catatan' => $penempatan->catatan,
            ] : [
                'is_assigned' => false,
                'rumah' => null,
                'kamar' => null,
                'ranjang' => null,
                'posisi' => null,
                'status' => 'Menunggu Penempatan',
                'tanggal_masuk' => null,
                'catatan' => null,
            ],
        ]);
    }
}
