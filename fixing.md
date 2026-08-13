Ubah layout halaman "Profil Saya" mengikuti konsep kotak dalam kotak seperti gambar contoh pertama.

Saat ini semua data berada dalam 1 kotak besar. Saya ingin:

1. Buat 1 kotak besar sebagai container utama.

2. Di dalam kotak besar tersebut buat 2 kotak/card terpisah:

   KOTAK 1: "Data Diri"
   - Judul: Data Diri
   - Di bawah judul beri deskripsi singkat:
     "Kelola data diri dan informasi akun Anda."
   - Isi tetap menggunakan semua data yang sudah ada sekarang:
     Nama Lengkap
     NIK
     Username
     Tanggal Lahir
     Status Akun
     Nomor Telepon / WA
     Jenis Kelamin
     Alamat Lengkap

   KOTAK 2: "Data Orang Tua"
   - Judul: Data Orang Tua
   - Di bawah judul beri deskripsi singkat:
     "Kelola informasi orang tua atau wali Anda."

   Di dalam Data Orang Tua buat 2 bagian:
   
   AYAH
   - Nama Ayah
   - Alamat
   - Pekerjaan
   - Nomor HP

   IBU
   - Nama Ibu
   - Alamat
   - Pekerjaan
   - Nomor HP

3. Kedua kotak/card tersebut harus bisa diedit.

4. Tambahkan tombol "Edit Profil".
   - Saat belum dalam mode edit, data ditampilkan seperti tampilan profil biasa.
   - Saat tombol "Edit Profil" ditekan, field pada Data Diri dan Data Orang Tua menjadi bisa diedit.

5. Saat mode edit aktif, tampilkan tombol "Simpan Perubahan".
   - Tombol ini menyimpan perubahan seperti logic penyimpanan yang sudah ada.
   - Jangan membuat logic penyimpanan baru jika logic existing sudah tersedia.

6. Pertahankan semua data, API, database, validasi, dan logic yang sudah ada.
   Jangan mengubah backend atau struktur data.

7. Fokus perubahan hanya pada layout dan UI halaman Profil Saya.

8. Gunakan desain yang sama dengan website sekarang:
   - warna hijau yang sudah digunakan
   - border lembut
   - rounded corner
   - spacing rapi
   - tampilan modern dan clean
   - responsive desktop dan mobile

Struktur akhirnya:

Kotak Besar
├── Data Diri
│   ├── Judul + deskripsi
│   └── Semua data diri yang sudah ada
│
└── Data Orang Tua
    ├── Judul + deskripsi
    ├── Ayah
    │   ├── Nama
    │   ├── Alamat
    │   ├── Pekerjaan
    │   └── Nomor HP
    │
    └── Ibu
        ├── Nama
        ├── Alamat
        ├── Pekerjaan
        └── Nomor HP

Jangan mengubah halaman lain dan jangan melakukan refactor besar-besaran. Gunakan komponen dan logic yang sudah ada jika memungkinkan.