<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\ProgramKursus;
use App\Models\SiswaProgram;
use App\Models\Transaksi;
use App\Services\KwitansiService;
use App\Services\PembayaranService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiswaPembayaranController extends Controller
{
    public function __construct(
        private readonly PembayaranService $pembayaranService,
        private readonly KwitansiService $kwitansiService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $transaksiList = Transaksi::with('program')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'kode_transaksi' => $t->kode_transaksi,
                    'program_nama' => $t->program?->nama_program ?? 'Program Kursus',
                    'jumlah' => $t->jumlah,
                    'status' => $t->status,
                    'metode_pembayaran' => $t->metode_pembayaran ?? 'Bank Transfer',
                    'has_bukti' => (bool) $t->bukti_pembayaran,
                    'bukti_url' => $t->bukti_pembayaran
                        ? '/media/bukti/'.str_replace('bukti/', '', $t->bukti_pembayaran)
                        : null,
                    'paid_at' => $t->paid_at?->format('d M Y H:i'),
                    'created_at' => $t->created_at?->format('d M Y H:i'),
                ];
            });

        return Inertia::render('Siswa/Pembayaran', [
            'transaksi' => $transaksiList,
        ]);
    }

    public function checkout(string $slug): Response
    {
        /** @var ProgramKursus $program */
        $program = ProgramKursus::where('slug', $slug)->firstOrFail();
        $user = auth()->user();

        return Inertia::render('Siswa/Checkout', [
            'program' => [
                'id' => $program->id,
                'nama' => $program->nama_program ?? $program->nama,
                'slug' => $program->slug,
                'harga' => $program->harga ?? 0,
                'durasi' => ($program->durasi_jam ?? 0) > 0 ? $program->durasi_jam.' Jam' : '1 Bulan',
                'requires_dorm' => (bool) ($program->requires_dorm ?? false),
            ],
            'user' => [
                'name' => $user->name ?? $user->profile?->full_name,
                'email' => $user->email,
                'phone' => $user->profile?->phone,
            ],
        ]);
    }

    public function storeCheckout(Request $request)
    {
        $request->validate([
            'program_id' => ['required', 'exists:program,id'],
            'metode_pembayaran' => ['required', 'string'],
        ]);

        /** @var ProgramKursus $program */
        $program = ProgramKursus::findOrFail($request->input('program_id'));
        $user = $request->user();

        $alreadyEnrolled = Transaksi::where('user_id', $user->id)
            ->where('program_id', $program->id)
            ->where('status', 'paid')
            ->exists()
            || SiswaProgram::where('user_id', $user->id)
                ->where('program_id', $program->id)
                ->exists();

        if ($alreadyEnrolled) {
            return redirect()->route('siswa.program.cari')
                ->with('message', 'Anda sudah terdaftar pada program ini.');
        }

        $transaksi = $this->pembayaranService->createCheckout(
            $user,
            $program,
            $request->input('metode_pembayaran')
        );

        return redirect()->route('siswa.pembayaran')->with('message', 'Checkout berhasil. Silakan selesaikan pembayaran Anda.');
    }

    public function storeBukti(Request $request, string $kode)
    {
        $data = $request->validate([
            'metode' => ['required', 'in:transfer,qris'],
            'bukti' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        /** @var Transaksi $transaksi */
        $transaksi = Transaksi::where('kode_transaksi', $kode)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (! in_array($transaksi->status, ['pending', 'failed'], true)) {
            abort(422, 'Transaksi sudah tidak dapat diubah.');
        }

        $path = $data['bukti']->store('bukti', 'public');

        $this->pembayaranService->submitBuktiProof(
            $transaksi,
            $data['metode'] === 'qris' ? 'QRIS' : 'Transfer Bank',
            $path
        );

        return back()->with('message', 'Bukti pembayaran terkirim. Menunggu konfirmasi admin.');
    }

    public function unduhKwitansi(Request $request, Transaksi $transaksi)
    {
        abort_unless($transaksi->user_id === $request->user()->id, 403, 'Transaksi tidak ditemukan.');
        abort_unless($transaksi->status === 'paid', 422, 'Kwitansi hanya tersedia setelah pembayaran lunas.');

        $result = $this->kwitansiService->generate($transaksi);

        return response($result['bytes'], 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="'.$result['filename'].'"',
        ]);
    }
}
