<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Kasur;
use App\Models\Ranjang;
use App\Models\Rumah;
use Illuminate\Database\Seeder;

class AsramaSeeder extends Seeder
{
    public function run(): void
    {
        $rumah = Rumah::firstOrCreate(
            ['nama' => 'Rumah 01'],
            [
                'status' => 'aktif',
                'keterangan' => 'Asrama utama',
            ]
        );

        for ($i = 1; $i <= 5; $i++) {
            $nomorKamar = sprintf('%02d', $i);

            $kamar = Kamar::firstOrCreate(
                ['nomor_kamar' => $nomorKamar],
                [
                    'rumah_id' => $rumah->id,
                    'kapasitas' => 6,
                    'status' => 'tersedia',
                    'keterangan' => "Gedung Asrama Utama - Kamar {$nomorKamar}",
                ]
            );

            for ($r = 1; $r <= 6; $r++) {
                $ranjang = Ranjang::firstOrCreate(
                    [
                        'kamar_id' => $kamar->id,
                        'nomor_ranjang' => $r,
                    ],
                    [
                        'status' => 'tersedia',
                    ]
                );

                Kasur::firstOrCreate(
                    ['ranjang_id' => $ranjang->id, 'posisi' => 'atas'],
                    ['status' => 'tersedia']
                );

                Kasur::firstOrCreate(
                    ['ranjang_id' => $ranjang->id, 'posisi' => 'bawah'],
                    ['status' => 'tersedia']
                );
            }
        }
    }
}
