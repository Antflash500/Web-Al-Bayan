# Fix: "The Process class relies on proc_open, which is not available"

## Gejala

Saat menjalankan `composer install` di server Hostinger muncul error:

```
ERROR: install: In Process.php line 147:
The Process class relies on proc_open, which is not available on your PHP installation.
```

## Penyebab

Hostinger menonaktifkan fungsi `proc_open` (dan sering juga `exec`, `shell_exec`,
`passthru`) lewat daftar `disable_functions` pada konfigurasi PHP. Composer
membutuhkan `proc_open` untuk menjalankan script (misal `@php artisan package:discover`).

## Solusi Utama (disarankan) — Aktifkan proc_open di hPanel

1. Login ke hPanel Hostinger.
2. Buka **Advanced → PHP Configuration**.
3. Pilih versi PHP (harus **8.3**).
4. Cari kolom **Disable functions**.
5. **Hapus `proc_open`** dari daftar tersebut (hilangkan saja, biarkan fungsi lain).
6. Klik **Save**.

Setelah itu jalankan ulang dari terminal/SSH:

```bash
composer install --no-dev --optimize-autoloader
```

## Solusi Alternatif — Lewati script composer

Jika tidak bisa mengubah konfigurasi PHP, instal tanpa menjalankan script,
lalu paksa artisan untuk menemukan paket:

```bash
composer install --no-dev --no-scripts --optimize-autoloader
php artisan package:discover
php artisan optimize
```

> Catatan: `--no-scripts` mencegah `@php artisan package:discover` berjalan otomatis.
> Karena itu `package:discover` dijalankan manual setelahnya.

## Catatan Project Ini

- `composer.json` sudah mem-pin `config.platform.php` ke `8.3.0`, sehingga
  `composer.lock` hanya berisi paket yang kompatibel dengan PHP 8.3 Hostinger.
- Jangan upload `.env`. Buat `.env` baru di Hostinger (isi kredensial DB +
  `APP_KEY` hasil `php artisan key:generate`).
- Folder yang wajib upload: `app/`, `bootstrap/`, `config/`, `database/`,
  `public/`, `resources/`, `routes/`, `vendor/` (hasil `composer install` di
  server), `composer.json`, `composer.lock`, `artisan`.
- Setelah deploy, pastikan permission `storage/` dan `bootstrap/cache/` bisa
  ditulis (biasanya otomatis di Hostinger).
