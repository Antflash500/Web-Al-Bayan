<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'name' => 'Bahasa Arab Intensif',
                'schedule' => 'Senin – Jumat',
                'duration' => '3 Bulan',
                'description' => 'Program pembelajaran Bahasa Arab dasar hingga menengah dengan metode interaktif dan praktik harian.',
            ],
            [
                'name' => 'Tahfidzul Quran',
                'schedule' => 'Setiap Hari',
                'duration' => '2 Tahun',
                'description' => 'Hafalan Al-Quran dengan bimbingan hafizh bersanad, setoran rutin, dan evaluasi pekanan.',
            ],
            [
                'name' => 'Mahad & Hunian Santri',
                'schedule' => '24 Jam',
                'duration' => 'Tahunan',
                'description' => 'Hunian mahasiswa yang nyaman dalam lingkungan islami, dekat dengan kampus dan fasilitas umum.',
            ],
            [
                'name' => 'Kelas Malam (BA)',
                'schedule' => 'Senin – Kamis',
                'duration' => '6 Bulan',
                'description' => 'Kelas Bahasa Arab malam untuk mahasiswa dan umum yang memiliki aktivitas di siang hari.',
            ],
            [
                'name' => 'Persiapan Beasiswa',
                'schedule' => 'Sabtu – Ahad',
                'duration' => '4 Bulan',
                'description' => 'Program intensif persiapan tes Bahasa Arab untuk beasiswa kampus dalam dan luar negeri.',
            ],
            [
                'name' => 'Pembinaan Karakter',
                'schedule' => 'Mingguan',
                'duration' => 'Berjalan',
                'description' => 'Kajian rutin dan pembinaan adab serta akhlak sebagai bekal kehidupan para peserta.',
            ],
        ];

        foreach ($programs as $index => $program) {
            Program::updateOrCreate(
                ['name' => $program['name']],
                array_merge($program, [
                    'slug' => Str::slug($program['name']),
                    'sort_order' => $index + 1,
                ]),
            );
        }
    }
}
