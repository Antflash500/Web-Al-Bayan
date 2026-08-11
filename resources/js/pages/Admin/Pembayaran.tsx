import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    BadgeCheck,
    Banknote,
    CheckCircle2,
    Clock4,
    Eye,
    Image as ImageIcon,
    MapPinned,
    X,
    XCircle,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

type StatusKey = 'pending' | 'paid' | 'failed' | 'semua';

interface TransaksiItem {
    id: number;
    kode_transaksi: string;
    user_id: number;
    user_nama: string;
    user_email: string | null;
    program_nama: string;
    jumlah: number;
    status: string;
    metode_pembayaran: string;
    has_bukti: boolean;
    bukti_url: string | null;
    paid_at: string | null;
    verified_at: string | null;
    created_at: string | null;
}

const statusMeta: Record<'pending' | 'paid' | 'failed', { label: string; cls: string; icon: typeof Clock4 }> =
    {
        pending: {
            label: 'Menunggu Konfirmasi',
            cls: 'bg-amber-100 text-amber-800',
            icon: Clock4,
        },
        paid: {
            label: 'Lunas',
            cls: 'bg-emerald-100 text-emerald-800',
            icon: CheckCircle2,
        },
        failed: {
            label: 'Ditolak',
            cls: 'bg-red-100 text-red-800',
            icon: XCircle,
        },
    };

const tabs: { key: StatusKey; label: string }[] = [
    { key: 'pending', label: 'Menunggu' },
    { key: 'paid', label: 'Lunas' },
    { key: 'failed', label: 'Ditolak' },
    { key: 'semua', label: 'Semua' },
];

export default function Pembayaran({
    transaksi,
    activeStatus,
    counts,
    flash,
}: {
    transaksi: TransaksiItem[];
    activeStatus: string;
    counts: { pending: number; paid: number; failed: number; semua: number };
    flash?: { success?: string };
}) {
    const [detail, setDetail] = useState<TransaksiItem | null>(null);
    const [busy, setBusy] = useState(false);

    const setStatusTab = (status: StatusKey) => {
        router.get(
            '/admin/pembayaran',
            { status: status === 'pending' ? undefined : status },
            { preserveState: true, replace: true }
        );
    };

    const approve = (item: TransaksiItem) => {
        if (window.confirm(`Setujui pembayaran ${item.kode_transaksi}? Program siswa akan diaktifkan.`)) {
            setBusy(true);
            router.post(
                `/admin/pembayaran/${item.id}/approve`,
                {},
                {
                    onFinish: () => {
                        setDetail(null);
                        setBusy(false);
                    },
                }
            );
        }
    };

    const reject = (item: TransaksiItem) => {
        if (window.confirm(`Tolak pembayaran ${item.kode_transaksi}?`)) {
            setBusy(true);
            router.post(
                `/admin/pembayaran/${item.id}/reject`,
                {},
                {
                    onFinish: () => {
                        setDetail(null);
                        setBusy(false);
                    },
                }
            );
        }
    };

    const activeKey = tabs.some((t) => t.key === activeStatus)
        ? (activeStatus as StatusKey)
        : 'pending';

    return (
        <AdminLayout>
            <Head title="Admin | Pembayaran" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl text-foreground sm:text-3xl">Pembayaran</h1>
                    <p className="mt-1 text-sm text-muted">
                        Konfirmasi pembayaran siswa dengan melihat bukti yang diunggah.
                    </p>
                </div>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    {transaksi.length} data
                </span>
            </div>

            {flash?.success && (
                <p
                    role="status"
                    className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary"
                >
                    {flash.success}
                </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setStatusTab(tab.key)}
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition',
                            activeKey === tab.key
                                ? 'bg-primary text-white shadow-soft'
                                : 'bg-white text-muted ring-1 ring-inset ring-border hover:text-foreground'
                        )}
                    >
                        {tab.label}
                        <span
                            className={cn(
                                'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                                activeKey === tab.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-surface text-muted'
                            )}
                        >
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-muted">
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Siswa
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Program
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Metode
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Bukti
                                </th>
                                <th scope="col" className="px-5 py-3.5 text-right font-semibold">
                                    Jumlah
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Status
                                </th>
                                <th scope="col" className="px-5 py-3.5 text-right font-semibold">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {transaksi.map((item) => {
                                const status = item.status as 'pending' | 'paid' | 'failed';
                                const meta = statusMeta[status] ?? statusMeta.pending;
                                const StatusIcon = meta.icon;
                                const isPending = item.status === 'pending';
                                return (
                                    <tr key={item.id} className="transition hover:bg-surface/40">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                                                    {item.user_nama.charAt(0).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-foreground">
                                                        {item.user_nama}
                                                    </p>
                                                    <p className="truncate text-xs text-muted">
                                                        {item.user_email ?? '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-foreground">
                                                {item.program_nama}
                                            </p>
                                            <p className="font-mono text-[11px] text-muted">
                                                {item.kode_transaksi}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                                                {item.metode_pembayaran.toLowerCase().includes('qris') ? (
                                                    <MapPinned className="size-3.5 text-primary" />
                                                ) : (
                                                    <Banknote className="size-3.5 text-primary" />
                                                )}
                                                {item.metode_pembayaran}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.has_bukti && item.bukti_url ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setDetail(item)}
                                                    aria-label={`Lihat bukti ${item.kode_transaksi}`}
                                                    className="group relative block h-12 w-12 overflow-hidden rounded-xl border border-border"
                                                >
                                                    <img
                                                        src={item.bukti_url}
                                                        alt="Bukti pembayaran"
                                                        className="h-full w-full object-cover transition group-hover:scale-110"
                                                    />
                                                    <span className="absolute inset-0 grid place-items-center bg-primary/40 text-white opacity-0 transition group-hover:opacity-100">
                                                        <Eye className="size-4" />
                                                    </span>
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-muted">
                                                    <ImageIcon className="size-3.5" /> Belum ada
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right font-display text-sm font-bold text-foreground">
                                            Rp {Number(item.jumlah).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                                                    meta.cls
                                                )}
                                            >
                                                <StatusIcon className="size-3.5" />
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.has_bukti && item.bukti_url && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDetail(item)}
                                                        className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] border border-border px-3 text-xs font-medium transition hover:bg-surface"
                                                    >
                                                        <Eye className="size-3.5" /> Lihat
                                                    </button>
                                                )}
                                                {isPending && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => approve(item)}
                                                            className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-500"
                                                        >
                                                            <BadgeCheck className="size-3.5" /> Terima
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => reject(item)}
                                                            className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] border border-danger/30 px-3 text-xs font-medium text-danger transition hover:bg-danger/5"
                                                        >
                                                            <XCircle className="size-3.5" /> Tolak
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {transaksi.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="font-display text-xl text-foreground">Tidak ada data</p>
                        <p className="mt-1 text-sm text-muted">
                            Tidak ada transaksi dengan status ini.
                        </p>
                    </div>
                )}
            </div>

            {detail && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Detail pembayaran"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <button
                        type="button"
                        aria-label="Tutup"
                        className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-sm"
                        onClick={() => setDetail(null)}
                    />
                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-xl text-foreground">Detail Pembayaran</h2>
                            <button
                                type="button"
                                onClick={() => setDetail(null)}
                                aria-label="Tutup"
                                className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {detail.bukti_url ? (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface/40">
                                <img
                                    src={detail.bukti_url}
                                    alt="Bukti pembayaran"
                                    className="max-h-[45vh] w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="mt-4 grid h-40 place-items-center rounded-2xl border border-dashed border-border bg-surface/40 text-sm text-muted">
                                Belum ada bukti diunggah
                            </div>
                        )}

                        <dl className="mt-4 space-y-2.5 text-sm">
                            {[
                                ['Nama Siswa', detail.user_nama],
                                ['Email', detail.user_email],
                                ['Program', detail.program_nama],
                                ['Kode Transaksi', detail.kode_transaksi],
                                [
                                    'Jumlah',
                                    'Rp ' + Number(detail.jumlah).toLocaleString('id-ID'),
                                ],
                                ['Metode', detail.metode_pembayaran],
                                [
                                    'Status',
                                    (statusMeta[detail.status as 'pending' | 'paid' | 'failed'] ??
                                        statusMeta.pending).label,
                                ],
                                ['Diajukan', detail.created_at],
                                ['Dikonfirmasi', detail.verified_at],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-2.5"
                                >
                                    <dt className="text-xs font-medium text-muted">{label}</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {value ?? '—'}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        {detail.status === 'pending' && (
                            <div className="mt-5 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => reject(detail)}
                                    disabled={busy}
                                    className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] border border-danger/30 px-4 text-sm font-medium text-danger transition hover:bg-danger/5 disabled:opacity-50"
                                >
                                    <XCircle className="size-4" /> Tolak
                                </button>
                                <button
                                    type="button"
                                    onClick={() => approve(detail)}
                                    disabled={busy}
                                    className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                                >
                                    <BadgeCheck className="size-4" />
                                    {busy ? 'Memproses...' : 'Terima & Aktifkan'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}