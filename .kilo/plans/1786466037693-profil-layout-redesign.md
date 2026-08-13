# Plan: Redesign Halaman Profil Saya (Kotak dalam Kotak + Data Orang Tua)

## Ringkasan
Ubah layout halaman `Siswa/Profil.tsx` dari 1 form besar menjadi container dengan 2 card: **Data Diri** dan **Data Orang Tua**. Tambah mode edit + tombol Simpan. Tambah kolom database untuk data orang tua.

---

## Konteks
- File: `resources/js/pages/Siswa/Profil.tsx`
- Controller: `app/Http/Controllers/Siswa/SiswaProfilController.php`
- Model: `app/Models/StudentProfile.php`, `app/Models/User.php`
- Tabel: `student_profiles`
- Design system: hijau (`primary`), border lembut, rounded corner, spacing rapi

---

## Langkah 1: Database Migration
Buat migration baru untuk menambah kolom data orang tua.

**Pilihan:** Tambah 8 kolom ke tabel `student_profiles` (lebih simple, 1-to-1 dengan user).
- `father_name` (nullable, string 100)
- `father_address` (nullable, string 255)
- `father_occupation` (nullable, string 100)
- `father_phone` (nullable, string 20)
- `mother_name` (nullable, string 100)
- `mother_address` (nullable, string 255)
- `mother_occupation` (nullable, string 100)
- `mother_phone` (nullable, string 20)

**File:** `database/migrations/YYYY_MM_DD_HHMMSS_add_parent_data_to_student_profiles_table.php`

---

## Langkah 2: Update Model
- **StudentProfile:** tambah 8 kolom ke `$fillable`
- **User:** tidak perlu diubah (relasi sudah ada `profile()`)

---

## Langkah 3: Update Controller
`SiswaProfilController.php`:
- `index()`: load data orang tua dari `$user->profile` dan kirim ke frontend
- `update()`: tambah validasi + save untuk 8 field baru
  - Semua nullable (siswa bisa mengisi nanti)
  - Tambah log aktivitas jika ada perubahan data orang tua
  - Pertahankan logic existing untuk `phone` dan `address`

---

## Langkah 4: Restructure Frontend (Profil.tsx)
### Layout baru:
```
Container besar (rounded-3xl, border-border, bg-white, p-6)
├── Card 1: Data Diri
│   ├── Judul "Data Diri" + deskripsi "Kelola data diri..."
│   └── Grid fields (Nama, NIK, Username, Tanggal Lahir, Status Akun, Phone, Jenis Kelamin, Alamat)
│
├── Card 2: Data Orang Tua
│   ├── Judul "Data Orang Tua" + deskripsi "Kelola informasi orang tua..."
│   ├── Sub-bagian AYAH (Nama, Alamat, Pekerjaan, HP)
│   └── Sub-bagian IBU (Nama, Alamat, Pekerjaan, HP)
│
└── Action bar (Edit Profil / Simpan Perubahan)

Card Ubah Password (tetap ada di bawah, tidak diubah)
```

### State management:
- `isEditing: boolean` — true saat mode edit aktif
- Saat `!isEditing`: semua field ditampilkan sebagai display (input disabled / plain text)
- Saat `isEditing`: field editable menjadi input biasa

### Form submission:
- Satu form untuk Data Diri + Data Orang Tua
- Submit ke `/siswa/profil` (existing endpoint, updated backend)
- Pertahankan tab "Ubah Password" dengan logic existing-nya

---

## Langkah 5: Design & Styling
- Card: `rounded-2xl border border-border bg-surface/50 p-5`
- Judul card: `text-sm font-bold text-foreground`
- Deskripsi: `text-xs text-muted`
- Label field: `text-xs font-semibold text-muted`
- Input: `w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs`
- Tombol Edit: `bg-primary text-white rounded-xl px-5 py-2.5 text-xs font-bold`
- Tombol Simpan: sama seperti tombol Edit, dengan icon Save
- Responsive: grid `sm:grid-cols-2` untuk Data Diri, stack untuk mobile

---

## Validasi
- Build berjalan tanpa error
- Data orang tua tampil di card terpisah
- Tombol Edit Profil mengaktifkan input
- Tombol Simpan Perubahan menyimpan ke database
- Tab Ubah Password tetap berfungsi
- Responsive di mobile dan desktop

---

## Pertanyaan untuk User (belum dijawab)

**Q1: Field mana yang boleh diedit?**
fixing.md menyebutkan "field pada Data Diri ... menjadi bisa diedit", tapi ada field sensitif seperti Nama Lengkap, NIK, Tanggal Lahir yang biasanya readonly.

Rekomendasi saya:
- **Readonly (tidak bisa diedit):** Nama Lengkap, NIK, Username, Tanggal Lahir, Status Akun, Jenis Kelamin
- **Editable:** Nomor Telepon, Alamat (sesuai logic existing)
- **Data Orang Tua (semua editable):** Nama Ayah/Ibu, Alamat, Pekerjaan, Nomor HP

Apakah oke? Atau kamu ingin semua field termasuk Nama/NIK bisa diedit?

**Q2: Bagaimana dengan tab "Ubah Password"?**
fixing.md hanya menyebutkan 2 card (Data Diri + Data Orang Tua) dan tidak menyebutkan password.

Rekomendasi saya:
- Pertahankan tab system yang ada, tapi di dalam tab "Data Diri" menampilkan 2 card (Data Diri + Data Orang Tua)
- Atau hapus tab, buat single scroll page: Card Data Diri, Card Data Orang Tua, Card Ubah Password

Mana yang kamu pilih?

**Q3: Apakah data orang tua disimpan di tabel `student_profiles` (tambah 8 kolom) atau buat tabel baru `student_parents`?**
Rekomendasi saya: tambah kolom ke `student_profiles` karena lebih simple dan 1-to-1 dengan user.

---

## Catatan
- fixing.md menyebutkan "Jangan mengubah backend atau struktur data" tapi data orang tua belum ada di backend, sehingga migrasi database diperlukan.
- Plan ini menunggu jawaban dari 3 pertanyaan di atas sebelum di-finalize.
