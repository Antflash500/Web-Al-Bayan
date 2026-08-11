# DEVELOPMENT.md

# Al Bayan Education

Developer Handbook

Version 1.0

---

# 1. Development Philosophy

Seluruh proses pengembangan website Al Bayan Education harus mengikuti prinsip modern software engineering.

Project ini tidak dibangun sebagai website company profile biasa, tetapi sebagai fondasi platform digital yang dapat berkembang menjadi Learning Management System (LMS), Student Portal, hingga Dashboard Administrasi.

Setiap keputusan pengembangan harus mempertimbangkan:

- Readability
- Maintainability
- Scalability
- Security
- Performance
- User Experience

Kecepatan membuat fitur tidak boleh mengorbankan kualitas kode.

---

# 2. General Rules

Seluruh kode harus mudah dibaca.

Seluruh folder harus memiliki tujuan yang jelas.

Tidak diperbolehkan membuat kode yang sulit dipahami hanya demi mengurangi jumlah baris.

Kode harus menjadi dokumentasi itu sendiri.

Gunakan nama variable yang deskriptif.

Contoh.

Benar.

studentProfile

programSchedule

announcementList

Salah.

sp

data

list

temp

abc

---

# 3. Technology Stack

Frontend

React 19

TypeScript

Inertia.js

Tailwind CSS v4

Shadcn UI

Motion (sebelumnya Framer Motion)

Lucide React

React Hook Form

Zod

Embla Carousel

Backend

Laravel 12+

PHP 8.4+

Laravel Mail

Laravel Queue

Laravel Scheduler

Laravel Notifications

Laravel Events

Laravel Policies

Laravel Gates

Database

PostgreSQL

Cache

Redis

Storage

Laravel Storage

Development

Composer

PNPM

Vite

ESLint

Prettier

Laravel Pint

Git

GitHub

Deployment

Nginx

PHP-FPM

Supervisor

Cloudflare

SSL

---

# 4. Folder Structure

resources/

    js/

        components/

        layouts/

        pages/

        hooks/

        services/

        types/

        utils/

        constants/

        assets/

Components tidak boleh disimpan di folder pages.

Pages tidak boleh berisi business logic.

Layout hanya bertugas mengatur struktur halaman.

---

# 5. Component Rules

Semua komponen wajib reusable.

Button

Input

Textarea

Select

Checkbox

Dialog

Modal

Toast

Card

Badge

Avatar

Pagination

Navbar

Sidebar

Footer

Gallery Card

Program Card

FAQ Card

Announcement Card

Statistic Card

Tidak boleh membuat komponen yang sama lebih dari satu kali.

---

# 6. React Rules

Gunakan Functional Component.

Gunakan TypeScript Strict Mode.

Gunakan Custom Hook bila logic digunakan lebih dari satu tempat.

Gunakan Lazy Loading untuk halaman besar.

Gunakan Dynamic Import bila memungkinkan.

Pisahkan UI dan Logic.

Komponen maksimal memiliki satu tanggung jawab.

---

# 7. Tailwind Rules

Gunakan Utility Class.

Tidak menggunakan CSS manual jika dapat diselesaikan dengan Tailwind.

Tidak menggunakan !important.

Tidak menggunakan Inline Style.

Gunakan Variants.

Gunakan Design System.

Seluruh warna harus berasal dari Theme.

---

# 8. Animation Rules

Semua animasi menggunakan Motion (sebelumnya Framer Motion).

Animation hanya digunakan untuk membantu UX.

Durasi.

0.3

0.4

0.5 detik

Hover.

Scale.

Opacity.

Slide.

Fade.

Tidak menggunakan animasi yang berlebihan.

---

# 9. Authentication Rules

Gunakan Laravel Authentication.

Password wajib di-hash.

Email Verification menggunakan OTP.

OTP terdiri dari enam digit.

OTP berlaku lima menit.

OTP dikirim menggunakan Queue.

OTP disimpan pada Redis.

Tidak disimpan permanen pada PostgreSQL.

---

# 10. Login Rules

Login menggunakan.

Email

atau

NIM

Password.

Role diperiksa setelah login.

Admin diarahkan ke Dashboard Admin.

Student diarahkan ke Dashboard Student.

---

# 11. Register Rules

Register menggunakan tiga langkah.

Step 1.

Email.

Password.

Konfirmasi Password.

Step 2.

Nama.

NIM.

Tanggal Lahir.

Jenis Kelamin.

Step 3.

Persetujuan.

Peraturan Yayasan.

Privacy Policy.

Terms.

Seluruh data divalidasi sebelum melanjutkan ke langkah berikutnya.

---

# 12. Validation Rules

Frontend.

Zod.

Backend.

Laravel Form Request.

Double Validation wajib dilakukan.

Tidak boleh hanya mengandalkan validasi frontend.

---

# 13. Controller Rules

Controller hanya menerima Request.

Controller tidak boleh berisi Business Logic.

Controller hanya memanggil Service.

Contoh.

Controller

↓

RegisterService

↓

Repository

↓

Model

↓

Database

---

# 14. Service Rules

Seluruh Business Logic berada pada Service.

Contoh.

RegisterService

LoginService

OTPService

ProfileService

GalleryService

ProgramService

AnnouncementService

DashboardService

---

# 15. Repository Rules

Repository hanya bertugas melakukan Query Database.

Tidak boleh melakukan Validasi.

Tidak boleh mengirim Email.

Tidak boleh membuat Business Logic.

---

# 16. Database Rules

Database utama menggunakan PostgreSQL.

Migration wajib digunakan.

Seeder wajib digunakan.

Factory wajib digunakan.

Tidak boleh membuat tabel langsung dari PostgreSQL GUI.

---

# 17. Redis Rules

Redis digunakan untuk.

OTP

Session

Queue

Cache

Rate Limiter

Notification Cache

Dashboard Cache

Redis bukan database utama.

---

# 18. Queue Rules

Semua proses berat harus masuk Queue.

Email OTP

Email Broadcast

Generate PDF

Generate Certificate

Notification

Queue Driver menggunakan Redis.

---

# 19. Security Rules

Password Hash.

CSRF Protection.

Middleware Authentication.

Middleware Guest.

Rate Limiter.

SQL Injection Protection.

XSS Protection.

Mass Assignment Protection.

Input Sanitization.

Validation Request.

HTTPS Only.

Secure Cookie.

---

# 20. Asset Rules

Logo.

public/image/logo.png

Hero Video.

public/image/background1.mp4

Gallery.

public/image/gallery/

Program.

public/image/program/

Asset tidak boleh diletakkan sembarangan.

---

# 21. Performance Rules

Target Lighthouse.

Performance.

90+

Accessibility.

95+

SEO.

95+

Best Practices.

95+

Gunakan.

Lazy Loading.

Image Compression.

Code Splitting.

Dynamic Import.

Redis Cache.

Preload Font.

Preload Hero Video Metadata.

---

# 22. Responsive Rules

Desktop.

Laptop.

Tablet.

Mobile.

Semua halaman wajib diuji.

Tidak boleh ada Horizontal Scroll.

Tidak boleh ada Overflow yang tidak disengaja.

---

# 23. Accessibility Rules

Alt Image.

Keyboard Navigation.

Visible Focus.

Label Form.

Semantic HTML.

Color Contrast.

ARIA bila diperlukan.

---

# 24. Git Rules

Gunakan Conventional Commit.

Contoh.

feat:

fix:

refactor:

style:

docs:

perf:

test:

chore:

Jangan melakukan commit dengan pesan seperti.

update

fix bug

coba

123

test

---

# 25. Code Style

Gunakan ESLint.

Gunakan Prettier.

Gunakan Laravel Pint.

Seluruh kode harus memiliki format yang konsisten.

---

# 26. Error Handling

Gunakan Exception.

Jangan menggunakan try catch berlebihan.

Gunakan Logging.

Jangan menampilkan Error Internal kepada pengguna.

---

# 27. Logging

Gunakan Laravel Log.

Log Authentication.

Log Error.

Log OTP.

Log Activity.

Log Security Event.

---

# 28. Email Strategy

Gunakan Laravel Mail.

SMTP.

Gmail App Password.

Brevo.

Mailgun.

Amazon SES.

Seluruh Email dikirim menggunakan Queue.

---

# 29. Testing

Gunakan.

Feature Test.

Unit Test.

Authentication Test.

OTP Test.

Register Test.

Login Test.

Dashboard Test.

---

# 30. Deployment

Server.

Ubuntu.

Nginx.

PHP-FPM.

Redis.

PostgreSQL.

Supervisor.

SSL.

Cloudflare.

Deployment menggunakan Git.

---

# 31. AI Coding Rules

Seluruh AI Coding wajib mengikuti dokumen berikut.

README.md

PROJECT.md

DESIGN.md

DEVELOPMENT.md

DATABASE.md

AI tidak diperbolehkan membuat struktur baru tanpa mengikuti dokumentasi.

Semua komponen baru harus reusable.

Semua halaman baru harus mengikuti Design System.

Semua fitur baru harus menggunakan arsitektur yang telah ditentukan.

---

# 32. Final Principles

Project ini dibangun dengan filosofi.

Simple.

Modern.

Elegant.

Fast.

Professional.

Readable.

Maintainable.

Reusable.

Scalable.

Seluruh keputusan pengembangan harus selalu mengacu pada filosofi tersebut.

Apabila terdapat dua solusi yang sama baiknya, pilih solusi yang lebih sederhana, lebih mudah dirawat, dan lebih konsisten dengan arsitektur proyek.

---

# Development Checklist

Sebelum sebuah fitur dinyatakan selesai, pastikan:

✓ Responsive di Desktop, Tablet, dan Mobile.

✓ Tidak ada error TypeScript.

✓ Tidak ada warning ESLint.

✓ Tidak ada duplikasi komponen.

✓ Validasi Frontend dan Backend berjalan.

✓ Menggunakan Design System.

✓ Menggunakan Component Reusable.

✓ Menggunakan Service Layer.

✓ Menggunakan Repository Layer.

✓ Aman terhadap input tidak valid.

✓ Performa tetap terjaga.

✓ Dokumentasi diperbarui jika diperlukan.

---

# End of Development Handbook