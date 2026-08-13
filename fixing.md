# Fix: Deploy Laravel ke Hostinger — "proc_open is not available"

## Konteks

Repo di-deploy ke Hostinger via **Deploy from Git** (auto-clone dari
`https://github.com/Antflash500/Web-Al-Bayan.git`, branch `main`), lalu
Hostinger otomatis menjalankan:

```
composer install --prefer-dist --quiet --no-interaction
```

Hasilnya gagal:

```
ERROR: install: In Process.php line 147:
The Process class relies on proc_open, which is not available on your PHP installation.
```

## Akar Masalah

Hostinger menonaktifkan fungsi `proc_open` (bersama `exec`, `shell_exec`,
`passthru`) lewat **Disable functions** pada konfigurasi PHP. Composer
membutuhkan `proc_open` untuk menjalankan script post-install
(`post-autoload-dump` → `php artisan package:discover`).

Ini **bukan** masalah `composer.lock` — lock file sudah kompatibel dengan
PHP 8.3 (lihat catatan di bawah).

## Solusi Utama (paling disarankan)

1. Login ke **hPanel** Hostinger.
2. Buka **Advanced → PHP Configuration**.
3. Pastikan versi PHP = **8.3**.
4. Cari kolom **Disable functions**.
5. **Hapus `proc_open`** dari daftar (jangan hapus fungsi lain).
6. Klik **Save**, lalu **Redeploy** proyek dari hPanel.

Setelah itu `composer install` berjalan normal.

> Karena deploy memakai Git, pastikan perubahan ini juga di-commit ke
> `Antflash500/Web-Al-Bayan` supaya Hostinger mengambil versi termutakhir
> (misal tombol **Deploy** di hPanel menarik commit terbaru).

## Solusi Alternatif (jika tidak bisa ubah Disable functions)

### Opsi A — Deploy manual via SSH

Hostinger menyediakan akses SSH (aktifkan di hPanel → Advanced → SSH Access).
Lalu:

```bash
cd ~/domains/albayaneducation.com/public_html

# instal dependensi tanpa menjalankan script (tidak butuh proc_open)
composer install --no-dev --no-scripts --optimize-autoloader

# jalankan discover + cache manual
php artisan package:discover --ansi
php artisan optimize --ansi
```

### Opsi B — Upload manual via FTP/File Manager

1. Jalankan `composer install --no-dev` di komputer lokal (sudah kompatibel dengan PHP 8.3).
2. Upload seluruh folder project ke `public_html` via FTP/File Manager
   (termasuk folder `vendor/` hasil install lokal).
3. Sesuaikan `.env` dan permission `storage/` + `bootstrap/cache/`.

## Catatan Project Ini (sudah dikerjakan)

- `composer.json` sudah mem-pin `config.platform.php = 8.3.0`, sehingga
  `composer.lock` hanya berisi paket yang kompatibel dengan PHP 8.3 Hostinger.
  (Sebelumnya lock dikunci dengan PHP 8.5 → symfony butuh PHP ≥ 8.4 → error
  "lock file does not contain a compatible set of packages".)
- Remote repo sudah benar: `origin = https://github.com/Antflash500/Web-Al-Bayan`.

## Checklist Deploy Git

- [ ] Ahli: commit & push semua perubahan ke `main` di GitHub.
- [ ] hPanel: PHP 8.3, hapus `proc_open` dari Disable functions.
- [ ] hPanel: Deploy from Git → Deploy ke `public_html`.
- [ ] Buat/sesuaikan `.env` di `public_html` (kredensial DB Hostinger + `APP_KEY`).
- [ ] Jalankan migrasi: `php artisan migrate --force` (via SSH / Site tools).
- [ ] Pastikan storage link: `php artisan storage:link` dan permission `storage/` & `bootstrap/cache/` writable.