<?php

namespace App\Services;

use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KwitansiService
{
    public function __construct(private readonly PythonRunner $python) {}

    /**
     * Daftar program pada template kwitansi (indeks 0-based).
     */
    private const TEMPLATE_PROGRAMS = [
        'Pesantren Mahasiswa',
        'Bootcamp Intensif Bahasa Arab',
        'Qiroah dan Nahwu',
        "Fahmul Masmu'",
        'Kitabah',
        'Tahsin Tilawah',
    ];

    public function generate(Transaksi $transaksi): array
    {
        if ($transaksi->status !== 'paid') {
            throw new \RuntimeException('Kwitansi hanya dapat diunduh untuk transaksi yang sudah lunas.');
        }

        $nomor = $this->ensureNomorKwitansi($transaksi);

        $outputPath = $this->outputPath($nomor);

        $tanggalPembayaran = $transaksi->paid_at ?? $transaksi->created_at;

        $payload = [
            'template' => public_path('images/template_kwitansi.jpg'),
            'font_custom' => public_path('fonts/font_template.otf'),
            'font_regular' => resource_path('fonts/kwitansi/arial.ttf'),
            'font_bold' => resource_path('fonts/kwitansi/arialbd.ttf'),
            'recipient' => $this->recipientName($transaksi),
            'amount' => max(0, (int) round((float) $transaksi->jumlah)),
            'payment' => $this->paymentMethod($transaksi),
            'programs' => $this->programIndexes($transaksi),
            'receipt_number' => (int) $nomor ?: 1,
            'day' => $tanggalPembayaran ? (int) $tanggalPembayaran->format('d') : now()->day,
            'month' => $tanggalPembayaran ? (int) $tanggalPembayaran->format('n') : now()->month,
            'output' => $outputPath,
        ];

        $jsonPath = storage_path('app/kwitansi/'.$nomor.'.json');
        @mkdir(dirname($jsonPath), 0777, true);
        file_put_contents($jsonPath, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        $command = [
            $this->python->binary(),
            base_path('scripts/kwitansi_generator.py'),
            $jsonPath,
            $outputPath,
        ];

        $process = $this->python->run($command);

        if ($process['code'] !== 0 || ! is_file($outputPath)) {
            throw new \RuntimeException('Gagal membuat kwitansi: '.trim($process['err'] ?: $process['out']));
        }

        $bytes = (string) file_get_contents($outputPath);

        $filename = sprintf(
            'kwitansi_AB_2026_%s_%s.png',
            $nomor,
            Str::of($this->recipientName($transaksi))->trim()->slug('_')->limit(40, '')
        );

        return [
            'bytes' => $bytes,
            'filename' => $filename,
        ];
    }

    private function ensureNomorKwitansi(Transaksi $transaksi): string
    {
        if ($transaksi->nomor_kwitansi !== null) {
            return $transaksi->nomor_kwitansi;
        }

        return DB::transaction(function () use ($transaksi) {
            $transaksi->refresh();

            if ($transaksi->nomor_kwitansi !== null) {
                return $transaksi->nomor_kwitansi;
            }

            $last = Transaksi::query()
                ->whereNotNull('nomor_kwitansi')
                ->orderByDesc('id')
                ->lockForUpdate()
                ->first();

            $next = $last ? ((int) $last->nomor_kwitansi) + 1 : 1;

            $nomor = sprintf('%04d', $next);
            $transaksi->update(['nomor_kwitansi' => $nomor]);

            return $nomor;
        });
    }

    private function recipientName(Transaksi $transaksi): string
    {
        $user = $transaksi->user;

        return trim($user?->profile?->full_name ?? $user?->name ?? '');
    }

    private function paymentMethod(Transaksi $transaksi): string
    {
        $metode = mb_strtoupper((string) ($transaksi->metode_pembayaran ?? ''));

        return str_contains($metode, 'QRIS') ? 'QRIS' : 'Transfer';
    }

    private function programIndexes(Transaksi $transaksi): array
    {
        $nama = mb_strtolower(trim((string) ($transaksi->program?->nama_program ?? '')));

        if ($nama === '') {
            return [];
        }

        // Prioritas: cocokkan template dengan nama program (substring) terpanjang.
        $best = null;
        foreach (self::TEMPLATE_PROGRAMS as $index => $templateName) {
            $needle = mb_strtolower($templateName);
            if (
                str_contains($nama, $needle)
                || str_contains($needle, $nama)
                || mb_strtolower($templateName) === mb_strtolower((string) $transaksi->program?->nama_program)
            ) {
                if ($best === null || mb_strlen($templateName) > mb_strlen(self::TEMPLATE_PROGRAMS[$best - 1])) {
                    $best = $index + 1;
                }
            }
        }

        return $best !== null ? [$best] : [];
    }

    private function outputPath(string $nomor): string
    {
        return storage_path('app/kwitansi/'.$nomor.'.png');
    }
}