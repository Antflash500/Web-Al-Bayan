# PROJECT.md

# Al Bayan Education Website

Version : 1.0

Status : Planning

---

# 1. Project Overview

Al Bayan Education Website merupakan website resmi Yayasan Al Bayan Education yang berfungsi sebagai pusat informasi, media promosi, sistem pendaftaran, serta portal digital bagi seluruh peserta yang telah terdaftar.

Website ini bukan sekadar company profile, tetapi dirancang sebagai fondasi sebuah ekosistem digital yang dapat berkembang menjadi Learning Management System (LMS), Student Portal, hingga sistem administrasi yayasan di masa mendatang.

Fokus utama proyek adalah menghadirkan pengalaman pengguna yang sederhana, modern, elegan, cepat, dan mudah digunakan oleh seluruh kalangan.

Website ini harus mampu memberikan kesan profesional sejak pertama kali dibuka, tanpa menghilangkan identitas islami yang menjadi ciri khas Al Bayan Education.

---

# 2. Project Vision

Membangun platform digital pendidikan yang modern, ringan, elegan, dan mudah digunakan sehingga mampu meningkatkan citra Al Bayan Education sebagai lembaga pembelajaran Bahasa Arab yang profesional.

Website harus mampu menjadi pintu utama seluruh layanan digital Al Bayan Education.

---

# 3. Main Objectives

Project memiliki beberapa tujuan utama.

• Memperkenalkan Al Bayan Education kepada masyarakat.

• Mempermudah proses pendaftaran peserta.

• Mengelola data peserta secara digital.

• Menyediakan dashboard peserta.

• Menjadi media informasi resmi yayasan.

• Menjadi fondasi pengembangan sistem digital jangka panjang.

---

# 4. Design Philosophy

Website tidak dibuat mengikuti template pendidikan yang sudah umum digunakan.

Sebaliknya website mengambil filosofi terbaik dari beberapa website modern.

Inspirasi tersebut hanya digunakan sebagai referensi pengalaman pengguna (User Experience) dan bukan untuk disalin secara visual.

Inspirasi utama terdiri dari :

IKLA

Digunakan sebagai referensi struktur landing page.

Yang diambil :

• Layout

• White Space

• Simplicity

• Informasi yang mudah dipahami

• Section yang rapi

Tidak mengambil desain secara identik.

---

Vercel

Digunakan sebagai inspirasi Hero Section.

Yang diambil :

• Fullscreen Video

• Modern Typography

• Smooth Animation

• Elegant Transition

• Premium Feel

---

Home HSI

Digunakan sebagai referensi Dashboard.

Yang diambil :

• Dashboard sederhana

• Fokus kepada pembelajaran

• Card Modern

• Informasi mudah ditemukan

• User Friendly

---

# 5. Core Principles

Seluruh pengembangan wajib mengikuti prinsip berikut.

Simple.

Modern.

Elegant.

Responsive.

Fast.

Reusable.

Maintainable.

Accessible.

Scalable.

Clean.

Seluruh halaman harus memiliki tujuan yang jelas.

Tidak boleh ada section yang hanya berfungsi sebagai hiasan.

---

# 6. Website Identity

Nama

Al Bayan Education

Jenis

Website Yayasan Pendidikan

Target

Mahasiswa

Calon Mahasiswa

Orang Tua

Masyarakat Umum

Admin Yayasan

---

# 7. Website Experiences

Website dibagi menjadi tiga pengalaman berbeda.

Hal ini dilakukan agar pengguna tidak merasa bingung ketika berpindah fungsi.

Experience pertama.

Landing Website.

Tujuan.

Memperkenalkan Al Bayan.

Experience kedua.

Authentication.

Tujuan.

Melakukan login dan registrasi.

Experience ketiga.

Dashboard.

Tujuan.

Memberikan layanan kepada peserta.

Masing-masing experience memiliki desain yang berbeda namun tetap menggunakan identitas visual yang sama.

---

# 8. Landing Page Concept

Landing Page merupakan wajah utama website.

Landing page harus mampu memberikan kesan pertama yang kuat dalam waktu kurang dari lima detik.

Landing page menggunakan Hero Video.

Asset video telah disediakan pada folder berikut.

public/image/background1.mp4

Logo utama website menggunakan.

public/image/logo.png

Landing page menggunakan Hero Fullscreen.

Tinggi Hero adalah 100vh.

Video berjalan otomatis.

Muted.

Loop.

Autoplay.

Object Fit Cover.

---

# 9. Hero Concept

Hero terdiri dari.

Background Video.

Overlay Gradient.

Logo.

Headline.

Subtitle.

Primary Button.

Secondary Button.

Scroll Indicator.

Overlay menggunakan warna hijau tua dengan opacity sekitar lima puluh persen.

Tujuan overlay adalah menjaga keterbacaan teks.

---

# 10. Hero Animation

Ketika halaman pertama dibuka.

Video langsung dimainkan.

Navbar berada dalam keadaan transparan.

Saat pengguna melakukan scroll.

Navbar berubah menjadi putih.

Background blur aktif.

Shadow muncul secara perlahan.

Logo sedikit mengecil.

Seluruh animasi menggunakan Motion (sebelumnya Framer Motion).

Durasi sekitar 0.4 detik.

Tidak menggunakan animasi yang berlebihan.

---

# 11. Scroll Philosophy

Scroll merupakan bagian penting dari pengalaman pengguna.

Alih-alih mengganti Hero secara langsung.

Section kedua akan bergerak naik perlahan.

Seolah-olah menutupi Hero.

Efek ini memberikan kesan premium.

Flow.

Hero Video

↓

User Scroll

↓

White Layer Muncul

↓

Video Tertutup

↓

Masuk ke Section Berikutnya

Landing tidak menggunakan efek parallax yang berat.

Fokus utama tetap pada performa.

---

# 12. Landing Page Sections

Landing Page terdiri dari beberapa section.

Hero.

Tentang Al Bayan.

Visi.

Misi.

Program.

Keunggulan.

Galeri.

Lokasi.

Kontak.

FAQ.

Footer.

Urutan ini tidak boleh diubah tanpa alasan yang jelas.

Karena telah mengikuti alur berpikir calon peserta.

---

# 13. Navigation Structure

Navbar menggunakan Floating Navigation.

Navbar tidak menempel pada bagian paling atas browser.

Navbar memiliki.

Border Radius.

Background Transparan.

Blur.

Shadow Tipis.

Saat Hero masih terlihat.

Navbar transparan.

Saat Hero telah dilewati.

Navbar berubah menjadi putih.

Logo berubah menjadi versi normal.

---

# 14. Navbar Menu

Beranda

Tentang Kami

Program

Galeri

Kontak

Masuk

Daftar

Button Daftar menggunakan warna hijau.

Button Masuk menggunakan outline.

---

# 15. Hero Content

Heading.

Belajar Bahasa Arab dalam Lingkungan yang Kondusif.

Subtitle.

Al Bayan Education menghadirkan pembelajaran Bahasa Arab serta hunian mahasiswa yang nyaman dalam satu lingkungan islami yang mendukung perkembangan akademik dan karakter.

Primary Button.

Daftar Sekarang.

Secondary Button.

Lihat Program.

---

# 16. About Section

Section ini menjelaskan identitas Al Bayan Education.

Konten diambil dari profil resmi yayasan.

Section menggunakan layout dua kolom.

Kiri.

Deskripsi.

Kanan.

Foto yayasan.

Background putih.

Padding besar.

Tidak menggunakan card.

---

# 17. Vision & Mission

Visi dan Misi dibuat dalam section terpisah.

Visi menggunakan satu card besar.

Misi menggunakan lima card kecil.

Setiap card memiliki icon.

Hover ringan.

Shadow lembut.

Animasi fade.

Section menggunakan background abu muda agar berbeda dari section sebelumnya.

---

# 18. Why Choose Al Bayan

Section ini menjadi salah satu penentu keputusan calon peserta.

Isi section berupa enam keunggulan utama.

Contoh.

Lingkungan Islami.

Dekat Kampus STDI.

Hunian Nyaman.

Program Bahasa Arab.

Pembinaan Intensif.

Fasilitas Lengkap.

Setiap keunggulan menggunakan icon modern.

Tidak menggunakan gambar.

---

# 19. Program Section

Program merupakan salah satu bagian terpenting dari Landing Page.

Section ini menjelaskan seluruh program yang dimiliki Al Bayan Education.

Layout menggunakan dua kolom.

Namun posisi card dibuat tidak sejajar agar tampilan lebih dinamis.

Contoh.

Card 1         Card 2

        Card 3         Card 4

Card 5         Card 6

Tidak menggunakan grid yang benar-benar lurus.

Setiap card terdiri dari.

• Thumbnail Program

• Nama Program

• Jadwal

• Durasi

• Deskripsi Singkat

• Tombol Detail

Hover Card.

Saat cursor berada di atas card.

Card sedikit terangkat.

Shadow bertambah.

Gambar melakukan zoom sekitar 3%.

Animasi maksimal 0.4 detik.

---

# 20. Gallery Section

Gallery bertujuan memperlihatkan fasilitas Al Bayan Education.

Gallery terdiri dari dua belas foto.

Foto disimpan pada.

public/image/gallery/

Daftar gallery.

Ruang Tamu

Depan Asrama

Kamar 1

Kamar 2

Kamar 3

Kamar 4

Kamar Mandi 1

Kamar Mandi 2

Tempat Jemuran

Garasi Motor

Ruang Tengah

Dapur Umum

Layout.

Desktop.

3 kolom.

4 baris.

Tablet.

2 kolom.

Mobile.

1 kolom.

Setiap gallery menggunakan card.

Isi card.

Foto.

Judul.

Deskripsi singkat.

Ketika gambar dipilih.

Muncul Lightbox.

Background menjadi gelap.

Foto dapat diperbesar.

User dapat berpindah menggunakan tombol next dan previous.

---

# 21. Contact Section

Section kontak merupakan bagian terakhir sebelum Footer.

Informasi yang ditampilkan.

Alamat.

Perumahan Pemali

Blok D17

Jember

Nomor Telepon.

082332620365

WhatsApp.

082332620365

Google Maps.

Embedded Map.

Jam Operasional.

Email.

Social Media.

Seluruh informasi kontak menggunakan icon.

---

# 22. Footer

Footer menggunakan background hijau tua.

Isi footer.

Logo.

Tentang Singkat.

Quick Link.

Program.

Kontak.

Alamat.

Copyright.

Footer tidak menggunakan warna hitam.

Footer dibuat sederhana.

---

# 23. Authentication Philosophy

Authentication memiliki tampilan berbeda dari Landing Page.

Hal ini bertujuan membuat pengguna memahami bahwa mereka sedang memasuki sistem.

Authentication tidak menggunakan Hero.

Tidak menggunakan Navbar.

Tidak menggunakan Gallery.

Fokus hanya kepada proses Login dan Register.

Background tetap menggunakan identitas Al Bayan.

Menggunakan warna hijau.

Gradient.

Blur.

Glass Effect ringan.

---

# 24. Login Page

Halaman Login berada pada.

login

Layout.

Logo.

Heading.

Email atau NIM.

Password.

Remember Me.

Lupa Password.

Button Login.

Link Register.

Login dapat menggunakan.

Email.

Atau.

NIM.

Password menggunakan Hash Laravel.

Tidak ada Login menggunakan Username.

---

# 25. Register Philosophy

Register dibuat sesingkat mungkin.

Tidak meminta data yang tidak diperlukan.

Register menggunakan Multi Step Form.

Progress Bar berada di bagian atas.

Setiap perpindahan step menggunakan animasi.

Data divalidasi setiap step.

---

# 26. Register Step One

Step pertama.

Email.

Password.

Konfirmasi Password.

Validasi.

Email wajib unik.

Password minimal delapan karakter.

Password wajib mengandung huruf dan angka.

Password Confirmation harus sama.

Button.

Lanjut.

---

# 27. Register Step Two

Step kedua.

Nama Lengkap.

NIM.

Tanggal Lahir.

Jenis Kelamin.

Validasi.

Nama wajib.

NIM wajib unik.

Tanggal lahir valid.

Jenis Kelamin.

Laki-laki.

Perempuan.

Tidak ada field lain.

---

# 28. Register Step Three

Step terakhir.

Persetujuan.

User wajib menyetujui.

Peraturan Yayasan.

Kebijakan Privasi.

Syarat dan Ketentuan.

Checkbox wajib dicentang.

Button.

Buat Akun.

Setelah berhasil.

Akun otomatis dibuat.

---

# 29. Email Verification

Setelah akun dibuat.

Sistem mengirim OTP enam digit.

OTP dikirim ke Email.

User diarahkan menuju halaman.

verify-email

Halaman terdiri dari.

Logo.

Input enam digit.

Button Verifikasi.

Button Kirim Ulang.

Timer.

---

# 30. OTP Rules

OTP terdiri dari enam angka.

Contoh.

314928

OTP berlaku lima menit.

OTP hanya boleh dikirim ulang setelah enam puluh detik.

Maksimal lima kali percobaan.

Setelah lima kali gagal.

OTP dihapus.

Harus meminta OTP baru.

OTP disimpan menggunakan Redis.

Tidak disimpan permanen pada PostgreSQL.

---

# 31. Forgot Password

Forgot Password menggunakan Email.

Flow.

Input Email.

↓

Kirim OTP.

↓

Verifikasi OTP.

↓

Password Baru.

↓

Login.

Tidak menggunakan link reset.

Seluruh proses menggunakan kode OTP enam digit.

---

# 32. Authentication Security

Laravel Hash.

CSRF Protection.

Rate Limiter.

Redis Session.

Middleware Guest.

Middleware Auth.

Sanitasi Input.

Validation Request.

Brute Force Protection.

---

# 33. User Roles

Website menggunakan Role.

Admin.

Student.

Role disimpan pada tabel users.

Role menentukan akses Dashboard.

---

# 34. Dashboard Philosophy

Dashboard memiliki tujuan berbeda dari Landing.

Landing bertujuan menjual.

Dashboard bertujuan membantu.

Oleh karena itu Dashboard harus ringan.

Minim animasi.

Cepat.

Informasi mudah ditemukan.

---

# 35. Dashboard Admin

Dashboard Admin digunakan oleh pengelola yayasan.

Menu.

Dashboard.

Peserta.

Program.

Galeri.

Pengumuman.

Pendaftaran.

Media.

Laporan.

Pengaturan.

Dashboard menggunakan Sidebar.

Header.

Breadcrumb.

Notification.

User Menu.

---

# 36. Dashboard Student

Dashboard Student berbeda dari Dashboard Admin.

Inspirasi utama.

Home HSI.

Halaman pertama.

Ucapan Selamat Datang.

Program Saya.

Pengumuman.

Agenda.

Profil.

Progress Belajar.

Dashboard Student tidak memiliki menu administrasi.

Fokus hanya kepada peserta.

---

# 37. Dashboard Components

Dashboard menggunakan komponen reusable.

Statistic Card.

Data Table.

Modal.

Alert.

Toast.

Button.

Input.

Dropdown.

Dialog.

Sidebar.

Navbar.

Pagination.

Search.

Semua dibuat reusable.

Tidak boleh membuat komponen yang sama lebih dari satu kali.

---

# 38. Responsive Philosophy

Website wajib Mobile First.

Desktop bukan prioritas utama.

Mayoritas pengguna diperkirakan menggunakan Smartphone.

Setiap halaman diuji pada.

Desktop.

Laptop.

Tablet.

Mobile.

Landscape.

Portrait.

Tidak boleh ada Horizontal Scroll.

---

# 39. Accessibility

Seluruh tombol memiliki Label.

Seluruh gambar memiliki Alt.

Kontras warna memenuhi standar.

Navigasi dapat digunakan menggunakan Keyboard.

Focus Ring selalu terlihat.

Form memiliki Error Message yang jelas.

---

# 40. End of Part Two

Bagian berikutnya akan membahas.

• Struktur PostgreSQL.

• Strategi Redis.

• Folder Architecture.

• Struktur React.

• Struktur Laravel.

• Routing.

• Component Rules.

• Security.

• Performance Optimization.

• Deployment.

• Future Roadmap.

• Development Milestone.
---

# 41. Technical Architecture

Al Bayan Education dibangun menggunakan arsitektur modern yang memisahkan Frontend dan Backend secara jelas, namun tetap memberikan pengalaman seperti Single Page Application (SPA).

Framework utama yang digunakan adalah Laravel dengan Inertia.js dan React.

Dengan pendekatan ini, website tetap memperoleh keuntungan Laravel seperti Authentication, Middleware, Routing, Queue, Mail, Storage, dan Eloquent ORM, namun pengalaman pengguna tetap terasa seperti aplikasi React modern.

Architecture Overview.

Browser

↓

React + TypeScript

↓

Inertia.js

↓

Laravel

↓

Service Layer

↓

Repository Layer

↓

PostgreSQL

↓

Redis

↓

Storage

---

# 42. Technology Stack

Frontend

React 19

TypeScript

Inertia.js

Tailwind CSS v4

Shadcn/UI

Motion (sebelumnya Framer Motion)

Lucide React

React Hook Form

Zod

Embla Carousel

React Intersection Observer

Motion

Backend

Laravel 12+

PHP 8.4+

Laravel Mail

Laravel Queue

Laravel Scheduler

Laravel Events

Laravel Notifications

Laravel Policies

Laravel Gates

Laravel Form Request

Laravel Resource

Database

PostgreSQL

Cache

Redis

Server

Nginx

PHP-FPM

Supervisor

SSL

Cloudflare

Development

Composer

PNPM

Vite

Git

GitHub

ESLint

Prettier

Laravel Pint

---

# 43. Why PostgreSQL

Database utama menggunakan PostgreSQL.

Alasan pemilihan.

Lebih stabil.

Open Source.

Relationship sangat baik.

Mendukung JSON.

Query lebih cepat pada data kompleks.

Sangat cocok untuk Laravel.

Lebih siap jika suatu saat website berkembang menjadi LMS.

PostgreSQL menjadi satu-satunya sumber data permanen.

Seluruh data penting berada di PostgreSQL.

---

# 44. Why Redis

Redis tidak digunakan sebagai database.

Redis digunakan sebagai Memory Cache.

Fungsi Redis.

OTP Email

Cache

Queue

Rate Limiter

Session

Temporary Verification

Dashboard Cache

Notification Cache

Redis membuat website jauh lebih responsif.

Redis mengurangi beban PostgreSQL.

---

# 45. Database Concept

Seluruh data dipisahkan berdasarkan tanggung jawab.

Tidak boleh membuat satu tabel berisi semua data.

Struktur database harus mengikuti prinsip Single Responsibility.

Setiap tabel memiliki satu tujuan.

---

# 46. Main Tables

users

student_profiles

programs

gallery

announcements

password_reset_tokens

sessions

cache

failed_jobs

jobs

notifications

activity_logs

future_payments

future_materials

future_certificates

Seluruh tabel dibuat menggunakan Migration Laravel.

---

# 47. User Table

Users hanya menyimpan informasi autentikasi.

Contoh.

ID

Email

Password

Role

Email Verified

Remember Token

Created At

Updated At

Data pribadi tidak disimpan di tabel Users.

---

# 48. Student Profile

Seluruh informasi peserta disimpan pada tabel Student Profile.

Contoh.

Nama Lengkap

NIM

Tanggal Lahir

Jenis Kelamin

Alamat

Nomor HP

Foto Profil

Created At

Updated At

Dengan cara ini tabel Users tetap ringan.

---

# 49. Folder Structure

Project mengikuti struktur Laravel standar.

resources

↓

js

↓

components

↓

pages

↓

layouts

↓

hooks

↓

services

↓

types

↓

utils

↓

lib

↓

constants

↓

assets

Komponen tidak boleh dicampur dengan halaman.

---

# 50. React Component Rules

Seluruh UI dibuat reusable.

Button.

Input.

Card.

Modal.

Dialog.

Toast.

Alert.

Navbar.

Sidebar.

Dropdown.

Avatar.

Gallery Card.

Program Card.

FAQ Item.

Statistic Card.

Semua dibuat reusable.

Tidak boleh ada duplicate component.

---

# 51. Layout Structure

Project memiliki tiga Layout utama.

Landing Layout.

Authentication Layout.

Dashboard Layout.

Seluruh halaman wajib menggunakan Layout.

Tidak boleh membuat Navbar berulang pada setiap halaman.

Layout bertanggung jawab mengatur.

Navbar.

Footer.

Sidebar.

Header.

Container.

Animation.

---

# 52. Routing Concept

Landing

/

Login

/login

Register

/register

Forgot Password

/forgot-password

Verify OTP

/verify-otp

Dashboard

/dashboard

Programs

/dashboard/program

Announcements

/dashboard/announcement

Profile

/dashboard/profile

Gallery

/gallery

Contact

/contact

Routing menggunakan Laravel Route + Inertia.

Tidak menggunakan React Router.

---

# 53. API Philosophy

Frontend tidak boleh langsung mengakses Database.

Semua request melalui Laravel.

Flow.

React

↓

Inertia

↓

Controller

↓

Service

↓

Repository

↓

Model

↓

PostgreSQL

Controller tidak boleh berisi Business Logic.

---

# 54. Service Layer

Business Logic dipindahkan ke Service.

Contoh.

Register User

Send OTP

Verify OTP

Reset Password

Create Student

Update Profile

Generate Dashboard

Controller hanya memanggil Service.

---

# 55. Repository Layer

Repository bertugas mengakses Database.

Repository tidak boleh berisi Business Logic.

Repository hanya berisi Query.

Hal ini mempermudah maintenance.

---

# 56. Validation

Seluruh Form menggunakan Form Request Laravel.

Tidak melakukan validasi langsung di Controller.

Frontend menggunakan Zod.

Backend menggunakan Form Request.

Double Validation.

---

# 57. Security Rules

Password menggunakan Hash.

Tidak boleh MD5.

Tidak boleh SHA1.

Menggunakan Laravel Hash.

Seluruh Form menggunakan CSRF.

Seluruh Input divalidasi.

XSS Protection.

SQL Injection Protection.

Middleware Authentication.

Middleware Guest.

Middleware Verified.

Rate Limiter Login.

Rate Limiter OTP.

---

# 58. Email Strategy

Laravel Mail digunakan sebagai Email Service.

SMTP dapat menggunakan.

Gmail App Password.

Brevo.

Mailgun.

Amazon SES.

OTP dikirim melalui Queue.

User tidak perlu menunggu Email selesai dikirim.

---

# 59. Queue Strategy

Queue digunakan untuk.

Send OTP.

Send Notification.

Future Email Broadcast.

Generate Certificate.

Export PDF.

Queue Driver.

Redis.

Worker dijalankan menggunakan Supervisor.

---

# 60. Performance Goals

Target Lighthouse.

Performance.

90+

Accessibility.

95+

SEO.

95+

Best Practices.

95+

CLS rendah.

LCP kurang dari 2.5 detik.

Hero Video preload metadata.

Lazy Loading Image.

Code Splitting.

Dynamic Import.

Cache menggunakan Redis.

Compression menggunakan Gzip/Brotli.

---

# 61. Mobile First

Website dikembangkan menggunakan pendekatan Mobile First.

Layout desktop mengikuti mobile.

Bukan sebaliknya.

Breakpoint mengikuti Tailwind CSS v4.

Tidak boleh ada komponen yang rusak pada ukuran layar kecil.

---

# 62. Development Philosophy

Seluruh kode harus mudah dipahami.

Nama variable jelas.

Nama component jelas.

Nama folder jelas.

Tidak menggunakan singkatan yang membingungkan.

Komentar hanya digunakan jika benar-benar diperlukan.

Kode harus menjadi dokumentasi itu sendiri.

---

# 63. Future Scalability

Project dipersiapkan agar dapat berkembang menjadi.

Learning Management System.

Online Class.

Payment System.

Certificate Generator.

Attendance System.

Parent Portal.

Teacher Dashboard.

Admin Dashboard.

WhatsApp Notification.

Push Notification.

Mobile App.

Seluruh keputusan arsitektur dibuat dengan mempertimbangkan perkembangan tersebut.

---

# End Part Three

Bagian selanjutnya akan membahas.

- UI/UX Rules
- Animation Rules
- Component Naming Convention
- Folder Naming Convention
- Git Workflow
- Deployment
- Nginx
- Redis Production
- PostgreSQL Production
- Cloudflare
- Backup Strategy
- Monitoring
- Logging
- Maintenance
- Development Checklist
- Final Roadmap