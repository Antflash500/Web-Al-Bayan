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

        $penempatan = PenempatanAsrama::with(['kamar', 'ranjang'])
            ->where('user_id', $user->id)
            ->where('status', 'aktif')
            ->first();

        return Inertia::render('Siswa/Asrama', [
            'penempatan' => $penempatan ? [
                'is_assigned' => true,
                'kamar' => $penempatan->kamar?->nomor_kamar,
                'ranjang' => sprintf('%02d', $penempatan->ranjang?->nomor_ranjang ?? 0),
                'status' => $penempatan->status,
                'tanggal_masuk' => $penempatan->tanggal_masuk?->format('d M Y'),
                'catatan' => $penempatan->catatan,
            ] : [
                'is_assigned' => false,
                'kamar' => null,
                'ranjang' => null,
                'status' => 'Menunggu Penempatan',
                'tanggal_masuk' => null,
                'catatan' => null,
            ],
        ]);
    }
}
