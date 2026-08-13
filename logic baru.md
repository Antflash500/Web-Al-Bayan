Tambahkan fitur baru pada Dashboard Siswa berupa "Unduh Data Diri".

Pada bagian dashboard siswa, tambahkan 1 card/kotak baru dengan icon download dan informasi:

Judul:
"Data Diri"

Deskripsi:
"Unduh informasi biodata dan data orang tua Anda."

Tambahkan tombol/icon:
"Unduh Data Diri"

Ketika tombol diklik, sistem harus membuat dan mengunduh file PDF berisi data siswa yang sedang login.

Isi PDF:

AL-BAYAN EDUCATION
BIODATA SISWA

A. DATA DIRI
- Nama Lengkap
- NIK
- Tanggal Lahir
- Jenis Kelamin
- Nomor HP / WhatsApp
- Alamat Lengkap

B. DATA ORANG TUA

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

C. PROGRAM YANG DIIKUTI
- Nama program yang sedang diikuti
- Status program

Gunakan data siswa yang sedang login dan ambil data terbaru dari database/backend. Jangan menggunakan data dummy atau hardcode.

PDF harus memiliki tampilan yang rapi, profesional, dan konsisten dengan identitas visual Al-Bayan Education.

PENTING:
- Jangan mengubah layout dashboard yang sudah ada selain menambahkan card fitur ini.
- Jangan mengubah fitur dashboard lainnya.
- Jangan mengubah logic login.
- Jangan mengubah data siswa yang sudah ada.
- Jangan mengubah database jika tidak diperlukan.
- Jangan mengubah API/endpoint yang sudah berjalan.
- Gunakan logic/backend yang sudah ada jika memungkinkan.
- Pastikan siswa hanya bisa mengunduh data miliknya sendiri.
- Jangan masukkan password, token, ID database, data login, atau data teknis lainnya ke PDF.
- Jika data tertentu belum tersedia/kosong, tampilkan "-" atau "Belum diisi", jangan menggunakan data palsu.
- Pastikan fitur tetap responsive di desktop dan mobile.

Sebelum coding, cek terlebih dahulu struktur project dan cari:
1. File/component Dashboard Siswa.
2. Struktur data siswa yang sedang login.
3. Data Data Diri.
4. Data Orang Tua.
5. Data program siswa.
6. Mekanisme backend/API yang sudah digunakan.

Setelah itu implementasikan fitur dengan perubahan seminimal mungkin dan jangan melakukan refactor besar-besaran.