# database-roadmap.md

# BAGIAN 1
# DATABASE ROADMAP
## PostgreSQL Blueprint
### Yayasan Bahasa Arab Al Bayan

Versi

1.0

Status

Blueprint Development

Database

PostgreSQL

Framework

Laravel 13+

---

# Tujuan Database

Database bukan hanya tempat menyimpan data.

Database merupakan pusat seluruh aktivitas website.

Seluruh informasi harus berasal dari PostgreSQL.

Tidak boleh ada data hardcode pada Frontend.

Database harus mampu menangani:

- Login
- Register
- Siswa
- Admin
- Program
- Materi
- Quiz
- Sertifikat
- Progress
- Notifikasi
- Riwayat Login
- Pengumuman
- Export
- Import

Database harus siap digunakan hingga ribuan siswa tanpa perlu mengubah struktur besar.

---

# Filosofi Database

Gunakan prinsip berikut.

Database harus:

? Mudah dibaca

? Mudah dipelihara

? Mudah dikembangkan

? Cepat

? Aman

? Menggunakan relasi yang jelas

Jangan membuat satu tabel berisi puluhan kolom yang tidak berhubungan.

Pisahkan data berdasarkan tanggung jawabnya.

---

# Bahasa Database

Seluruh nama tabel menggunakan Bahasa Indonesia.

Contoh

pengguna

biodata_siswa

program

materi

video

sertifikat

progress_belajar

riwayat_login

pengumuman

notifikasi

bookmark

Semua mudah dipahami Admin Indonesia.

---

# Database Utama

Gunakan PostgreSQL.

Encoding

UTF-8

Timezone

Asia/Jakarta

Semua tabel menggunakan

created_at

updated_at

Soft Delete jika diperlukan.

---

# Struktur Besar Database

PostgreSQL

?

??? pengguna

??? biodata_siswa

??? admin

??? program

??? materi

??? video

??? pdf

??? quiz

??? progress

??? sertifikat

??? pengumuman

??? notifikasi

??? riwayat_login

??? bookmark

??? log_aktivitas

??? pengaturan

---

# ERD Sederhana

pengguna

?

biodata_siswa

?

program

?

materi

?

video

?

quiz

?

progress

?

sertifikat

Semua saling berelasi menggunakan Foreign Key.

---

# Tabel
## pengguna

Tabel ini digunakan hanya untuk autentikasi.

Jangan menyimpan biodata lengkap di sini.

Kolom

id

email

password

role

status

email_terverifikasi

terakhir_login

created_at

updated_at

---

# Penjelasan

id

Primary Key

Auto Increment

email

Email Login

Harus unik.

password

Menyimpan Hash Password.

Tidak pernah menyimpan password asli.

Gunakan

Argon2id

atau

Bcrypt.

role

Isi

admin

atau

siswa

status

Isi

aktif

nonaktif

ditangguhkan

email_terverifikasi

Boolean

true

false

terakhir_login

Datetime

Diupdate otomatis ketika login berhasil.

---

# Contoh Data

id

1

email

ahmad@email.com

password

$argon2id$...

role

siswa

status

aktif

---

# Tabel
## biodata_siswa

Semua informasi pribadi siswa berada di tabel ini.

Relasi

pengguna

?

biodata_siswa

Kolom

id

pengguna_id

nama_lengkap

nama_panggilan

jenis_kelamin

tempat_lahir

tanggal_lahir

nomor_hp

alamat

kota

provinsi

foto

created_at

updated_at

---

# Penjelasan

pengguna_id

Foreign Key

Mengarah ke

pengguna.id

nama_lengkap

Nama resmi siswa.

nama_panggilan

Opsional.

jenis_kelamin

Laki-laki

Perempuan

tempat_lahir

Contoh

Bandung

tanggal_lahir

Format

YYYY-MM-DD

nomor_hp

Nomor aktif.

alamat

Alamat lengkap.

kota

Kota tempat tinggal.

provinsi

Provinsi.

foto

Nama file foto profil.

---

# Contoh Data

Nama

Ahmad Fauzan

Jenis Kelamin

Laki-laki

Tanggal Lahir

2006-04-16

Nomor HP

081234567890

Kota

Bandung

---

# Tabel
## admin

Walaupun Admin juga login melalui tabel pengguna, data khusus admin dipisahkan.

Kolom

id

pengguna_id

nama_admin

jabatan

foto

created_at

updated_at

---

# Jabatan

Super Admin

Administrator

Operator

Semua hak akses akan menggunakan Role dan Permission Laravel.

---

# Alur Register

Landing Page

?

Klik Daftar

?

Isi Form

Nama Lengkap

?

Email

?

Password

?

Konfirmasi Password

?

Tanggal Lahir

?

Jenis Kelamin

?

Nomor HP

?

Klik Daftar

?

Validasi

?

Hash Password

?

Insert

pengguna

?

Ambil

pengguna_id

?

Insert

biodata_siswa

?

Kirim Email Verifikasi (opsional)

?

Status

Aktif

?

Login

?

Masuk

/home

---

# Validasi Register

Nama

Minimal

3 karakter

Maksimal

100 karakter

Email

Harus unik.

Format valid.

Password

Minimal

8 karakter.

Harus mengandung

Huruf

Angka

Disarankan simbol.

Tanggal Lahir

Tidak boleh tanggal di masa depan.

Nomor HP

Hanya angka.

---

# Alur Login

Masuk

?

Masukkan Email

?

Masukkan Password

?

Cari Email

?

Jika tidak ada

?

Tampilkan

Email tidak ditemukan.

Jika ada

?

Verifikasi Password Hash

?

Jika salah

?

Password salah.

Jika benar

?

Buat Session

?

Update

terakhir_login

?

Catat ke

riwayat_login

?

Redirect

/home

Jika role

admin

?

Redirect

/admin

---

# Hash Password

WAJIB

Password tidak boleh disimpan dalam bentuk asli.

Contoh yang benar

password

$argon2id$v=19$m=65536...

Contoh yang salah

password

12345678

Admin tidak dapat melihat password siswa.

Jika siswa lupa password.

Admin hanya dapat

Reset Password.

---

# Session Login

Saat login berhasil.

Simpan

ID Pengguna

Role

Nama

Session

Token

Session akan otomatis berakhir sesuai konfigurasi Laravel.

---

# Middleware

Guest

?

Login

?

Auth

?

Role

Admin

?

/admin

Role

Siswa

?

/home

Semua route dilindungi middleware.

---

# Relasi Database

pengguna

1

?

1

biodata_siswa

pengguna

1

?

1

admin

Setiap akun hanya memiliki satu biodata sesuai rolenya.

---

# Index Database

Buat Index pada

email

role

status

pengguna_id

tanggal_lahir

Hal ini mempercepat pencarian.

---

# Integrasi Laravel

Model

Pengguna

?

Model

BiodataSiswa

?

Controller

AuthController

?

Controller

ProfilController

?

API

?

Frontend React

Frontend tidak boleh mengakses PostgreSQL secara langsung.

---

# Struktur Folder Backend

app/

Models/

Pengguna.php

BiodataSiswa.php

Admin.php

Controllers/

AuthController.php

ProfilController.php

Requests/

LoginRequest.php

RegisterRequest.php

Policies/

Middleware/

Semua mengikuti standar Laravel.

---

# Checklist Bagian 1

## PostgreSQL

- [ ] Database dibuat
- [ ] UTF-8 aktif
- [ ] Timezone Asia/Jakarta
- [ ] Seluruh tabel menggunakan Bahasa Indonesia

## Tabel

- [ ] pengguna
- [ ] biodata_siswa
- [ ] admin

## Register

- [ ] Validasi
- [ ] Hash Password
- [ ] Simpan ke PostgreSQL
- [ ] Simpan Biodata
- [ ] Redirect `/home`

## Login

- [ ] Session
- [ ] Middleware
- [ ] Role Admin
- [ ] Role Siswa
- [ ] Riwayat Login

## Security

- [ ] Argon2id/Bcrypt
- [ ] Email unik
- [ ] Password tidak disimpan asli
- [ ] Route dilindungi middleware

## Target Bagian 1

Bagian ini menjadi fondasi autentikasi seluruh aplikasi. Setelah selesai, sistem sudah memiliki struktur pengguna yang rapi, relasi yang jelas antara akun dan biodata, mekanisme login yang aman, serta pemisahan akses antara **Admin (`/admin`)** dan **Siswa (`/home`)** sebagai dasar untuk pengembangan modul berikutnya.
---

# BAGIAN 2
# MODUL AKADEMIK
## Program, Materi, Video, PDF, Quiz dan Relasi Database

Bagian ini mengatur seluruh sistem pembelajaran.

Semua materi yang dilihat siswa berasal dari tabel-tabel berikut.

Program

?

Materi

?

Video

?

PDF

?

Quiz

?

Progress

?

Sertifikat

Semua saling berhubungan.

---

# Struktur Besar

Program

?

Materi

?

Video

?

PDF

?

Quiz

?

Nilai

?

Progress

?

Sertifikat

---

# Tabel
## kategori_program

Digunakan agar Program dapat dikelompokkan.

Contoh

Bahasa Arab

Tahsin

Tafsir

Hadits

Bootcamp

Workshop

Kolom

id

nama_kategori

slug

deskripsi

status

created_at

updated_at

---

# Tabel
## program

Program merupakan kelas utama.

Contoh

Bahasa Arab Dasar

Nahwu Pemula

Sharaf Dasar

Muhadatsah

Kolom

id

kategori_program_id

nama_program

slug

deskripsi

thumbnail

cover

instruktur

tingkat

durasi_jam

jumlah_materi

status

created_at

updated_at

---

# Penjelasan

kategori_program_id

Foreign Key

Mengarah ke

kategori_program.id

nama_program

Nama program.

slug

Digunakan pada URL.

Contoh

bahasa-arab-dasar

thumbnail

Foto kecil.

cover

Banner besar.

instruktur

Nama pengajar.

tingkat

Pemula

Menengah

Lanjutan

durasi_jam

Contoh

20 Jam

jumlah_materi

Diupdate otomatis.

status

aktif

nonaktif

draft

---

# Relasi

kategori_program

1

?

?

program

---

# Tabel
## materi

Materi merupakan isi dari Program.

Contoh

Bab 1

Huruf Hijaiyah

Bab 2

Harakat

Bab 3

Isim

Kolom

id

program_id

judul

slug

deskripsi

urutan

estimasi_menit

status

created_at

updated_at

---

# Penjelasan

program_id

Foreign Key

judul

Nama materi.

slug

URL.

urutan

Digunakan mengurutkan materi.

estimasi_menit

Estimasi waktu belajar.

status

aktif

draft

arsip

---

# Relasi

program

1

?

?

materi

---

# Tabel
## video

Setiap materi dapat memiliki video.

Kolom

id

materi_id

judul_video

deskripsi

url_video

durasi

thumbnail

status

created_at

updated_at

---

# Penjelasan

materi_id

Foreign Key.

url_video

URL Video.

Bisa berasal dari

Cloud Storage

Vimeo

YouTube Private

Bunny Stream

atau Storage Internal.

durasi

Format

HH:MM:SS

---

# Relasi

materi

1

?

?

video

---

# Tabel
## pdf

Digunakan menyimpan file materi.

Kolom

id

materi_id

judul_file

nama_file

ukuran_file

jumlah_halaman

status

created_at

updated_at

---

# Penjelasan

nama_file

Lokasi file pada Storage.

ukuran_file

Contoh

4.3 MB

jumlah_halaman

Total halaman PDF.

---

# Relasi

materi

1

?

?

pdf

---

# Tabel
## audio

Jika materi memiliki audio.

Kolom

id

materi_id

judul_audio

nama_file

durasi

status

created_at

updated_at

---

# Relasi

materi

1

?

?

audio

---

# Tabel
## quiz

Setiap materi dapat memiliki Quiz.

Kolom

id

materi_id

judul

deskripsi

nilai_minimum

durasi_menit

acak_soal

status

created_at

updated_at

---

# Penjelasan

nilai_minimum

Contoh

75

durasi_menit

Misal

20 Menit

acak_soal

Ya

Tidak

status

aktif

draft

---

# Relasi

materi

1

?

1

quiz

---

# Tabel
## soal_quiz

Kolom

id

quiz_id

pertanyaan

jenis

poin

urutan

created_at

updated_at

---

# Jenis

Pilihan Ganda

Benar Salah

Essay

---

# Relasi

quiz

1

?

?

soal_quiz

---

# Tabel
## pilihan_jawaban

Kolom

id

soal_id

pilihan

benar

created_at

updated_at

---

# Penjelasan

pilihan

A

B

C

D

benar

true

false

---

# Relasi

soal_quiz

1

?

?

pilihan_jawaban

---

# Tabel
## hasil_quiz

Digunakan menyimpan hasil siswa.

Kolom

id

pengguna_id

quiz_id

nilai

status

waktu_mulai

waktu_selesai

created_at

updated_at

---

# Status

Lulus

Tidak Lulus

Belum Selesai

---

# Logic Quiz

Siswa

?

Mulai Quiz

?

Jawab Soal

?

Submit

?

Hitung Nilai

?

Simpan hasil_quiz

?

Update Progress

?

Jika nilai memenuhi

?

Status

Lulus

---

# Halaman Program

Ketika siswa membuka

/home

?

Klik

Bahasa Arab Dasar

?

Masuk

/program/bahasa-arab-dasar

Halaman menampilkan

Cover

?

Deskripsi

?

Tutor

?

Daftar Materi

?

Progress

?

Mulai Belajar

---

# Halaman Materi

Klik

Bab 1

?

Halaman Materi

Menampilkan

Video

?

PDF

?

Audio

?

Quiz

?

Navigasi

?

Progress

---

# Progress Materi

Progress dihitung otomatis.

Formula

Jumlah materi selesai

dibagi

Total materi

×

100

Disimpan pada PostgreSQL.

---

# Database Flow

Admin

?

Tambah Program

?

Tambah Materi

?

Tambah Video

?

Tambah PDF

?

Tambah Quiz

?

Publish

?

Siswa Login

?

Data tampil di

/home

?

Belajar

?

Progress tersimpan

?

Quiz

?

Nilai

?

Sertifikat

---

# Validasi

Program

Nama wajib unik.

Materi

Harus memiliki Program.

Video

Harus memiliki Materi.

Quiz

Harus memiliki Materi.

Soal

Harus memiliki Quiz.

Pilihan Jawaban

Harus memiliki Soal.

Semua Foreign Key wajib valid.

---

# Index PostgreSQL

Tambahkan Index pada

program_id

materi_id

quiz_id

pengguna_id

slug

status

urutan

Hal ini mempercepat pencarian dan pengambilan data.

---

# Integrasi Laravel

Model

KategoriProgram

Program

Materi

Video

Pdf

Audio

Quiz

SoalQuiz

PilihanJawaban

HasilQuiz

Controller

ProgramController

MateriController

VideoController

QuizController

Semua menggunakan Eloquent Relationship.

---

# Checklist Bagian 2

## Master Data

- [ ] kategori_program
- [ ] program
- [ ] materi

## Konten

- [ ] video
- [ ] pdf
- [ ] audio

## Evaluasi

- [ ] quiz
- [ ] soal_quiz
- [ ] pilihan_jawaban
- [ ] hasil_quiz

## Relasi

- [ ] kategori_program ? program
- [ ] program ? materi
- [ ] materi ? video
- [ ] materi ? pdf
- [ ] materi ? audio
- [ ] materi ? quiz
- [ ] quiz ? soal_quiz
- [ ] soal_quiz ? pilihan_jawaban
- [ ] quiz ? hasil_quiz

## Backend

- [ ] Migration selesai
- [ ] Model selesai
- [ ] Controller selesai
- [ ] API selesai
- [ ] Validasi selesai
- [ ] Foreign Key selesai
- [ ] Index PostgreSQL selesai

## Target Bagian 2

Setelah bagian ini selesai, Admin sudah dapat membuat kategori, program, materi, video, PDF, audio, dan quiz melalui panel **`/admin`**, sedangkan siswa yang login ke **`/home`** akan melihat seluruh konten tersebut secara otomatis sesuai data yang tersimpan di PostgreSQL tanpa ada data hardcode di frontend.
---

# BAGIAN 3
# MODUL SISWA, PROGRESS, SERTIFIKAT, ADMIN PANEL, IMPORT & EXPORT

Bagian ini menjelaskan bagaimana aktivitas siswa disimpan ke PostgreSQL, bagaimana Admin mengelola data siswa, serta bagaimana sistem Import dan Export bekerja.

Semua proses harus berjalan otomatis melalui Laravel dan PostgreSQL.

---

# Alur Besar Sistem

Landing Page

?

Register

?

Login

?

/home

?

Belajar

?

Progress

?

Quiz

?

Sertifikat

?

Riwayat

?

Admin Monitoring

?

Export Excel

---

# Tabel
## siswa_program

Tabel ini digunakan untuk mengetahui program apa saja yang diikuti oleh siswa.

Kolom

id

pengguna_id

program_id

tanggal_mulai

tanggal_selesai

status

created_at

updated_at

---

# Status

Aktif

Selesai

Berhenti

---

# Relasi

pengguna

1

?

?

siswa_program

?

program

---

# Logic

Siswa membeli / didaftarkan ke Program

?

Data masuk

siswa_program

?

Program otomatis muncul pada

/home

?

Program Saya

---

# Tabel
## progress_belajar

Tabel ini merupakan salah satu tabel terpenting.

Digunakan untuk menyimpan progress setiap materi.

Kolom

id

pengguna_id

program_id

materi_id

video_id

persentase

durasi_tonton

status

terakhir_diakses

created_at

updated_at

---

# Status

Belum Dimulai

Sedang Belajar

Selesai

---

# Logic Progress

Siswa membuka video.

?

Video diputar.

?

Setiap 10 detik

?

Update

durasi_tonton

?

Hitung Progress

?

Update PostgreSQL

?

Jika video selesai

?

Status

Selesai

?

Update Progress Program

---

# Continue Learning

Data Continue Learning pada

/home

mengambil dari

progress_belajar

?

terakhir_diakses

?

Progress terbesar

?

Tampilkan

"Lanjutkan Belajar"

---

# Tabel
## nilai_quiz

Kolom

id

pengguna_id

quiz_id

jumlah_benar

jumlah_salah

nilai

status

tanggal_quiz

created_at

updated_at

---

# Logic Nilai

Siswa

?

Submit Quiz

?

Hitung Nilai

?

Simpan

nilai_quiz

?

Update Progress

?

Jika memenuhi

?

Lulus

---

# Tabel
## sertifikat

Kolom

id

pengguna_id

program_id

nomor_sertifikat

tanggal_terbit

lokasi_file

status

created_at

updated_at

---

# Logic Sertifikat

Progress

100%

?

Quiz

Lulus

?

Generate Nomor

?

Generate PDF

?

Simpan Database

?

Simpan File

?

Muncul

/sertifikat

---

# Format Nomor Sertifikat

Contoh

ABY-2026-000001

ABY

=

Al Bayan

2026

=

Tahun

000001

=

Nomor Urut

---

# Tabel
## bookmark

Kolom

id

pengguna_id

materi_id

created_at

updated_at

---

# Logic

Klik

? Bookmark

?

Simpan

bookmark

?

Muncul pada

/bookmark

---

# Tabel
## riwayat_belajar

Kolom

id

pengguna_id

materi_id

durasi

persentase

tanggal

created_at

updated_at

---

# Logic

Setiap selesai belajar

?

Masuk

riwayat_belajar

?

Bisa dilihat pada

Riwayat Belajar

---

# Tabel
## notifikasi

Kolom

id

pengguna_id

judul

pesan

dibaca

jenis

created_at

updated_at

---

# Jenis

Materi Baru

Program Baru

Quiz Baru

Sertifikat

Pengumuman

---

# Logic

Admin publish materi

?

Insert

notifikasi

?

Siswa login

?

Icon lonceng aktif

?

Klik

?

Tandai Dibaca

---

# Tabel
## pengumuman

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

# Dashboard Admin

Route

/admin

Admin memiliki Dashboard yang berbeda dengan siswa.

Admin TIDAK menggunakan

/home

---

# Menu Admin

Dashboard

?

Siswa

?

Admin

?

Program

?

Materi

?

Video

?

PDF

?

Quiz

?

Sertifikat

?

Pengumuman

?

Import Data

?

Export Data

?

Pengaturan

---

# Menu Siswa (Admin)

Admin dapat melihat seluruh siswa.

Kolom

Nama

Email

Nomor HP

Jenis Kelamin

Tanggal Lahir

Program

Status

Tanggal Daftar

Aksi

---

# Detail Siswa

Klik

Lihat

?

Menampilkan

Foto

?

Nama

?

Email

?

Nomor HP

?

Alamat

?

Program

?

Progress

?

Nilai Quiz

?

Riwayat Login

?

Sertifikat

?

Bookmark

Semua berasal dari PostgreSQL.

---

# Edit Siswa

Admin dapat mengubah

Nama

Nomor HP

Alamat

Status

Program

Foto

Admin TIDAK dapat melihat password asli.

Jika lupa password

?

Reset Password

---

# Hapus Siswa

Klik

Hapus

?

Konfirmasi

?

Soft Delete

?

Data tetap tersimpan.

---

# Import Data

Menu

/admin/import

Format yang didukung

? Excel (.xlsx)

? TXT (.txt)

? PDF (.pdf)

---

# Flow Import

Admin

?

Upload File

?

Preview

?

Validasi

?

Deteksi Kolom

?

Cocokkan Data

?

Import PostgreSQL

?

Laporan Berhasil

---

# Preview Import

Sebelum data masuk.

Admin melihat

Nama

Email

Nomor HP

Jenis Kelamin

Tanggal Lahir

Program

Jika ada data kosong

?

Highlight merah.

Admin dapat membatalkan Import.

---

# Validasi Import

Email tidak boleh sama.

Nomor HP tidak boleh sama.

Program harus ada.

Tanggal lahir harus valid.

Nama wajib diisi.

---

# Export Data

Menu

/admin/export

Export hanya mendukung

Excel (.xlsx)

Tidak mendukung

TXT

PDF

CSV

---

# Flow Export

Klik

Export Excel

?

Pilih Data

?

Semua

atau

Filter

?

Generate Excel

?

Download

---

# Filter Export

Semua

?

Program

?

Status

?

Jenis Kelamin

?

Tanggal Daftar

?

Kota

?

Provinsi

?

Export

---

# Isi Excel

Kolom

ID

Nama Lengkap

Email

Nomor HP

Jenis Kelamin

Tanggal Lahir

Alamat

Kota

Provinsi

Program

Status

Tanggal Daftar

Password tidak ikut diekspor.

Password hash juga tidak diekspor.

---

# Log Aktivitas

Tabel

log_aktivitas

Kolom

id

pengguna_id

aktivitas

ip_address

browser

created_at

---

# Aktivitas yang Dicatat

Login

Logout

Register

Update Profil

Download Sertifikat

Quiz

Import

Export

Tambah Program

Edit Materi

Hapus Materi

Semuanya tercatat.

---

# Riwayat Login

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

# Dashboard Statistik Admin

Admin melihat statistik seperti:

Jumlah Siswa

Jumlah Program

Jumlah Materi

Jumlah Video

Jumlah Quiz

Jumlah Sertifikat

Jumlah Pengguna Aktif Hari Ini

Grafik sederhana untuk kebutuhan monitoring internal diperbolehkan di dashboard admin, tetapi tidak perlu ditampilkan pada halaman siswa.

---

# Integrasi Laravel

Model

SiswaProgram

ProgressBelajar

NilaiQuiz

Sertifikat

Bookmark

Notifikasi

Pengumuman

RiwayatBelajar

LogAktivitas

RiwayatLogin

Controller

AdminController

SiswaController

ImportController

ExportController

ProgressController

SertifikatController

Semua menggunakan Eloquent Relationship.

---

# Checklist Bagian 3

## Pembelajaran

- [ ] siswa_program
- [ ] progress_belajar
- [ ] continue learning
- [ ] bookmark
- [ ] riwayat_belajar

## Evaluasi

- [ ] nilai_quiz
- [ ] sertifikat

## Informasi

- [ ] notifikasi
- [ ] pengumuman

## Admin

- [ ] Dashboard Admin
- [ ] Data Siswa
- [ ] Detail Siswa
- [ ] Edit Siswa
- [ ] Soft Delete

## Import

- [ ] Excel (.xlsx)
- [ ] TXT (.txt)
- [ ] PDF (.pdf)
- [ ] Preview sebelum import
- [ ] Validasi data

## Export

- [ ] Excel (.xlsx)
- [ ] Filter export
- [ ] Password tidak diekspor

## Audit

- [ ] log_aktivitas
- [ ] riwayat_login

## Target Bagian 3

Setelah bagian ini selesai, sistem sudah mampu mengelola seluruh siklus pembelajaran siswa, mulai dari mengikuti program, menyimpan progres belajar, mengerjakan kuis, memperoleh sertifikat, menerima notifikasi, hingga dikelola oleh Admin melalui panel **`/admin`**. Admin juga dapat melakukan **Import** data dari **Excel, TXT, dan PDF** (dengan tahap preview dan validasi), serta **Export** data siswa ke **Excel** dengan struktur yang rapi dan aman.
---

# BAGIAN 4
# KEAMANAN, BACKUP, PERFORMA, STANDAR DATABASE, ROADMAP & CHECKLIST

Bagian ini merupakan standar implementasi PostgreSQL, Laravel, serta aturan yang WAJIB diikuti selama pengembangan.

Tujuannya agar database tetap aman, cepat, mudah dikembangkan, dan siap digunakan untuk ribuan siswa.

---

# Filosofi

Database bukan hanya tempat menyimpan data.

Database adalah jantung aplikasi.

Jika database dirancang dengan baik,

Frontend akan mudah dibuat.

Backend akan mudah dipelihara.

Fitur baru akan mudah ditambahkan.

Karena itu,

JANGAN membuat tabel secara asal.

Selalu pikirkan relasinya.

---

# Standar PostgreSQL

Gunakan

PostgreSQL 17+

Encoding

UTF-8

Timezone

Asia/Jakarta

Collation

Default PostgreSQL

Gunakan

BIGINT

untuk seluruh Primary Key.

---

# Primary Key

Semua tabel menggunakan

id

BIGINT

AUTO INCREMENT

Contoh

pengguna

id

BIGINT

PRIMARY KEY

---

# Foreign Key

Seluruh relasi menggunakan

Foreign Key

Contoh

pengguna

?

biodata_siswa

?

program

?

materi

?

quiz

?

hasil_quiz

Jangan membuat relasi manual.

---

# Index

Tambahkan Index pada kolom berikut

email

status

role

program_id

materi_id

pengguna_id

tanggal_lahir

slug

created_at

Index akan mempercepat Query.

---

# Soft Delete

Gunakan Soft Delete pada

Siswa

Program

Materi

Video

PDF

Quiz

Pengumuman

Jangan langsung menghapus data.

---

# Hard Delete

Hard Delete hanya digunakan jika

Super Admin

melakukan

Permanent Delete.

---

# Transaction Database

Semua proses penting harus menggunakan

Database Transaction.

Contoh

Register

?

Insert pengguna

?

Insert biodata

?

Berhasil

?

Commit

Jika gagal

?

Rollback

Data tidak boleh setengah masuk.

---

# Register Flow

Isi Form

?

Validasi

?

Hash Password

?

Insert pengguna

?

Insert biodata_siswa

?

Commit

?

Login

?

Masuk

/home

---

# Import Flow

Admin

?

Upload File

?

Preview

?

Validasi

?

Transaction

?

Insert Data

?

Commit

?

Selesai

Jika satu data gagal

?

Rollback

?

Import dibatalkan.

---

# Export Flow

Admin

?

Klik Export

?

Generate Excel

?

Download

Export tidak mengubah isi database.

---

# Backup

Backup Database

Setiap Hari

Pukul

02.00 WIB

Backup Storage

Seminggu sekali

Backup Upload

Seminggu sekali

Backup Konfigurasi

Sebulan sekali

---

# Restore

Restore hanya dapat dilakukan oleh

Super Admin.

Flow

Upload Backup

?

Validasi

?

Konfirmasi

?

Restore PostgreSQL

?

Restart Cache

?

Selesai

---

# Audit Log

Seluruh aktivitas penting dicatat.

Login

Logout

Register

Reset Password

Tambah Program

Edit Program

Hapus Program

Tambah Materi

Import

Export

Download Sertifikat

Perubahan Pengaturan

Semuanya masuk

log_aktivitas

---

# Monitoring

Admin dapat melihat

Jumlah Siswa

Jumlah Program

Jumlah Materi

Jumlah Video

Jumlah Quiz

Jumlah Sertifikat

Jumlah Login Hari Ini

Jumlah Pengguna Aktif

Storage Digunakan

Backup Terakhir

---

# Scheduler Laravel

Gunakan Scheduler untuk

Backup

Hapus Cache

Membersihkan Session Lama

Menghapus Notification Lama

Menghapus Temporary File

Mengirim Email Terjadwal

Generate Sertifikat Otomatis

---

# Notification

Jika

Program Baru

?

Notifikasi

Jika

Materi Baru

?

Notifikasi

Jika

Quiz Baru

?

Notifikasi

Jika

Sertifikat Terbit

?

Notifikasi

Jika

Pengumuman Baru

?

Notifikasi

Semua tersimpan di PostgreSQL.

---

# Storage

Pisahkan Folder.

storage

?

foto_profil

?

thumbnail_program

?

cover_program

?

video

?

pdf

?

sertifikat

?

backup

?

temporary

Jangan mencampur file.

---

# Upload Rule

Foto

Maksimal

2 MB

PDF

Maksimal

25 MB

Video

Maksimal

500 MB

Format

JPG

PNG

WEBP

PDF

MP4

Semua file divalidasi.

---

# Penamaan File

Gunakan UUID.

Jangan menggunakan

foto1.jpg

video2.mp4

Contoh

9fd7a91f-77dd-44fd-8f16.webp

Hal ini menghindari konflik nama file.

---

# API Rule

Frontend

?

REST API Laravel

?

Service

?

Repository

?

PostgreSQL

Frontend React tidak boleh mengakses database secara langsung.

---

# Authentication

Gunakan

Laravel Sanctum

atau

JWT

Session aman.

Cookie aman.

---

# Authorization

Role

Admin

?

/admin

Role

Siswa

?

/home

Role harus dicek melalui Middleware.

Tidak boleh hanya disembunyikan dari Frontend.

---

# Security

Aktifkan

CSRF Protection

Rate Limiter

XSS Protection

SQL Injection Protection

Request Validation

HTTPS

Secure Cookie

HttpOnly Cookie

SameSite Cookie

CORS

Trusted Proxy

Semuanya wajib.

---

# Password

Password selalu

Argon2id

atau

Bcrypt.

Tidak pernah disimpan dalam bentuk asli.

Admin tidak bisa melihat password siswa.

Hanya bisa

Reset Password.

---

# Performance

Gunakan

Redis

Untuk

Cache

Session

Queue

Queue digunakan untuk

Email

Export Excel

Import Data

Generate Sertifikat

Upload Video

Agar website tetap cepat.

---

# Optimasi PostgreSQL

Gunakan

Index

Vacuum

Analyze

Connection Pool

Query Optimization

Pagination

Lazy Loading

Eager Loading

Hindari

SELECT *

Gunakan kolom yang diperlukan saja.

---

# AI Code Rules

Saat AI Code membuat fitur baru.

WAJIB

Menggunakan Migration.

Menggunakan Foreign Key.

Menggunakan Validation.

Menggunakan Transaction.

Menggunakan Soft Delete bila diperlukan.

Menggunakan API Resource.

Menggunakan Eloquent Relationship.

JANGAN

Hardcode Data.

Duplikasi Tabel.

Duplikasi Kolom.

Query berulang.

Menghapus relasi database.

Mengubah struktur tabel tanpa Migration.

---

# Roadmap

Versi 1.0

Login

Register

Admin

Student Home

Program

Materi

Video

PDF

Quiz

Progress

Export Excel

Import

Versi 1.5

Bookmark

Riwayat Belajar

Catatan Pribadi

Dark Mode

Email Notification

Versi 2.0

Live Class

Forum Diskusi

Kalender Akademik

WhatsApp Notification

AI Assistant

Mobile Responsive Improvement

Versi 3.0

Android App

iOS App

PWA

Cloud Storage

Video Streaming

AI Search

Voice Learning

Analytics

---

# Future Database

Siapkan ruang untuk

Pembayaran

Invoice

Transaksi

Voucher

Referral

Presensi

Live Meeting

Forum

Komentar

Chat

Tugas

Penilaian

Sehingga tidak perlu mengubah struktur database besar di masa depan.

---

# Checklist Final

## Database

- [ ] PostgreSQL 17+
- [ ] UTF-8
- [ ] Timezone Asia/Jakarta
- [ ] BIGINT Primary Key
- [ ] Foreign Key
- [ ] Index
- [ ] Soft Delete
- [ ] Transaction
- [ ] Migration
- [ ] Seeder

## Security

- [ ] Argon2id
- [ ] CSRF
- [ ] XSS
- [ ] SQL Injection
- [ ] HTTPS
- [ ] Secure Cookie
- [ ] Validation
- [ ] Middleware

## Admin

- [ ] Dashboard
- [ ] Kelola Siswa
- [ ] Kelola Admin
- [ ] Kelola Program
- [ ] Kelola Materi
- [ ] Kelola Video
- [ ] Kelola PDF
- [ ] Kelola Quiz
- [ ] Import
- [ ] Export Excel
- [ ] Backup
- [ ] Monitoring

## Student

- [ ] Register
- [ ] Login
- [ ] /home
- [ ] Program
- [ ] Materi
- [ ] Progress
- [ ] Quiz
- [ ] Sertifikat
- [ ] Profil
- [ ] Riwayat Belajar

## Storage

- [ ] Upload Foto
- [ ] Upload PDF
- [ ] Upload Video
- [ ] Sertifikat
- [ ] Backup

## Quality

- [ ] Database Normalized
- [ ] Tidak ada Hardcode
- [ ] Tidak ada Query Berulang
- [ ] Semua Relasi Menggunakan Foreign Key
- [ ] Semua API Menggunakan Validation
- [ ] Seluruh Data Berasal dari PostgreSQL
- [ ] Dokumentasi Selalu Diperbarui

---

# Kesimpulan

Database ini dirancang sebagai fondasi utama Portal Belajar Al Bayan dengan pemisahan yang jelas antara autentikasi (`pengguna`), biodata (`biodata_siswa`), modul akademik (`program`, `materi`, `quiz`), aktivitas belajar (`progress_belajar`, `riwayat_belajar`), serta administrasi (`/admin`).

Struktur ini ditujukan agar mudah dipahami oleh tim pengembang, nyaman digunakan oleh admin Indonesia karena menggunakan penamaan tabel berbahasa Indonesia, serta tetap mengikuti praktik pengembangan modern melalui relasi yang jelas, validasi yang ketat, transaksi database, dan standar keamanan Laravel + PostgreSQL. Dengan fondasi ini, sistem dapat berkembang dari ratusan hingga ribuan siswa tanpa perlu merombak arsitektur inti.