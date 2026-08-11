<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Gallery;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $gallery = [
            ['Ruang Tamu', 'Area penerimaan tamu yang bersih dan nyaman.'],
            ['Depan Asrama', 'Tampak depan hunian mahasiswa Al Bayan.'],
            ['Kamar 1', 'Kamar tidur dengan pencahayaan alami yang baik.'],
            ['Kamar 2', 'Ruang istirahat yang tenang dan bersih.'],
            ['Kamar 3', 'Kamar dengan tata ruang yang rapi.'],
            ['Kamar 4', 'Salah satu kamar dengan kapasitas lebih besar.'],
            ['Kamar Mandi 1', 'Kamar mandi bersih dengan fasilitas lengkap.'],
            ['Kamar Mandi 2', 'Fasilitas kamar mandi tambahan untuk santri.'],
            ['Tempat Jemuran', 'Area jemuran yang luas dan cukup sinar matahari.'],
            ['Garasi Motor', 'Tempat parkir motor yang aman dan tertutup.'],
            ['Ruang Tengah', 'Ruang berkumpul santri untuk belajar bersama.'],
            ['Dapur Umum', 'Dapur bersama yang bersih dan terawat.'],
        ];

        foreach ($gallery as $index => [$title, $description]) {
            Gallery::updateOrCreate(
                ['title' => $title],
                [
                    'image' => '/images/gallery/'.Str::slug($title).'.jpg',
                    'description' => $description,
                    'sort_order' => $index + 1,
                ],
            );
        }

        Announcement::updateOrCreate(
            ['title' => 'Pendaftaran Gelombang Baru Telah Dibuka'],
            [
                'content' => 'Pendaftaran peserta baru untuk program Bahasa Arab Intensif kini telah dibuka. Kuota terbatas, segera daftar melalui halaman registrasi.',
                'published_at' => now()->subDays(2),
            ],
        );

        Announcement::updateOrCreate(
            ['title' => 'Jadwal Pembinaan Pekan Ini'],
            [
                'content' => 'Pembinaan karakter dan kajian rutin diadakan setiap akhir pekan. Silakan cek agenda pada dashboard masing-masing.',
                'published_at' => now()->subDay(),
            ],
        );
    }
}
