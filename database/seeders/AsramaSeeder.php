<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Ranjang;
use Illuminate\Database\Seeder;

class AsramaSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $nomorKamar = sprintf('%02d', $i);

            $kamar = Kamar::firstOrCreate(
                ['nomor_kamar' => $nomorKamar],
                [
                    'kapasitas' => 6,
                    'status' => 'tersedia',
                    'keterangan' => "Gedung Asrama Utama - Kamar {$nomorKamar}",
                ]
            );

            for ($r = 1; $r <= 6; $r++) {
                Ranjang::firstOrCreate(
                    [
                        'kamar_id' => $kamar->id,
                        'nomor_ranjang' => $r,
                    ],
                    [
                        'status' => 'tersedia',
                    ]
                );
            }
        }
    }
}
