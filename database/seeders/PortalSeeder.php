<?php

namespace Database\Seeders;

use App\Models\KategoriProgram;
use App\Models\Materi;
use App\Models\Pengumuman;
use App\Models\ProgramKursus;
use App\Models\SiswaProgram;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class PortalSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedKategoriDanProgram();
        $this->seedPengumuman();
        $this->seedAkunDemo();
    }

    private function seedKategoriDanProgram(): void
    {
        $bahasaArab = KategoriProgram::firstOrCreate([
            'slug' => 'bahasa-arab',
        ], [
            'nama_kategori' => 'Bahasa Arab',
            'deskripsi' => 'Program pembelajaran Bahasa Arab bertahap.',
            'status' => 'aktif',
        ]);

        $tahsin = KategoriProgram::firstOrCreate([
            'slug' => 'tahsin',
        ], [
            'nama_kategori' => 'Tahsin',
            'deskripsi' => 'Perbaikan bacaan dan makhraj huruf.',
            'status' => 'aktif',
        ]);

        $kategori = [$bahasaArab, $tahsin];

        $data = [
            ['Bahasa Arab Dasar', 'bahasa-arab-dasar', 'pemula', 'Ust. Ahmad Fauzan', 3],
            ['Nahwu Pemula', 'nahwu-pemula', 'pemula', 'Ust. Hasan Ali', 2],
            ['Sharaf Dasar', 'sharaf-dasar', 'menengah', 'Ust. Hasan Ali', 2],
            ['Muhadatsah', 'muhadatsah', 'menengah', 'Ust. Abdurrahman', 1],
            ['Tahsin Tilawah', 'tahsin-tilawah', 'pemula', 'Ust. Bakri', 2],
        ];

        foreach ($data as $i => [$nama, $slug, $tingkat, $instruktur, $durasi]) {
            $program = $this->createOrUpdateProgram($slug, [
                'kategori_program_id' => $kategori[$i >= 4 ? 1 : 0]->id,
                'nama_program' => $nama,
                'deskripsi' => "Program pembelajaran \"{$nama}\" dirancang bertahap agar mudah diikuti pemula.",
                'instruktur' => $instruktur,
                'tingkat' => $tingkat,
                'durasi_jam' => $durasi,
                'jumlah_materi' => 0,
                'status' => 'aktif',
                'sort_order' => $i,
            ]);

            $this->seedMateri($program->id, $nama, count($data) === $i + 1 ? 4 : random_int(3, 5));
        }
    }

    private function createOrUpdateProgram(string $slug, array $attributes): ProgramKursus
    {
        $attributes['slug'] = $slug;

        $existing = ProgramKursus::withTrashed()->where('slug', $slug)->first();

        if ($existing) {
            $existing->restore();
            $existing->update($attributes);

            return $existing->refresh();
        }

        return ProgramKursus::create($attributes);
    }

    private function seedMateri(int $programId, string $programName, int $jumlah): void
    {
        $bab = ['Huruf Hijaiyah', 'Harakat', 'Mufradat Sehari-hari', 'Isim dan Fili', 'Tashrif'];

        for ($i = 0; $i < $jumlah; $i++) {
            $judul = 'Bab '.($i + 1).': '.($bab[$i] ?? 'Materi '.($i + 1));
            $existing = Materi::withTrashed()
                ->where('program_id', $programId)
                ->where('urutan', $i)
                ->first();

            if ($existing) {
                $existing->restore();
                $existing->update([
                    'judul' => $judul,
                    'slug' => str($programName)->slug().'-bab-'.($i + 1),
                    'deskripsi' => 'Pembelajaran bagian '.$judul.' pada program '.$programName.'.',
                    'estimasi_menit' => 20,
                    'status' => 'aktif',
                ]);

                continue;
            }

            Materi::create([
                'program_id' => $programId,
                'judul' => $judul,
                'slug' => str($programName)->slug().'-bab-'.($i + 1),
                'deskripsi' => 'Pembelajaran bagian '.$judul.' pada program '.$programName.'.',
                'estimasi_menit' => 20,
                'status' => 'aktif',
                'urutan' => $i,
            ]);
        }
    }

    private function seedPengumuman(): void
    {
        Pengumuman::firstOrCreate(
            ['judul' => 'Jadwal Libur Semester'],
            [
                'isi' => 'Libur semester dimulai 1 Februari sampai 14 Februari. Seluruh materi tetap dapat diakses secara daring.',
                'tanggal_publish' => now()->subDays(2),
                'status' => 'aktif',
            ]
        );

        Pengumuman::firstOrCreate(
            ['judul' => 'Program Baru: Muhadatsah'],
            [
                'isi' => 'Program Muhadatsah kini terbuka untuk pendaftaran. Khusus untuk santri aktif Biaya pendaftaran gratis.',
                'tanggal_publish' => now()->subDays(5),
                'status' => 'aktif',
            ]
        );
    }

    private function seedAkunDemo(): void
    {
        $siswa = User::firstOrCreate(
            ['email' => 'siswa@albayan.test'],
            [
                'username' => 'siswa123',
                'name' => 'Ahmad Fauzan',
                'password' => 'password123',
                'role' => User::ROLE_STUDENT,
                'status' => User::STATUS_AKTIF,
                'email_verified_at' => now(),
            ]
        );

        $siswa->update(['username' => 'siswa123']);

        User::firstOrCreate(
            ['username' => 'adminalbayan'],
            [
                'name' => 'Administrator Al Bayan',
                'email' => 'admin@albayan.test',
                'password' => 'albayan123',
                'role' => User::ROLE_ADMIN,
                'status' => User::STATUS_AKTIF,
                'email_verified_at' => now(),
            ]
        );

        StudentProfile::firstOrCreate(
            ['user_id' => $siswa->id],
            [
                'full_name' => 'Ahmad Fauzan',
                'birth_date' => '2006-04-16',
                'gender' => 'male',
                'phone' => '081234567890',
                'agreed_terms' => true,
            ]
        );

        $programPertama = ProgramKursus::where('slug', 'bahasa-arab-dasar')->first();
        if ($programPertama) {
            SiswaProgram::firstOrCreate(
                [
                    'user_id' => $siswa->id,
                    'program_id' => $programPertama->id,
                ],
                [
                    'tanggal_mulai' => now(),
                    'status' => 'aktif',
                ]
            );
        }
    }
}
