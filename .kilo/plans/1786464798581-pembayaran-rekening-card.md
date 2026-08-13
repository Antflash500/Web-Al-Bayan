# Plan: Ubah Tampilan Informasi Rekening di Modal Pembayaran

## Tujuan
Ganti teks panjang transfer di modal "Selesaikan Pembayaran" menjadi card kecil berisi nomor rekening (dengan tombol copy) dan nama pemilik rekening.

## Konteks
- File: `resources/js/pages/Siswa/Pembayaran.tsx`
- Bank: BCA
- Rekening: `0241556254`
- Atas Nama: `Wira Yafi Baswara`

## Perubahan yang Diperlukan

### 1. Tambah import ikon
Tambah `Building2`, `Copy`, `Check` dari `lucide-react` di baris import yang sudah ada.

### 2. Tambah state copy
Tambahkan `const [copied, setCopied] = useState(false);` bersama state lain (sekitar baris 35).

### 3. Tambah fungsi copy
Tambahkan fungsi sebelum `return`:
```ts
const copyRekening = () => {
    navigator.clipboard.writeText(REKENING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
};
```

### 4. Ganti blok informasi transfer
Hapus blok teks panjang di `method === 'transfer'` (sekitar baris 282-292) dan ganti dengan card:

```tsx
<div className="flex flex-col gap-3">
    <div>
        <span className="text-xs font-semibold text-muted">No Rek</span>
        <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground">
                {REKENING}
            </span>
            <button
                type="button"
                onClick={copyRekening}
                className="grid size-7 place-items-center rounded-md bg-surface text-muted transition hover:bg-border"
            >
                {copied ? (
                    <Check className="size-3.5 text-emerald-500" />
                ) : (
                    <Copy className="size-3.5" />
                )}
            </button>
        </div>
    </div>
    <div className="flex items-center gap-2.5">
        <Building2 className="size-5 text-primary" />
        <span className="text-sm font-semibold text-foreground">
            Atas Nama Wira Yafi Baswara
        </span>
    </div>
</div>
```

Card-nya tetap menggunakan wrapper yang sudah ada:
- `rounded-2xl border border-border bg-surface/50 p-5`

### 5. Jangan diubah
- Logic pembayaran, upload bukti, tombol Upload/Kirim, API, database, atau bagian modal lainnya.

## Validasi
- Build berjalan tanpa error
- Modal "Selesaikan Pembayaran" menampilkan card rekening (No Rek + copy, Atas Nama)
- Klik icon copy menyalin nomor rekening ke clipboard dan ubah icon jadi Check sebentar
