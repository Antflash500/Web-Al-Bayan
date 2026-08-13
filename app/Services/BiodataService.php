<?php

namespace App\Services;

use App\Models\PenempatanAsrama;
use App\Models\SiswaProgram;
use App\Models\User;
use Illuminate\Support\Str;

class BiodataService
{
    private const MAX_PROGRAMS = 6;

    public function __construct(private readonly PythonRunner $python) {}

    /**
     * Membuat file PNG biodata siswa berdasarkan data akun, program,
     * dan penempatan asrama yang sedang aktif.
     *
     * @return array{bytes:string, filename:string}
     */
    public function generate(User $user): array
    {
        $profile = $user->profile;

        $nama = trim((string) ($profile?->full_name ?? $user->name ?? ''));

        $outputPath = $this->outputPath($user);

        $payload = $this->buildPayload($user, $nama, $outputPath);

        $jsonPath = storage_path('app/biodata/'.$user->id.'.json');
        @mkdir(dirname($jsonPath), 0777, true);
        file_put_contents($jsonPath, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        $command = [
            $this->python->binary(),
            base_path('scripts/biodata_generator.py'),
            $jsonPath,
            $outputPath,
        ];

        $process = $this->python->run($command);

        if ($process['code'] !== 0 || ! is_file($outputPath)) {
            throw new \RuntimeException('Gagal membuat biodata: '.trim($process['err'] ?: $process['out']));
        }

        return [
            'bytes' => (string) file_get_contents($outputPath),
            'filename' => sprintf(
                'biodata_%s_%s.png',
                $nama !== '' ? Str::of($nama)->trim()->slug('_')->limit(40, '') : 'siswa',
                $user->id
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildPayload(User $user, string $nama, string $outputPath): array
    {
        $profile = $user->profile;

        $programs = $this->programPayload($user);
        $asrama = $this->asramaPayload($user);

        $payload = [
            'template' => public_path('images/template_biodata.png'),
            'font_regular' => resource_path('fonts/kwitansi/arial.ttf'),
            'font_bold' => resource_path('fonts/kwitansi/arialbd.ttf'),
            'output' => $outputPath,
            'teks_1' => $nama,
            'teks_2' => $profile?->nik,
            'teks_3' => $profile?->birth_date?->format('d F Y'),
            'teks_4' => $this->genderLabel($profile?->gender),
            'teks_5' => $profile?->phone,
            'teks_6' => $profile?->address,
            'teks_11' => $profile?->father_name,
            'teks_12' => $profile?->father_address,
            'teks_15' => $profile?->father_occupation,
            'teks_16' => $profile?->father_phone,
            'teks_17' => $profile?->mother_name,
            'teks_18' => $profile?->mother_address,
            'teks_21' => $profile?->mother_occupation,
            'teks_22' => $profile?->mother_phone,
        ];

        foreach ($programs as $index => $program) {
            $payload['teks_'.(23 + $index)] = $program['nama'];
            $payload['teks_'.(29 + $index)] = $program['status'];
        }

        $payload['teks_35'] = $asrama['rumah'];
        $payload['teks_36'] = $asrama['kamar'];
        $payload['teks_37'] = $asrama['ranjang'];
        $payload['teks_38'] = $asrama['kasur'];

        return $payload;
    }

    /**
     * @return array<int, array{nama:string, status:string}>
     */
    private function programPayload(User $user): array
    {
        return SiswaProgram::with('program')
            ->where('user_id', $user->id)
            ->limit(self::MAX_PROGRAMS)
            ->get()
            ->map(fn (SiswaProgram $sp) => [
                'nama' => trim((string) ($sp->program?->nama_program ?? '')),
                'status' => trim((string) ($sp->status ?? '')),
            ])
            ->filter(fn (array $item) => $item['nama'] !== '')
            ->values()
            ->all();
    }

    /**
     * @return array{rumah:?string, kamar:?string, ranjang:?string, kasur:?string}
     */
    private function asramaPayload(User $user): array
    {
        $penempatan = PenempatanAsrama::with(['kasur.ranjang.kamar.rumah'])
            ->where('user_id', $user->id)
            ->where('status', 'aktif')
            ->first();

        if (! $penempatan) {
            return ['rumah' => null, 'kamar' => null, 'ranjang' => null, 'kasur' => null];
        }

        return [
            'rumah' => $penempatan->kasur?->ranjang?->kamar?->rumah?->nama,
            'kamar' => $penempatan->kasur?->ranjang?->kamar?->nomor_kamar,
            'ranjang' => $penempatan->kasur?->ranjang?->nomor_ranjang !== null
                ? sprintf('%02d', $penempatan->kasur->ranjang->nomor_ranjang)
                : null,
            'kasur' => $penempatan->kasur?->posisi !== null
                ? ucfirst((string) $penempatan->kasur->posisi)
                : null,
        ];
    }

    private function genderLabel(?string $gender): ?string
    {
        return match ($gender) {
            'male' => 'Laki-laki',
            'female' => 'Perempuan',
            default => $gender,
        };
    }

    private function outputPath(User $user): string
    {
        return storage_path('app/biodata/'.$user->id.'.png');
    }
}