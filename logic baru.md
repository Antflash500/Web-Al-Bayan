# Rencana Perubahan Logic Login, Register, Akun Siswa, dan Profile

## 1. Tujuan Perubahan

Sistem autentikasi siswa akan diubah secara menyeluruh.

Pada sistem sebelumnya, siswa melakukan proses:

**Register → membuat email/password sendiri → mengisi data pribadi → login**

Pada sistem baru, siswa **tidak lagi membuat username dan password sendiri**.

Sistem baru menggunakan alur:

**Register → mengisi data siswa → konfirmasi data → akun menunggu verifikasi admin → admin membuat username & password → siswa menerima kredensial → siswa dapat login**

Dengan demikian, pembuatan akun login siswa sepenuhnya dikontrol oleh admin.

---

# 2. Perubahan Alur Register

## Alur Lama

### Register Step 1

Siswa memasukkan:

* Email
* Password
* Confirm Password

### Register Step 2

Siswa memasukkan:

* Nama
* Bulan lahir
* Gender

### Register Step 3

Siswa melakukan konfirmasi akhir melalui tampilan checklist/confirmation sebelum membuat akun.

Setelah register selesai, sistem mengarahkan siswa ke proses login.

---

# 3. Alur Register Baru

Register sekarang hanya memiliki **2 tahap**.

## Step 1 - Data Siswa

Siswa harus mengisi data berikut:

1. Nama lengkap
2. NIK
3. Alamat siswa
4. Tanggal lahir
5. Gender

### Detail Field

#### Nama

Field untuk nama lengkap siswa.

Contoh:

`Ahmad Fauzan`

---

#### NIK

Field untuk Nomor Induk Kependudukan Indonesia.

Aturan backend:

* NIK wajib berupa angka.
* Panjang NIK harus tepat **16 digit**.
* Tidak boleh kurang dari 16 digit.
* Tidak boleh lebih dari 16 digit.
* Validasi harus dilakukan di backend/server.
* Validasi tidak boleh hanya mengandalkan frontend.
* Request dengan NIK kurang atau lebih dari 16 digit harus ditolak.
* Logic validasi harus tetap berjalan walaupun frontend dimanipulasi melalui DevTools, API request manual, atau metode lainnya.

Catatan:

> Aturan 16 digit merupakan business rule/backend validation. Tidak perlu menampilkan detail logic validasi tersebut di frontend selain memberikan feedback validasi yang diperlukan kepada pengguna.

---

#### Alamat Siswa

Field berupa textarea/descriptive field karena alamat dapat terdiri dari beberapa bagian.

Contoh:

`Jl. Contoh No. 10, RT 02/RW 03, Desa ..., Kecamatan ..., Kabupaten ...`

Field harus mendukung alamat yang cukup panjang dan tidak menggunakan input satu baris biasa jika tidak diperlukan.

---

#### Tanggal Lahir

Field tanggal lahir.

Sistem menyimpan tanggal lahir secara lengkap, bukan hanya bulan lahir seperti sistem sebelumnya.

Format tampilan dapat menyesuaikan UI, tetapi penyimpanan database harus menggunakan tipe data tanggal yang sesuai.

---

#### Gender

Siswa memilih gender dari pilihan yang telah ditentukan oleh sistem.

---

# 4. Step 2 - Konfirmasi Data

Tampilan konfirmasi yang sebelumnya berada pada **Step 3** dipindahkan menjadi **Step 2**.

Tidak perlu membuat halaman konfirmasi baru dari awal jika komponen lama masih dapat digunakan.

Yang dilakukan:

* Ambil logic dan UI confirmation dari Step 3 lama.
* Pindahkan menjadi Step 2.
* Sesuaikan data yang ditampilkan dengan field register baru.
* Pastikan seluruh data Step 1 dapat diperiksa sebelum dikirim.

Data yang perlu ditampilkan pada halaman konfirmasi:

* Nama
* NIK
* Alamat
* Tanggal lahir
* Gender

Siswa harus dapat memastikan bahwa data yang dimasukkan sudah benar sebelum melakukan submit.

---

# 5. Step Register yang Dihapus

Step 3 **dihapus sepenuhnya**.

Register baru hanya memiliki:

```text
Step 1
Data Siswa
↓
Step 2
Konfirmasi Data
↓
Submit Register
```

Tidak boleh ada lagi:

```text
Step 3
```

Progress indicator, numbering, state management, validation flow, dan routing register juga harus disesuaikan dari 3 tahap menjadi 2 tahap.

---

# 6. Perubahan Setelah Register Berhasil

Setelah siswa berhasil melakukan register, sistem **tidak langsung mengarahkan siswa ke halaman login**.

Alur lama:

```text
Register berhasil
↓
Login
```

Alur baru:

```text
Register berhasil
↓
Halaman informasi
↓
Menunggu konfirmasi admin
```

Halaman tersebut menampilkan pesan:

> **Selamat, akun Anda selesai dibuat. Silakan tunggu konfirmasi admin untuk username/password Anda.**

Tujuan halaman ini adalah memberi tahu siswa bahwa:

* Data registrasi berhasil diterima.
* Siswa belum dapat login.
* Username belum dibuat oleh siswa.
* Password belum dibuat oleh siswa.
* Akun harus diproses oleh admin terlebih dahulu.

Siswa dapat:

* Kembali ke landing page.
* Keluar dari halaman/aplikasi.

Tidak perlu ada proses login otomatis.

---

# 7. Perubahan Konsep Akun Siswa

Pada sistem baru, siswa **tidak membuat kredensial login sendiri**.

Siswa hanya melakukan registrasi data pribadi.

Setelah data masuk ke sistem, status siswa menjadi:

```text
MENUNGGU KONFIRMASI ADMIN
```

Admin kemudian melakukan proses:

```text
Review data siswa
↓
Konfirmasi siswa
↓
Membuat username
↓
Membuat password
↓
Mengaktifkan akun
```

Setelah akun aktif, siswa baru dapat melakukan login.

---

# 8. Admin Bertanggung Jawab Membuat Username dan Password

Pada Admin Panel harus tersedia mekanisme untuk memproses siswa yang baru melakukan registrasi.

Admin dapat melihat daftar siswa dengan status:

```text
Pending / Menunggu Konfirmasi
```

Admin dapat membuka detail data siswa:

* Nama
* NIK
* Alamat
* Tanggal lahir
* Gender
* Status registrasi
* Waktu registrasi
* Data lain yang relevan

Kemudian admin dapat melakukan konfirmasi.

Setelah dikonfirmasi, admin membuat:

* Username
* Password

Kredensial tersebut kemudian menjadi kredensial resmi siswa untuk login.

---

# 9. Perubahan Status Siswa

Sistem sebaiknya menggunakan status yang jelas agar alur akun tidak ambigu.

Contoh status:

```text
pending
```

Artinya siswa baru melakukan registrasi dan belum diproses admin.

```text
approved
```

Artinya data siswa sudah disetujui admin dan akun login sudah dibuat/diaktifkan.

```text
rejected
```

Artinya registrasi ditolak admin.

Jika sistem membutuhkan status tambahan, dapat dibuat sesuai kebutuhan, tetapi jangan membuat status hanya untuk terlihat canggih. Setiap status harus memiliki fungsi dan transisi yang jelas.

Contoh state machine:

```text
REGISTERED
    ↓
PENDING
    ↓
ADMIN REVIEW
    ↓
APPROVED
    ↓
ACCOUNT ACTIVE
```

Jika ditolak:

```text
PENDING
    ↓
REJECTED
```

---

# 10. Perubahan Database

Karena siswa tidak lagi membuat email/password ketika register, struktur database harus disesuaikan.

Jangan hanya mengubah frontend.

Periksa seluruh bagian berikut:

### Student/User Data

Field lama yang berkaitan dengan:

* Email register
* Password register
* Confirm password
* Bulan lahir

harus dievaluasi kembali.

Field baru yang diperlukan:

* `name`
* `nik`
* `address`
* `birth_date`
* `gender`
* `registration_status`

Untuk kredensial login, gunakan struktur autentikasi yang sesuai dengan arsitektur aplikasi.

Password **tidak boleh disimpan dalam bentuk plaintext**.

Password harus menggunakan hashing yang aman melalui mekanisme autentikasi framework.

---

# 11. NIK Database

NIK harus diperlakukan sebagai data identitas yang memiliki panjang tetap 16 digit.

Backend harus memastikan:

```text
length(NIK) = 16
```

NIK juga sebaiknya memiliki constraint database yang mencegah duplikasi jika satu NIK hanya boleh digunakan oleh satu siswa.

Contoh business rule:

```text
1 NIK = 1 Student Registration
```

Dengan demikian, siswa tidak dapat melakukan registrasi berkali-kali menggunakan NIK yang sama.

Validasi harus dilakukan berlapis:

```text
Frontend validation
        ↓
Backend validation
        ↓
Database constraint
```

Frontend hanya untuk UX.

Backend adalah sumber kebenaran.

Database menjadi lapisan perlindungan tambahan.

---

# 12. Perubahan Login

Login tidak lagi menggunakan data yang dibuat siswa saat register.

Login baru menggunakan:

```text
Username
Password
```

Username dan password berasal dari akun yang dibuat/diaktifkan oleh admin.

Alur:

```text
Siswa menerima username/password
↓
Siswa membuka halaman login
↓
Input username
↓
Input password
↓
Backend melakukan autentikasi
↓
Jika valid
↓
Login berhasil
↓
Masuk ke Student Dashboard
```

Jika akun masih:

```text
pending
```

maka siswa tidak boleh login.

Backend harus menolak autentikasi akun yang belum diaktifkan.

---

# 13. Perubahan Profile Siswa

Profile siswa juga harus disesuaikan karena data yang digunakan sekarang berbeda dari sistem lama.

Profile siswa harus menggunakan data registrasi terbaru:

* Nama
* NIK
* Alamat
* Tanggal lahir
* Gender
* Username
* Status akun
* Data siswa lain yang memang diperlukan

Email tidak boleh diasumsikan sebagai identifier utama siswa jika sistem baru memang tidak menggunakan email sebagai kredensial.

Profile juga harus membedakan:

### Data Identitas

```text
Nama
NIK
Alamat
Tanggal lahir
Gender
```

### Data Akun

```text
Username
Status akun
```

Password tidak boleh ditampilkan di profile.

Jika siswa perlu mengganti password di masa depan, buat mekanisme perubahan password tersendiri.

---

# 14. Perubahan Admin Panel

Admin Panel harus mendapatkan fitur baru untuk mengelola siswa hasil registrasi.

Minimal terdapat:

### Daftar Siswa Pending

Menampilkan siswa yang baru melakukan registrasi.

Contoh:

```text
Nama        NIK               Status
Ahmad       1234567890123456  Pending
Budi        3214567890123456  Pending
Citra       1112223334445556  Pending
```

Admin dapat:

```text
Lihat Detail
↓
Review Data
↓
Approve
↓
Buat Username
↓
Buat Password
↓
Aktifkan Akun
```

---

# 15. Validasi Backend yang Wajib Dipertahankan

Semua data yang berasal dari register harus dianggap tidak terpercaya.

Frontend tidak boleh dijadikan sumber validasi utama.

Minimal backend harus memvalidasi:

### Nama

* Required
* Format sesuai aturan aplikasi
* Panjang maksimal sesuai database

### NIK

* Required
* Numeric/string numeric sesuai desain database
* Tepat 16 digit
* Tidak boleh duplikat jika business rule mengharuskannya

### Alamat

* Required
* Panjang maksimal sesuai database

### Tanggal lahir

* Required
* Format tanggal valid

### Gender

* Required
* Hanya menerima nilai yang diperbolehkan sistem

---

# 16. Hal yang Harus Diubah di Codebase

Perubahan jangan hanya dilakukan pada halaman register.

Audit seluruh bagian berikut:

### Frontend

* Register Step 1
* Register Step 2
* Register Step 3
* Register state management
* Form validation
* Confirmation component
* Progress indicator
* Register success page
* Login page
* Student profile
* Student dashboard
* Admin student management

### Backend

* Register endpoint/controller
* Validation/request class
* Authentication logic
* User creation logic
* Student creation logic
* Account activation logic
* Admin approval logic
* Login authorization
* Profile endpoint
* Password handling

### Database

* Users table
* Students table
* Relasi User ↔ Student
* Migration
* Constraints
* Unique NIK
* Account status
* Username
* Password/authentication fields

### Authorization

Pastikan:

```text
Student
≠
Admin
```

Siswa tidak boleh mengakses endpoint admin hanya karena mengetahui URL.

Admin harus memiliki permission yang sesuai untuk:

* Melihat siswa pending
* Menyetujui siswa
* Membuat akun
* Mengaktifkan akun
* Mengelola data siswa

---

# 17. Alur Sistem Final

## Registrasi Siswa

```text
Landing Page
      ↓
Register
      ↓
STEP 1
Data Siswa
      │
      ├── Nama
      ├── NIK
      ├── Alamat
      ├── Tanggal Lahir
      └── Gender
      ↓
STEP 2
Konfirmasi Data
      ↓
Submit
      ↓
Backend Validation
      ↓
Simpan Data
      ↓
Status = PENDING
      ↓
Halaman:
"Selamat, akun Anda selesai dibuat.
Silakan tunggu konfirmasi admin
untuk username/password Anda."
```

---

## Proses Admin

```text
Admin Login
      ↓
Admin Dashboard
      ↓
Daftar Siswa Pending
      ↓
Pilih Siswa
      ↓
Review Data
      ↓
Approve
      ↓
Buat Username
      ↓
Buat Password
      ↓
Aktifkan Account
      ↓
Status = APPROVED / ACTIVE
```

---

## Login Siswa

```text
Student Login
      ↓
Username + Password
      ↓
Backend Authentication
      ↓
Cek Account Status
      ↓
ACTIVE?
   /       \
 NO        YES
 ↓          ↓
Reject     Login
            ↓
     Student Dashboard
```

---

# 18. Prinsip Penting Saat Implementasi

Perubahan ini harus dilakukan sebagai **refactor logic**, bukan sekadar redesign UI.

Aturan implementasi:

1. Jangan menghapus logic lama sebelum mengetahui dependensinya.
2. Audit seluruh flow register lama terlebih dahulu.
3. Identifikasi seluruh database field yang masih digunakan oleh login/register.
4. Identifikasi semua endpoint yang berkaitan dengan authentication.
5. Ubah database melalui migration, bukan manipulasi manual tanpa migration.
6. Backend validation wajib menjadi sumber kebenaran.
7. Jangan percaya validation frontend.
8. NIK wajib tepat 16 digit di backend.
9. NIK tidak boleh duplikat jika satu siswa hanya boleh memiliki satu NIK.
10. Siswa tidak boleh membuat username/password ketika register.
11. Admin menjadi pihak yang membuat/menetapkan kredensial siswa.
12. Akun pending tidak boleh login.
13. Password tidak boleh disimpan plaintext.
14. Password tidak boleh ditampilkan kembali setelah dibuat.
15. Step register berubah dari 3 menjadi 2.
16. Confirmation lama dipindahkan dari Step 3 menjadi Step 2.
17. Step 3 dihapus.
18. Setelah register berhasil, jangan redirect ke login.
19. Tampilkan halaman informasi bahwa akun sedang menunggu konfirmasi admin.
20. Student profile harus disesuaikan dengan struktur data baru.
21. Semua route, controller, service, request validation, migration, model, relationship, dan UI yang bergantung pada struktur lama harus diperiksa.
22. Jangan membuat data dummy atau fallback yang menyamarkan error akibat perubahan struktur.
23. Jangan mengubah desain/fitur lain yang tidak berhubungan dengan perubahan ini.
24. Pertahankan fitur lama yang tidak terkena dampak.
25. Setelah perubahan selesai, lakukan pengujian dari register sampai login menggunakan akun siswa nyata/test account.

---

# 19. Acceptance Criteria

Perubahan dianggap berhasil apabila seluruh kondisi berikut terpenuhi:

### Register

* [ ] Register hanya memiliki 2 step.
* [ ] Step 1 berisi nama, NIK, alamat, tanggal lahir, dan gender.
* [ ] Step 2 merupakan halaman konfirmasi.
* [ ] Step 3 sudah tidak ada.
* [ ] Siswa tidak diminta membuat email/password ketika register.
* [ ] NIK hanya dapat diterima jika tepat 16 digit.
* [ ] Backend tetap menolak NIK yang tidak berjumlah 16 digit meskipun request dimanipulasi.
* [ ] NIK duplikat ditolak sesuai business rule.
* [ ] Data siswa berhasil disimpan.
* [ ] Status awal siswa adalah pending.

### Setelah Register

* [ ] Siswa tidak otomatis login.
* [ ] Siswa tidak diarahkan ke halaman login sebagai langkah berikutnya.
* [ ] Sistem menampilkan pesan bahwa akun telah dibuat dan menunggu konfirmasi admin.
* [ ] Siswa dapat kembali ke landing page.

### Admin

* [ ] Admin dapat melihat siswa pending.
* [ ] Admin dapat melihat data registrasi siswa.
* [ ] Admin dapat menyetujui siswa.
* [ ] Admin dapat membuat username.
* [ ] Admin dapat membuat/menetapkan password.
* [ ] Admin dapat mengaktifkan akun siswa.

### Login

* [ ] Login menggunakan username dan password.
* [ ] Akun pending tidak dapat login.
* [ ] Akun aktif dapat login.
* [ ] Password disimpan menggunakan hashing.
* [ ] Password tidak pernah ditampilkan sebagai plaintext di profile.

### Profile

* [ ] Profile menggunakan data siswa baru.
* [ ] Nama tersedia.
* [ ] NIK tersedia.
* [ ] Alamat tersedia.
* [ ] Tanggal lahir tersedia.
* [ ] Gender tersedia.
* [ ] Username tersedia.
* [ ] Status akun tersedia.
* [ ] Password tidak ditampilkan.

---

# 20. Urutan Pengerjaan yang Disarankan

Jangan mulai dari UI. Itu cara tercepat untuk membuat tampilan cantik yang kemudian harus dibongkar lagi.

Urutan yang lebih aman:

```text
1. Audit authentication & register lama
        ↓
2. Audit database & relationship
        ↓
3. Tentukan struktur database baru
        ↓
4. Buat migration
        ↓
5. Update model & relationship
        ↓
6. Update backend validation
        ↓
7. Update register service/controller
        ↓
8. Update account status logic
        ↓
9. Update admin approval & account creation
        ↓
10. Update login authentication
        ↓
11. Update API/route yang terkait
        ↓
12. Update frontend register
        ↓
13. Pindahkan confirmation menjadi Step 2
        ↓
14. Hapus Step 3
        ↓
15. Buat register-success/pending page
        ↓
16. Update Admin Panel
        ↓
17. Update Student Profile
        ↓
18. Testing end-to-end
        ↓
19. Security/authorization testing
        ↓
20. Cleanup logic lama yang sudah tidak digunakan
```

## Target akhir

Sistem akhirnya memiliki konsep:

> **Siswa mendaftarkan identitasnya, bukan membuat akun login. Admin memverifikasi identitas tersebut dan membuat akun login untuk siswa.**

Dengan model ini, proses pendaftaran dan proses pembuatan akun dipisahkan secara jelas:

```text
REGISTRATION
     ↓
IDENTITY DATA
     ↓
ADMIN VERIFICATION
     ↓
ACCOUNT CREATION
     ↓
LOGIN
```

Ini juga membuat sistem lebih cocok untuk lingkungan sekolah/pondok karena admin tetap memegang kontrol terhadap siapa yang benar-benar mendapatkan akses ke sistem.
