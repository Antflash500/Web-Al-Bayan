import { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Banknote,
    Building2,
    Camera,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    Download,
    LockKeyhole,
    Upload,
    X,
    XCircle,
} from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface TransaksiItem {
    id: number;
    kode_transaksi: string;
    program_nama: string;
    jumlah: number;
    status: string;
    metode_pembayaran: string;
    has_bukti: boolean;
    bukti_url?: string | null;
    paid_at?: string;
    created_at: string;
}

const REKENING = '0241556254';

const resolveMethod = (metode?: string | null): 'transfer' | 'qris' => {
    const value = (metode ?? '').toLowerCase();
    return value.includes('qris') ? 'qris' : 'transfer';
};

export default function Pembayaran({ transaksi }: { transaksi: TransaksiItem[] }) {
    const [paying, setPaying] = useState<TransaksiItem | null>(null);
    const [method, setMethod] = useState<'transfer' | 'qris'>('transfer');
    const [copied, setCopied] = useState<boolean>(false);

    const { data, setData, post, processing, reset, errors } = useForm<{
        metode: 'transfer' | 'qris';
        bukti: File | null;
    }>({
        metode: 'transfer',
        bukti: null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (paying) {
            const selected = resolveMethod(paying.metode_pembayaran);
            setMethod(selected);
            setData('metode', selected);
            setPreview(null);
            reset('bukti');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paying?.id]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const pickFile = () => fileInputRef.current?.click();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData('bukti', file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
        e.target.value = '';
    };

    const submitProof = () => {
        if (!paying || !data.bukti) return;
        post(`/siswa/pembayaran/${paying.kode_transaksi}/bukti`, {
            onSuccess: () => setPaying(null),
        });
    };

    const getStatusBadge = (item: TransaksiItem) => {
        switch (item.status.toLowerCase()) {
            case 'paid':
            case 'lunas':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="size-3.5" /> Lunas
                    </span>
                );
            case 'failed':
            case 'ditolak':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                        <XCircle className="size-3.5" /> Ditolak Admin
                    </span>
                );
            case 'pending':
                return item.has_bukti ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                        <Clock className="size-3.5" /> Menunggu Konfirmasi Admin
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                        <Clock className="size-3.5" /> Menunggu Pembayaran
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                        <XCircle className="size-3.5" /> {item.status}
                    </span>
                );
        }
    };

    const canPay = (item: TransaksiItem) => {
        const s = item.status.toLowerCase();
        return s === 'pending' && !item.has_bukti;
    };

    const copyRekening = () => {
        navigator.clipboard.writeText(REKENING);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <StudentPortalLayout title="Pembayaran">
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                        Riwayat & Status Pembayaran
                    </h2>
                    <p className="text-xs text-muted">
                        Daftar transaksi dan status pembayaran program Anda.
                    </p>
                </div>

                {transaksi.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                        <div className="divide-y divide-border">
                            {transaksi.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-semibold text-primary">
                                                {item.kode_transaksi}
                                            </span>
                                            {getStatusBadge(item)}
                                            {['paid', 'lunas'].includes(item.status.toLowerCase()) && (
                                                <a
                                                    href={`/siswa/pembayaran/${item.id}/kwitansi`}
                                                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition hover:bg-primary/20"
                                                >
                                                    <Download className="size-3.5" /> Unduh Kwitansi
                                                </a>
                                            )}
                                        </div>
                                        <h3 className="font-display font-bold text-foreground">
                                            {item.program_nama}
                                        </h3>
                                        <p className="text-xs text-muted">
                                            Metode: {item.metode_pembayaran} • Dibuat:{' '}
                                            {item.created_at}
                                        </p>
                                        {canPay(item) && (
                                            <button
                                                type="button"
                                                onClick={() => setPaying(item)}
                                                className="mt-2 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary/90"
                                            >
                                                <CreditCard className="size-4" /> Bayar Sekarang
                                            </button>
                                        )}
                                        {item.status.toLowerCase() === 'failed' && (
                                            <button
                                                type="button"
                                                onClick={() => setPaying(item)}
                                                className="mt-2 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary/90"
                                            >
                                                <CreditCard className="size-4" /> Bayar Ulang
                                            </button>
                                        )}
                                        {item.has_bukti && item.bukti_url && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <img
                                                    src={item.bukti_url}
                                                    alt="Bukti pembayaran"
                                                    className="h-12 w-12 rounded-lg border border-border object-cover"
                                                />
                                                <span className="text-[11px] text-muted">
                                                    Bukti telah diunggah
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <span className="block text-xs text-muted">Total Bayar</span>
                                        <span className="font-display text-lg font-bold text-foreground">
                                            Rp {Number(item.jumlah).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center shadow-sm">
                        <CreditCard className="mx-auto size-12 text-muted/50" />
                        <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                            Belum Ada Transaksi
                        </h3>
                        <p className="mt-1 text-xs text-muted">
                            Riwayat pembayaran Anda akan muncul di sini setelah Anda mendaftar program.
                        </p>
                    </div>
                )}
            </div>

            {paying && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/30 p-4 backdrop-blur-sm sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Bayar transaksi"
                    onClick={() => setPaying(null)}
                >
                    <div
                        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-soft-modal sm:p-7"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-display text-xl font-bold text-foreground">
                                    Selesaikan Pembayaran
                                </h3>
                                <p className="mt-0.5 font-mono text-xs text-muted">
                                    {paying.kode_transaksi} • Rp{' '}
                                    {Number(paying.jumlah).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPaying(null)}
                                aria-label="Tutup"
                                className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-muted transition hover:bg-border"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-5 rounded-2xl border border-border bg-surface/50 p-4">
                            {method === 'transfer' ? (
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/images/BCA.png"
                                        alt="Bank BCA"
                                        className="size-16 shrink-0 rounded-xl object-contain"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="size-4 text-primary" />
                                            <span className="text-xs font-semibold text-muted">Metode: Bank Transfer</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-muted">No. Rek</span>
                                            <span className="font-mono text-sm font-bold text-foreground">
                                                {REKENING}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={copyRekening}
                                                className="grid size-7 shrink-0 place-items-center rounded-md bg-surface text-muted transition hover:bg-border"
                                            >
                                                {copied ? (
                                                    <Check className="size-3.5 text-emerald-500" />
                                                ) : (
                                                    <Copy className="size-3.5" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Building2 className="size-5 text-primary" />
                                            <span className="text-sm font-semibold text-foreground">
                                                Atas Nama Wira Yafi Baswara
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm leading-relaxed text-foreground">
                                        <b>Scan di bawah untuk bayar ya.</b> Setelah berhasil, jangan
                                        lupa <b>screenshot</b> buktinya lalu{' '}
                                        <b>upload di bawah</b>.
                                    </p>
                                    <div className="mx-auto mt-4 overflow-hidden rounded-2xl border border-border bg-white p-3">
                                        <img
                                            src="/images/QRIS.png"
                                            alt="QRIS pembayaran"
                                            className="w-full object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="mb-2 block text-xs font-bold text-foreground">
                                Upload Bukti Pembayaran
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={onFileChange}
                                className="hidden"
                            />
                            {preview ? (
                                <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
                                    <img
                                        src={preview}
                                        alt="Pratinjau bukti"
                                        className="h-16 w-16 rounded-xl object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                            {data.bukti?.name}
                                        </p>
                                        <p className="text-xs text-muted">
                                            Foto siap dikirim untuk dikonfirmasi admin.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset('bukti');
                                            setPreview(null);
                                        }}
                                        aria-label="Hapus foto"
                                        className="grid size-9 shrink-0 place-items-center rounded-full text-danger hover:bg-danger/5"
                                    >
                                        <XCircle className="size-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={pickFile}
                                    className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface/40 py-9 text-center transition hover:border-primary/50 hover:bg-primary/5"
                                >
                                    <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                                        <Upload className="size-6" />
                                    </span>
                                    <span className="text-sm font-bold text-foreground">
                                        Klik untuk pilih foto
                                    </span>
                                    <span className="text-xs text-muted">
                                        Screenshot bukti transfer / QRIS (PNG, JPG)
                                    </span>
                                </button>
                            )}
                            {errors.bukti && (
                                <p className="mt-2 text-xs font-semibold text-danger">
                                    {errors.bukti}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={pickFile}
                                className="flex items-center justify-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-bold text-foreground ring-1 ring-border transition hover:bg-border/60"
                            >
                                <Camera className="size-4" /> Upload
                            </button>
                            <button
                                type="button"
                                onClick={submitProof}
                                disabled={!data.bukti || processing}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <LockKeyhole className="size-4" />
                                {processing ? 'Mengirim...' : 'Kirim'}
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[11px] text-muted">
                            Setelah dikirim, status berubah menjadi "Menunggu Konfirmasi Admin".
                        </p>
                    </div>
                </div>
            )}
        </StudentPortalLayout>
    );
}