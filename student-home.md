# student-home.md

# Student Home Blueprint
## Portal Belajar Siswa Al Bayan

Versi: 1.0

Status: Development Blueprint

Target:
Halaman `/home` merupakan halaman pertama yang dilihat siswa setelah berhasil login. Halaman ini bukan Dashboard Admin, bukan halaman statistik, dan bukan halaman penuh widget. Halaman ini adalah pusat aktivitas belajar yang sederhana, modern, cepat, dan fokus pada pembelajaran.

---

# Filosofi

Website ini bukan ERP.

Website ini bukan CMS.

Website ini bukan Dashboard Monitoring.

Website ini adalah Portal Belajar.

Artinya, seluruh desain harus membantu siswa menjawab satu pertanyaan:

> "Hari ini saya belajar apa?"

Jangan memenuhi halaman dengan statistik yang tidak penting.

Jangan memenuhi halaman dengan card kosong.

Jangan membuat tampilan seperti Admin Panel.

Semua elemen harus memiliki tujuan yang jelas.

---

# Referensi UX

Gunakan referensi alur pengalaman pengguna dari:

https://home.hsi.id/

Sebagai inspirasi:

- alur pengguna
- kesederhanaan
- struktur halaman
- pengalaman belajar

JANGAN MENYALIN:

- warna
- icon
- ilustrasi
- logo
- asset
- layout identik
- identitas visual

Bangun identitas visual Al Bayan sendiri.

---

# Tujuan Halaman

Halaman /home bertujuan untuk:

? Menampilkan program yang sedang dipelajari

? Memudahkan siswa melanjutkan pembelajaran

? Menampilkan progress belajar

? Memberikan pengumuman terbaru

? Menampilkan materi terbaru

? Menampilkan video terbaru

? Memberikan akses cepat ke profil

Bukan untuk:

? Grafik

? Statistik tidak penting

? Widget kosong

? Dashboard perusahaan

? Dashboard admin

---

# Routing

Landing

/

?

Login

/login

?

Register

/register

?

Home

/home

?

Program

/program

?

Materi

/materi

?

Video

/video

?

Quiz

/quiz

?

Sertifikat

/sertifikat

?

Profil

/profil

---

# Middleware

Guest

?

Login

?

Auth Middleware

?

Role = siswa

?

Masuk /home

Jika Role = admin

?

Redirect

/admin

---

# Struktur Halaman

Navbar

?

Hero

?

Continue Learning

?

Program Saya

?

Materi Terbaru

?

Video Terbaru

?

Pengumuman

?

Progress Belajar

?

Footer

Semua section memiliki tujuan.

Tidak boleh ada section hanya untuk mengisi ruang kosong.

---

# Navbar

Navbar harus sederhana.

Isi:

Logo Al Bayan

Beranda

Program

Materi

Video

Sertifikat

Profil

Avatar User

Logout

Navbar selalu berada di atas.

Gunakan efek blur ringan saat halaman di-scroll.

Jangan menggunakan shadow tebal.

Gunakan tinggi sekitar 72px.

---

# Hero Section

Hero bukan tempat promosi.

Hero bukan banner besar.

Hero digunakan untuk menyambut siswa.

Contoh isi:

Selamat Datang, Fari

Senang melihat Anda kembali.

Lanjutkan perjalanan belajar Bahasa Arab hari ini.

Di bawahnya terdapat tombol utama.

[Lanjutkan Belajar]

Tombol kedua.

[Lihat Semua Program]

Hero menggunakan background sederhana.

Pilihan background:

- gradient lembut
- pattern islami transparan
- foto kegiatan dengan opacity rendah
- bentuk geometris sederhana

Jangan menggunakan:

- slider
- carousel
- animasi berlebihan
- video autoplay

---

# Greeting

Greeting berubah otomatis.

Pagi

Selamat Pagi

Siang

Selamat Siang

Sore

Selamat Sore

Malam

Selamat Malam

Nama siswa diambil dari PostgreSQL.

Contoh

Selamat Pagi,
Fari

---

# Continue Learning

Ini adalah section terpenting.

Harus berada tepat di bawah Hero.

Menampilkan:

Thumbnail Program

Nama Program

Progress

Lesson terakhir

Tombol

"Lanjutkan Belajar"

Contoh

Bahasa Arab Dasar

Progress

67%

Terakhir

Bab 5

Button

Lanjutkan

Data berasal dari PostgreSQL.

---

# Logic Continue Learning

Saat siswa keluar dari video

?

Progress tersimpan

?

Database diperbarui

?

Ketika login kembali

?

Section Continue Learning otomatis muncul

?

Button mengarah ke lesson terakhir

Tidak perlu mencari materi dari awal.

---

# Program Saya

Menampilkan seluruh program yang dimiliki siswa.

Contoh card.

Bahasa Arab Pemula

Nahwu Dasar

Sharaf Dasar

Muhadatsah

Setiap card memiliki:

Thumbnail

Nama

Jumlah Materi

Progress

Button

Masuk Program

Hover sederhana.

Tidak menggunakan animasi berlebihan.

---

# Card Program

Card harus bersih.

Isi:

Thumbnail

?

Nama Program

?

Deskripsi singkat

?

Progress

?

Jumlah Materi

?

Button

Masuk

Jangan menggunakan badge yang tidak diperlukan.

---

# Data PostgreSQL

Section Program mengambil data dari:

tabel_program

Relasi:

program

?

materi

?

video

?

quiz

?

progress_siswa

Semua data berasal dari database.

Tidak boleh hardcode.

---

# Progress Program

Progress dihitung otomatis.

Contoh.

20 Materi

Sudah selesai

10

Progress

50%

Formula:

(progress_selesai / total_materi) × 100

Progress disimpan setiap kali siswa:

- selesai video
- selesai materi
- selesai quiz

---

# Empty State

Jika siswa belum mengambil program.

Tampilkan ilustrasi sederhana.

Judul:

Belum Ada Program

Deskripsi:

Anda belum mengikuti program pembelajaran.

Button

Lihat Program

Jangan menampilkan halaman kosong.

---

# Search Program

Di atas daftar program terdapat pencarian.

Placeholder

Cari Program...

Pencarian realtime.

Tanpa reload halaman.

Filter berdasarkan:

Nama

Kategori

Level

Status

---

# Responsive

Desktop

4 Card

Tablet

2 Card

Mobile

1 Card

Semua card memiliki tinggi yang konsisten.

---

# Design Rules

Gunakan whitespace yang luas.

Gunakan tipografi yang jelas.

Heading menggunakan font:

Batangas-Bold

Paragraph menggunakan font regular project.

Jangan menggunakan badge hijau kecil di setiap section.

Jangan menggunakan card berlebihan.

Jangan menggunakan shadow tebal.

Jangan menggunakan border radius ekstrem.

Gunakan desain minimalis yang terasa dibuat oleh UI Designer profesional, bukan hasil AI Generator.

---

# Integrasi Database

Semua komponen pada halaman `/home` harus mengambil data secara dinamis dari PostgreSQL melalui API Laravel.

Data yang ditampilkan meliputi:

- nama siswa
- foto profil
- daftar program
- progres belajar
- materi terakhir yang diakses
- jumlah materi
- status penyelesaian

Tidak boleh ada data dummy atau hardcode pada versi produksi.

---

# Checklist Bagian 1

- [ ] Routing `/home` selesai
- [ ] Middleware siswa selesai
- [ ] Navbar selesai
- [ ] Hero selesai
- [ ] Greeting dinamis
- [ ] Continue Learning
- [ ] Program Saya
- [ ] Progress Program
- [ ] Search Program
- [ ] Empty State
- [ ] Responsive
- [ ] Integrasi PostgreSQL
- [ ] Menggunakan font Batangas-Bold untuk seluruh heading
- [ ] Tidak menggunakan pola desain AI Slop
---

# Materi Terbaru

Section ini berada tepat di bawah "Program Saya".

Tujuannya adalah membantu siswa menemukan materi terbaru tanpa harus membuka setiap program satu per satu.

Section ini mengambil data berdasarkan:

- tanggal publish terbaru
- materi yang belum dipelajari
- materi yang terakhir di-update

Bukan berdasarkan urutan ID database.

---

# Struktur Materi Terbaru

Heading

Materi Terbaru

Deskripsi

Lanjutkan pembelajaran Anda dengan materi terbaru dari setiap program.

Grid

Desktop

3 Card

Tablet

2 Card

Mobile

1 Card

---

# Card Materi

Setiap card berisi:

Thumbnail

?

Nama Program

?

Judul Materi

?

Deskripsi Singkat

?

Durasi

?

Jenis Materi

?

Button

Pelajari

---

# Jenis Materi

Gunakan icon kecil.

Video

PDF

Audio

Quiz

Artikel

Jangan menggunakan badge besar.

---

# Data Database

Mengambil dari

tabel_materi

Relasi

program

?

materi

?

video

?

pdf

?

progress

---

# Logic

Ketika Admin membuat materi baru

?

Materi publish

?

Masuk PostgreSQL

?

Muncul otomatis pada section

Materi Terbaru

Tidak perlu refresh cache manual.

---

# Halaman Materi

Route

/materi/{slug}

Halaman ini merupakan halaman pembelajaran.

Bukan halaman promosi.

---

# Struktur Halaman Materi

Cover

?

Judul

?

Deskripsi

?

Informasi Tutor

?

Daftar Lesson

?

Isi Lesson

?

Navigasi

?

Progress

---

# Cover

Cover menggunakan thumbnail program.

Lebar penuh.

Tinggi sekitar

280-360px

Gunakan overlay gelap tipis.

---

# Informasi

Judul

Nama Program

Nama Tutor

Kategori

Level

Jumlah Lesson

Durasi Total

Progress

---

# Sidebar Lesson

Sebelah kiri (desktop)

Daftar Lesson

Bab 1

Bab 2

Bab 3

Bab 4

Bab 5

Lesson aktif memiliki highlight.

Mobile menggunakan Drawer.

---

# Lesson

Setiap lesson dapat memiliki

Video

PDF

Audio

Artikel

Quiz

Tidak semua lesson harus mempunyai seluruh jenis konten.

---

# Video

Video merupakan prioritas utama.

Gunakan player modern.

Simpan progress otomatis.

Progress tersimpan setiap beberapa detik.

Contoh

Setiap

10 detik

?

Update progress.

Jika internet terputus

?

Progress terakhir tetap tersimpan.

---

# Logic Video

User membuka video.

?

Video diputar.

?

Progress mulai dihitung.

?

Setiap interval

?

Database diperbarui.

?

Video selesai.

?

Status Lesson

Selesai.

?

Progress Program bertambah.

---

# PDF

Jika lesson memiliki PDF

Tampilkan

Nama File

Ukuran

Jumlah Halaman

Button

Baca

Button

Download

---

# Audio

Jika tersedia audio

Gunakan player sederhana.

Memiliki

Play

Pause

Seek

Duration

Playback Speed

---

# Artikel

Artikel menggunakan typography nyaman dibaca.

Lebar konten sekitar

760px

Gunakan line-height yang lega.

Hindari teks terlalu lebar.

---

# Quiz

Jika lesson memiliki Quiz

Tampilkan tombol

Mulai Quiz

Quiz hanya dapat dibuka jika:

Video selesai

atau

PDF selesai dibaca

(opsional sesuai pengaturan Admin).

---

# Progress Belajar

Section ini berada di bawah lesson.

Menampilkan

Progress keseluruhan.

Contoh

????????????????

62%

Selesai

12 dari 20 Lesson

---

# Database Progress

Mengambil data dari

tabel_progress

Kolom

id

pengguna_id

materi_id

persentase

status

terakhir_diakses

created_at

updated_at

---

# Status Lesson

Belum Dimulai

Sedang Dipelajari

Selesai

Status berubah otomatis.

Tidak diubah manual.

---

# Tombol Navigasi

Previous Lesson

Next Lesson

Jika lesson terakhir

?

Button berubah menjadi

Selesaikan Program

---

# Continue Watching

Jika video belum selesai

Saat siswa kembali login

?

Section

Continue Learning

langsung membuka detik terakhir video.

Tidak mulai dari awal.

---

# Pengumuman

Section ini berada setelah Materi Terbaru.

Digunakan untuk informasi penting.

Contoh

Jadwal Libur

Program Baru

Maintenance

Informasi Sertifikat

Pengumuman Admin

---

# Struktur Pengumuman

Card sederhana.

Judul

Tanggal

Isi Singkat

Button

Baca Selengkapnya

---

# Database

Mengambil dari

tabel_pengumuman

Kolom

id

judul

isi

gambar

tanggal_publish

status

created_at

updated_at

---

# Notifikasi

Icon lonceng berada di Navbar.

Menampilkan

Materi Baru

Quiz Baru

Program Baru

Pengumuman

Sertifikat

Notifikasi belum dibaca memiliki indikator.

---

# Database Notifikasi

tabel_notifikasi

id

pengguna_id

judul

pesan

dibaca

created_at

---

# Footer

Footer sederhana.

Logo

Tentang

Program

Kontak

Email

WhatsApp

Hak Cipta

Tidak menggunakan banyak link.

---

# Responsive

Desktop

Sidebar tampil.

Tablet

Sidebar menjadi collapse.

Mobile

Sidebar menjadi Drawer.

Semua video responsif.

Semua card memiliki tinggi yang sama.

---

# Performance Rules

Gunakan Lazy Loading.

Gunakan Image Optimization.

Gunakan Skeleton Loading.

Gunakan Pagination jika data banyak.

Gunakan Infinite Scroll hanya jika memang diperlukan.

Hindari render ulang yang tidak perlu.

---

# UX Rules

Seluruh halaman harus fokus pada pembelajaran.

Setiap klik maksimal membutuhkan dua langkah menuju materi.

Siswa tidak boleh kebingungan mencari lesson terakhir.

Semua tombol harus memiliki fungsi yang jelas.

Tidak boleh ada komponen yang hanya menjadi dekorasi.

---

# Checklist Bagian 2

- [ ] Materi Terbaru
- [ ] Card Materi
- [ ] Halaman Materi
- [ ] Sidebar Lesson
- [ ] Video Player
- [ ] PDF Viewer
- [ ] Audio Player
- [ ] Artikel
- [ ] Quiz
- [ ] Progress Belajar
- [ ] Continue Watching
- [ ] Pengumuman
- [ ] Notifikasi
- [ ] Footer
- [ ] Responsive
- [ ] Integrasi PostgreSQL
- [ ] Optimasi Performa
- [ ] Tidak menggunakan pola desain AI Slop
---

# Profil Siswa

Halaman Profil digunakan untuk mengelola seluruh informasi akun siswa.

Route

```
/profil
```

Halaman ini hanya dapat diakses oleh siswa yang telah login.

Admin memiliki halaman profil yang berbeda.

---

# Struktur Halaman Profil

Foto Profil

?

Informasi Akun

?

Informasi Pribadi

?

Keamanan

?

Riwayat Login

?

Pengaturan

?

Logout

---

# Foto Profil

Foto profil berada di bagian atas.

Ukuran

160 x 160 px

Bentuk

Lingkaran

Fitur

- Upload Foto
- Ganti Foto
- Hapus Foto

Format

- JPG
- JPEG
- PNG
- WEBP

Ukuran maksimal

2 MB

---

# Informasi Akun

Menampilkan

Nama Lengkap

Email

Role

Tanggal Bergabung

Status Akun

Program Yang Diikuti

Contoh

Nama

Ahmad Fauzan

Email

ahmad@email.com

Role

Siswa

Status

Aktif

---

# Informasi Pribadi

Data berasal dari PostgreSQL.

Tabel

biodata_siswa

Field

Nama Lengkap

Nama Panggilan

Jenis Kelamin

Tempat Lahir

Tanggal Lahir

Nomor HP

Alamat

Kota

Provinsi

Foto

Semua data dapat diedit kecuali email (opsional sesuai kebijakan admin).

---

# Edit Profil

Klik

Edit Profil

?

Modal atau halaman baru

?

Validasi

?

Simpan

?

Update PostgreSQL

?

Toast

Profil berhasil diperbarui.

---

# Keamanan

Section ini berisi

Ganti Password

Perangkat Login

Riwayat Login

Logout Semua Perangkat

Tidak menampilkan password.

Password tidak pernah ditampilkan kepada siapa pun.

---

# Ganti Password

Field

Password Lama

Password Baru

Konfirmasi Password Baru

Flow

Validasi

?

Password Lama benar

?

Hash Password Baru

?

Update Database

?

Logout Semua Session (opsional)

?

Sukses

---

# Validasi Password

Minimal

8 karakter

Mengandung

Huruf Besar

Huruf Kecil

Angka

Disarankan simbol.

---

# Riwayat Login

Menampilkan

Tanggal

Jam

IP Address

Browser

Sistem Operasi

Status

Contoh

06 Agustus 2026

Chrome

Windows 11

Berhasil

---

# Database

Tabel

riwayat_login

Kolom

id

pengguna_id

ip_address

browser

sistem_operasi

login_pada

logout_pada

status

---

# Pengaturan Akun

Pengaturan sederhana.

Bahasa

Indonesia

Theme

Light

Dark

System

Notifikasi Email

Aktif

Nonaktif

---

# Sertifikat

Route

```
/sertifikat
```

Halaman ini menampilkan seluruh sertifikat yang dimiliki siswa.

---

# Struktur Sertifikat

Thumbnail

?

Nama Program

?

Tanggal Terbit

?

Nomor Sertifikat

?

Download PDF

---

# Logic Sertifikat

Jika

Progress Program

100%

dan

Quiz Lulus

?

Generate Sertifikat

?

Simpan PostgreSQL

?

Simpan PDF

?

Muncul pada halaman Sertifikat

?

Dapat diunduh.

---

# Database Sertifikat

tabel_sertifikat

Kolom

id

pengguna_id

program_id

nomor_sertifikat

tanggal_terbit

file_pdf

created_at

---

# Riwayat Belajar

Route

```
/riwayat
```

Digunakan untuk melihat aktivitas belajar.

---

# Isi Riwayat

Nama Program

?

Nama Materi

?

Tanggal

?

Durasi

?

Status

?

Progress

---

# Contoh

Bahasa Arab Dasar

Bab 5

20 Menit

100%

06 Agustus 2026

---

# Database

tabel_riwayat_belajar

id

pengguna_id

materi_id

durasi

persentase

tanggal

created_at

---

# Bookmark

Siswa dapat menyimpan materi.

Klik

? Simpan

?

Masuk Bookmark

Route

```
/bookmark
```

---

# Database Bookmark

tabel_bookmark

id

pengguna_id

materi_id

created_at

---

# Pencarian Global

Search berada pada Navbar.

Mencari

Program

Materi

Video

PDF

Artikel

Quiz

Pengumuman

Autocomplete aktif.

Realtime.

---

# Database Search

Menggunakan PostgreSQL Full Text Search.

Tidak melakukan query LIKE berulang.

Gunakan indexing agar pencarian tetap cepat.

---

# Notification Center

Klik icon lonceng.

?

Drawer terbuka.

Isi

Materi Baru

Quiz Baru

Program Baru

Pengumuman

Sertifikat

Semua notifikasi dapat ditandai telah dibaca.

---

# Empty State

Jika belum ada data.

Jangan kosong.

Contoh

Belum Ada Sertifikat

Anda belum menyelesaikan program pembelajaran.

Button

Lanjut Belajar

---

# Loading State

Gunakan Skeleton Loading.

Jangan Spinner di seluruh halaman.

Skeleton digunakan untuk

Card

Program

Video

Materi

Profil

Sertifikat

---

# Error State

Jika API gagal.

Tampilkan

Icon

Judul

Terjadi Kesalahan

Deskripsi

Data tidak dapat dimuat.

Button

Coba Lagi

---

# Offline State

Jika koneksi internet terputus.

Tampilkan

Anda sedang offline.

Beberapa fitur mungkin tidak tersedia.

Progress yang sudah tersimpan tidak akan hilang.

---

# Accessibility

Semua tombol memiliki

aria-label

Semua gambar memiliki

alt

Kontras warna minimal WCAG AA.

Keyboard Navigation didukung.

Focus State jelas.

---

# Integrasi PostgreSQL

Halaman Profil terhubung dengan

tabel_pengguna

?

biodata_siswa

?

riwayat_login

?

sertifikat

?

riwayat_belajar

?

bookmark

Semua perubahan dilakukan melalui API Laravel.

Tidak boleh ada manipulasi database langsung dari Frontend.

---

# Struktur Folder React

```
src/

pages/
    home/
    program/
    materi/
    profil/
    sertifikat/
    bookmark/

components/
    profile/
    course/
    progress/
    certificate/
    notification/

hooks/

services/

types/

layouts/

assets/
```

---

# UI Rules

Heading menggunakan

Batangas-Bold

Paragraph menggunakan

Font Regular Project

Gunakan whitespace yang lega.

Border tipis.

Shadow lembut.

Radius maksimal

20px

Gunakan warna hijau hanya sebagai aksen.

Hindari efek glassmorphism berlebihan.

Hindari badge kecil khas AI Generator.

---

# Anti AI Slop Rules

JANGAN membuat dashboard penuh angka statistik.

JANGAN membuat card kosong hanya untuk dekorasi.

JANGAN menggunakan badge kecil di setiap section.

JANGAN memenuhi halaman dengan ikon tanpa fungsi.

JANGAN membuat layout simetris yang identik di setiap section.

JANGAN menggunakan gradient mencolok.

JANGAN menggunakan animasi berlebihan.

Setiap komponen harus memiliki fungsi nyata dalam proses belajar.

---

# Checklist Bagian 3

- [ ] Profil Siswa
- [ ] Edit Profil
- [ ] Upload Foto
- [ ] Ganti Password
- [ ] Riwayat Login
- [ ] Pengaturan Akun
- [ ] Sertifikat
- [ ] Riwayat Belajar
- [ ] Bookmark
- [ ] Global Search
- [ ] Notification Center
- [ ] Empty State
- [ ] Loading State
- [ ] Error State
- [ ] Offline State
- [ ] Accessibility
- [ ] Integrasi PostgreSQL
- [ ] Struktur Folder React
- [ ] UI Rules
- [ ] Anti AI Slop Rules
---

# BAGIAN 4
# FINAL IMPLEMENTATION, DESIGN SYSTEM, PERFORMANCE, SECURITY & ROADMAP

Dokumen ini merupakan penutup dari blueprint Student Home.

Seluruh implementasi Frontend harus mengikuti aturan pada dokumen ini.

Tujuannya agar hasil akhir terlihat profesional, konsisten, modern, mudah digunakan, ringan, scalable, dan tidak memiliki ciri khas AI Generated Website.

---

# Tujuan Akhir

Website Student Home harus memberikan kesan:

? Profesional

? Modern

? Premium

? Cepat

? Bersih

? Mudah digunakan

? Fokus belajar

Bukan

? Dashboard Admin

? Landing Page Template

? Dashboard Crypto

? Dashboard Monitoring

? AI Generated UI

---

# Design Philosophy

Prinsip utama website:

Belajar lebih penting daripada dekorasi.

Semua komponen harus membantu siswa belajar.

Jika sebuah komponen tidak membantu proses belajar,

hapus komponen tersebut.

---

# Visual Hierarchy

Urutan perhatian pengguna

1

Greeting

?

2

Continue Learning

?

3

Program Saya

?

4

Materi Terbaru

?

5

Pengumuman

?

6

Progress

?

7

Footer

Jangan membuat semua section memiliki ukuran visual yang sama.

---

# Typography

Heading Besar

Gunakan

Batangas-Bold

Untuk

Hero

Section Title

Judul Program

Judul Materi

CTA

Statistik Progress

Sub Heading

Gunakan Font Regular SemiBold.

Paragraph

Gunakan Font Regular.

Caption

Gunakan Font Regular ukuran kecil.

Jangan menggunakan Batangas untuk isi paragraf.

---

# Color Palette

Primary

Hijau Al Bayan

Secondary

Hijau Muda

Background

Putih

Surface

Abu Sangat Terang

Text

Hitam

Secondary Text

Abu Gelap

Danger

Merah

Success

Hijau

Warning

Oranye

Gunakan warna secukupnya.

Jangan memenuhi halaman dengan warna hijau.

---

# Icon

Gunakan satu library icon.

Contoh

Lucide

atau

Heroicons

Jangan mencampur berbagai style icon.

Semua icon

Outline

Ukuran konsisten.

Stroke konsisten.

---

# Radius

Button

14px

Card

18px

Input

14px

Modal

20px

Jangan menggunakan radius 40px.

---

# Shadow

Gunakan shadow lembut.

Tidak menggunakan shadow besar.

Shadow hanya digunakan untuk membantu depth.

---

# Animation

Durasi

200ms

250ms

300ms

Gunakan

Fade

Scale kecil

Slide ringan

Hover

Tidak menggunakan

Bounce

Flip

Rotate

Zoom ekstrem

Animation Loop

---

# Hover

Button

Background berubah.

Card

Sedikit naik.

Shadow bertambah tipis.

Image

Scale

1.02

Tidak lebih.

---

# Loading

Gunakan Skeleton.

Bukan Spinner.

Skeleton digunakan pada

Program

Materi

Video

Profil

Pengumuman

Progress

---

# Empty State

Setiap halaman harus mempunyai Empty State.

Contoh

Belum Ada Materi

Belum Ada Program

Belum Ada Sertifikat

Belum Ada Pengumuman

Belum Ada Bookmark

Setiap Empty State mempunyai CTA.

---

# Error Handling

Jika API gagal.

Tampilkan

Icon

Judul

Deskripsi

Button

Coba Lagi

Jangan hanya menampilkan

500 Error

---

# Toast Notification

Gunakan Toast.

Posisi

Kanan Atas.

Durasi

3 Detik.

Jenis

Success

Warning

Info

Error

---

# Modal

Gunakan Modal hanya jika diperlukan.

Jangan semua aksi menggunakan modal.

---

# Breadcrumb

Gunakan pada halaman

Program

Materi

Profil

Sertifikat

Contoh

Home

>

Program

>

Bahasa Arab Dasar

>

Bab 3

---

# Pagination

Gunakan Pagination.

Jika data

>12

Jangan Infinite Scroll untuk semua halaman.

---

# Search

Search harus cepat.

Realtime.

Debounce

300ms

Gunakan PostgreSQL Index.

---

# Optimasi React

Gunakan

React Query / TanStack Query

Untuk

Caching

Refetch

Mutation

Optimistic Update

---

# API

Semua komunikasi menggunakan REST API Laravel.

Frontend tidak boleh mengakses PostgreSQL secara langsung.

Flow

React

?

API Laravel

?

Service

?

Repository

?

PostgreSQL

---

# Authentication

Gunakan

Laravel Sanctum

atau

JWT

Session dikelola secara aman.

---

# Authorization

Gunakan Middleware.

Role

Admin

?

/admin

Role

Siswa

?

/home

Tidak boleh terjadi akses silang.

---

# Keamanan

Password

Argon2id

CSRF Protection

Rate Limit

XSS Protection

SQL Injection Protection

Validation

HTTPS

Secure Cookie

HttpOnly Cookie

SameSite Cookie

Audit Log

Semua wajib aktif.

---

# Upload File

Validasi

Ukuran

Ekstensi

Mime Type

Rename otomatis.

Simpan pada folder yang terstruktur.

---

# Database

Semua perubahan menggunakan Transaction.

Jika gagal.

Rollback.

Tidak boleh terdapat data setengah tersimpan.

---

# Backup

Backup Database

Harian

Backup File

Mingguan

Backup Storage

Bulanan

---

# Logging

Catat

Login

Logout

Update Profil

Download Sertifikat

Upload Materi

Quiz

Perubahan Password

Semua masuk Audit Log.

---

# Monitoring

Admin dapat melihat

Jumlah Siswa

Program Aktif

Materi

Video

Quiz

Namun siswa tidak melihat statistik tersebut.

---

# Responsive

Desktop

1440+

Laptop

1280

Tablet

768

Mobile

480

Small Mobile

360

Semua halaman harus nyaman digunakan.

---

# SEO

Walaupun halaman /home memerlukan login,

tetap gunakan

Title

Meta

OpenGraph

Favicon

Manifest

untuk halaman publik.

---

# Accessibility

Keyboard Navigation

Focus State

Alt Image

Aria Label

Kontras WCAG

Semua wajib.

---

# Code Quality

Gunakan

ESLint

Prettier

TypeScript Strict Mode

Reusable Components

Custom Hooks

Folder terstruktur.

Tidak membuat file dengan ribuan baris.

---

# Struktur Folder

src/

components/

features/

pages/

layouts/

hooks/

services/

api/

types/

utils/

assets/

fonts/

styles/

contexts/

providers/

routes/

---

# Target Performance

First Load

< 2 Detik

LCP

< 2.5 Detik

CLS

< 0.1

FID

< 100 ms

Lighthouse

Performance

95+

Accessibility

100

Best Practice

100

SEO

100

---

# Anti AI Slop (WAJIB)

JANGAN membuat:

- Badge hijau kecil di setiap section.
- Card tanpa fungsi.
- Hero dengan logo mengambang.
- Shadow terlalu tebal.
- Border radius berlebihan.
- Statistik palsu.
- Grafik yang tidak berguna.
- Ikon hanya sebagai dekorasi.
- Layout yang berulang di setiap section.
- Efek glassmorphism berlebihan.
- Gradien mencolok.
- Komponen yang tidak memiliki tujuan.

Fokus pada pengalaman belajar, bukan memperbanyak ornamen.

---

# Future Roadmap

Versi 1.0

- Login
- Register
- Home
- Program
- Materi
- Quiz
- Sertifikat

Versi 1.5

- Bookmark
- Catatan Pribadi
- Download Materi
- Riwayat Belajar

Versi 2.0

- Live Class
- Diskusi
- Forum
- Tanya Ustadz
- Kalender Akademik
- Notifikasi WhatsApp
- Email Otomatis

Versi 3.0

- Mobile App Android
- Mobile App iOS
- Progressive Web App
- AI Assistant Pembelajaran
- Transkripsi Video
- Pencarian Materi Berbasis AI

---

# Checklist Final

## Routing

- [ ] `/`
- [ ] `/login`
- [ ] `/register`
- [ ] `/home`
- [ ] `/program`
- [ ] `/materi`
- [ ] `/quiz`
- [ ] `/sertifikat`
- [ ] `/profil`

## PostgreSQL

- [ ] Seluruh data menggunakan PostgreSQL
- [ ] Relasi database selesai
- [ ] Migration selesai
- [ ] Seeder selesai
- [ ] Index database selesai

## Frontend

- [ ] Responsive
- [ ] Dark Mode (opsional)
- [ ] Skeleton Loading
- [ ] Empty State
- [ ] Error State
- [ ] Toast Notification
- [ ] Search
- [ ] Pagination

## Backend

- [ ] REST API
- [ ] Authentication
- [ ] Authorization
- [ ] Validation
- [ ] Upload File
- [ ] Audit Log
- [ ] Backup

## Security

- [ ] Argon2id Password Hashing
- [ ] CSRF Protection
- [ ] XSS Protection
- [ ] SQL Injection Protection
- [ ] Rate Limiter
- [ ] Secure Session
- [ ] HTTPS

## Quality Assurance

- [ ] Tidak ada AI Slop
- [ ] Tidak ada hardcode data
- [ ] Tidak ada komponen tanpa fungsi
- [ ] Konsisten menggunakan font Batangas-Bold pada Heading
- [ ] Konsisten menggunakan font Regular pada isi
- [ ] Semua data berasal dari PostgreSQL
- [ ] Semua API telah diuji
- [ ] Lighthouse Performance minimal 95
- [ ] UX sederhana, cepat, dan fokus pada pembelajaran

---

# Penutup

Student Home bukan sekadar halaman setelah login, melainkan pusat aktivitas belajar siswa. Setiap keputusan desain, arsitektur, dan implementasi harus mendukung tujuan utama tersebut: memudahkan siswa melanjutkan pembelajaran tanpa distraksi.

Prioritaskan kecepatan, kemudahan navigasi, konsistensi visual, keamanan, dan integrasi penuh dengan PostgreSQL. Hindari pola desain yang terasa generik atau khas AI generator, dan bangun antarmuka yang memberikan kesan dibuat secara matang oleh tim desain dan pengembang profesional.