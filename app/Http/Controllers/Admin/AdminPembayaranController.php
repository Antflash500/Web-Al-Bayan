<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Services\PembayaranService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPembayaranController extends Controller
{
    public function __construct(private readonly PembayaranService $pembayaranService) {}

    public function index(Request $request): Response
    {
        $status = $request->query('status', 'pending');
        $allowed = ['pending', 'paid', 'failed', 'semua'];

        $query = Transaksi::with(['user.profile', 'program'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'semua') {
            $query->where('status', $status);
        }

        $transaksi = $query->get()->map(function ($t) {
            return [
                'id' => $t->id,
                'kode_transaksi' => $t->kode_transaksi,
                'user_id' => $t->user_id,
                'user_nama' => $t->user?->name ?? $t->user?->profile?->full_name ?? '—',
                'user_email' => $t->user?->email,
                'program_nama' => $t->program?->nama_program ?? 'Program Kursus',
                'jumlah' => $t->jumlah,
                'status' => $t->status,
                'metode_pembayaran' => $t->metode_pembayaran ?? '—',
                'has_bukti' => (bool) $t->bukti_pembayaran,
                'bukti_url' => $t->bukti_pembayaran
                    ? '/media/bukti/'.str_replace('bukti/', '', $t->bukti_pembayaran)
                    : null,
                'paid_at' => $t->paid_at?->format('d M Y H:i'),
                'verified_at' => $t->verified_at?->format('d M Y H:i'),
                'created_at' => $t->created_at?->format('d M Y H:i'),
            ];
        });

        return Inertia::render('Admin/Pembayaran', [
            'transaksi' => $transaksi,
            'activeStatus' => in_array($status, $allowed, true) ? $status : 'pending',
            'counts' => [
                'pending' => Transaksi::where('status', 'pending')->count(),
                'paid' => Transaksi::where('status', 'paid')->count(),
                'failed' => Transaksi::where('status', 'failed')->count(),
                'semua' => Transaksi::count(),
            ],
        ]);
    }

    public function approve(Transaksi $transaksi): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($transaksi->status === 'pending', 422, 'Transaksi bukan dalam status menunggu.');

        $this->pembayaranService->approvePayment($transaksi, auth()->user());

        return back()->with('success', 'Pembayaran disetujui. Program siswa telah diaktifkan.');
    }

    public function reject(Transaksi $transaksi): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($transaksi->status === 'pending', 422, 'Transaksi bukan dalam status menunggu.');

        $this->pembayaranService->rejectPayment($transaksi, auth()->user());

        return back()->with('success', 'Pembayaran ditolak.');
    }
}