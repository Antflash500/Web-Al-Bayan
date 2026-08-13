# Fix: Deploy Laravel ke Hostinger — "proc_open is not available"

## Konteks

Repo di-deploy ke Hostinger via **Deploy from Git** (auto-clone dari
`https://github.com/Antflash500/Web-Al-Bayan.git`, branch `main`), lalu
Hostinger otomatis menjalankan:

```
composer install --prefer-dist --quiet --no-interaction
```

Hasilnya gagal (commit `fix 1` dan `fix 2` — error sama):

```
ERROR: install: In Process.php line 147:
The Process class relies on proc_open, which is not available on your PHP installation.
```

## Akar Masalah

Hostinger menonaktifkan fungsi `proc_open` lewat **Disable functions** di
konfigurasi PHP. Composer memakai Symfony `Process` (butuh `proc_open`)
hanya **untuk menjalankan script composer**. Script yang menjalankan
`php artisan package:discover` di `post-autoload-dump` itulah yang memicu
error ini — dan `proc_open` **tidak bisa diaktifkan** di paket shared
Hostinger (fungsi tertentu di-hard-disable).

Jadi fix-nya bukan di hPanel, melainkan **menghilangkan kebutuhan
`proc_open` dari `composer install`** (lihat di bawah).

## Solusi yang Diterapkan (repo)

1. **Hapus script composer yang dipanggil via Process** dari `composer.json`:
   - `post-autoload-dump` (yang memanggil `@php artisan package:discover`)
   - `post-update-cmd` (yang memanggil `@php artisan vendor:publish`)

   Tanpa script itu, `composer install` berjalan murni tanpa memanggil
   `proc_open` → auto-deploy Hostinger sukses.

2. **Commit `bootstrap/cache/packages.php`** yang sudah berisi manifest
   paket hasil `package:discover` (dibuat lokal, 10 paket). Laravel tetap
   mengenali seluruh service provider meski `discover` tidak jalan di server.
   `bootstrap/cache/.gitignore` sudah di-whitelist (`!packages.php`) sehingga
   file ini selalu ikut ter-commit.

   > Catatan: `ComposerScripts::postAutoloadDump` umumnya juga menghapus
   > `packages.php`. Karena script itu sudah dihapus, file yang dikomit
   > tetap aman dan dipakai Laravel.

3. `composer.lock` tetap kompatibel PHP 8.3 (platform di-pin di
   `composer.json`), terverifikasi: `composer validate` valid & install dry-run
   sukses untuk 91 paket.

## Kalau Menambah/Mengganti Dependency (langkah maintainer)

Karena `package:discover` tidak dijalankan otomatis di server, setelah
`composer require/update` di lokal, wajib jalankan lalu commit ulang manifest:

```bash
composer install
php artisan package:discover --ansi
git add bootstrap/cache/packages.php composer.json composer.lock
git commit -m "chore: update packages"
git push origin main
```

## Checklist Deploy Git

- [x] `composer.json`: script `post-autoload-dump` & `post-update-cmd` dihapus.
- [x] `bootstrap/cache/packages.php` ikut di-commit (`.gitignore` di-whitelist).
- [x] `composer validate` OK; install dry-run sukses (91 paket, PHP 8.3).
- [ ] Commit & push ke `main` di GitHub, lalu **Deploy** ulang dari hPanel.
- [ ] Buat/sesuaikan `.env` di `public_html` (kredensial DB Hostinger + `APP_KEY`).
- [ ] Jalankan migrasi: `php artisan migrate --force` (via SSH / Site tools).
- [ ] Pastikan storage link: `php artisan storage:link`; permission `storage/`
      & `bootstrap/cache/` writable.