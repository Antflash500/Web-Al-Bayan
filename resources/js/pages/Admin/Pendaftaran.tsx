import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { BadgeCheck, CheckCircle2, Clock4, Eye, X, XCircle } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { cn } from '@/lib/utils';

type RegistrationStatus = 'pending' | 'approved' | 'rejected';

interface DaftarSiswa {
    id: number;
    email: string | null;
    name: string | null;
    nik: string | null;
    birth_date: string | null;
    gender: string | null;
    address: string | null;
    registration_status: RegistrationStatus;
    created_at: string | null;
}

const inputCls =
    'w-full rounded-[var(--radius-input)] border border-input bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30';
const labelCls = 'mb-1.5 block text-xs font-medium text-muted';

const statusMeta: Record<RegistrationStatus, { label: string; cls: string; icon: typeof Clock4 }> = {
    pending: {
        label: 'Menunggu',
        cls: 'bg-amber-100 text-amber-800',
        icon: Clock4,
    },
    approved: {
        label: 'Disetujui',
        cls: 'bg-emerald-100 text-emerald-800',
        icon: CheckCircle2,
    },
    rejected: {
        label: 'Ditolak',
        cls: 'bg-red-100 text-red-800',
        icon: XCircle,
    },
};

function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <button
                type="button"
                aria-label="Tutup"
                className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl text-foreground">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="mt-5">{children}</div>
            </div>
        </div>
    );
}

export default function Pendaftaran({
    pendaftaran,
    activeStatus,
    flash,
}: {
    pendaftaran: DaftarSiswa[];
    activeStatus: string;
    flash?: { success?: string };
}) {
    const [detail, setDetail] = useState<DaftarSiswa | null>(null);
    const [approving, setApproving] = useState<DaftarSiswa | null>(null);
    const [form, setForm] = useState({ username: '', password: '', password_confirmation: '' });
    const [submitting, setSubmitting] = useState(false);

    const setStatusTab = (status: string) => {
        router.get(
            '/admin/pendaftaran',
            { status: status === 'pending' ? undefined : status },
            { preserveState: true, replace: true }
        );
    };

    const confirmApproval = () => {
        if (!approving) return;
        setSubmitting(true);
        router.post(
            `/admin/pendaftaran/${approving.id}/approve`,
            form,
            {
                onSuccess: () => {
                    setApproving(null);
                    setForm({ username: '', password: '', password_confirmation: '' });
                    setSubmitting(false);
                },
                onError: () => setSubmitting(false),
            }
        );
    };

    const reject = (item: DaftarSiswa) => {
        if (window.confirm(`Tolak pendaftaran ${item.name ?? 'siswa'}? Siswa tidak dapat login.`)) {
            router.post(`/admin/pendaftaran/${item.id}/reject`);
        }
    };

    const passwordMismatch =
        form.password.length > 0 && form.password !== form.password_confirmation;

    const canApprove =
        form.username.trim() !== '' &&
        form.password.length >= 8 &&
        /[A-Za-z]/.test(form.password) &&
        /\d/.test(form.password) &&
        !passwordMismatch;

    return (
        <AdminLayout>
            <Head title="Admin | Pendaftaran" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl text-foreground sm:text-3xl">
                        Pendaftaran Siswa
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Tinjau pendaftaran yang menunggu, lalu buatkan username &amp; password
                        siswa agar dapat login.
                    </p>
                </div>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    {pendaftaran.length} data
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

            <div className="mt-6 flex gap-2">
                {(['pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setStatusTab(status)}
                        className={cn(
                            'rounded-full px-4 py-2 text-xs font-bold transition',
                            activeStatus === status
                                ? 'bg-primary text-white shadow-soft'
                                : 'bg-white text-muted ring-1 ring-inset ring-border hover:text-foreground'
                        )}
                    >
                        {statusMeta[status].label}
                    </button>
                ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-muted">
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Siswa
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    NIK
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Detail
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Status
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Terdaftar
                                </th>
                                <th scope="col" className="px-5 py-3.5 text-right font-semibold">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pendaftaran.map((item) => {
                                const meta = statusMeta[item.registration_status];
                                const StatusIcon = meta.icon;
                                return (
                                    <tr key={item.id} className="transition hover:bg-surface/40">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                                                    {(item.name ?? 'S').charAt(0).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-foreground">
                                                        {item.name ?? 'Tanpa nama'}
                                                    </p>
                                                    <p className="truncate text-xs text-muted">
                                                        {item.email ?? 'Belum ada email'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-foreground">
                                            {item.nik ?? '—'}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-muted">
                                            <p>
                                                Lahir:{' '}
                                                {item.birth_date ??
                                                    '—'}
                                            </p>
                                            <p>
                                                {item.gender === 'female'
                                                    ? 'Perempuan'
                                                    : item.gender === 'male'
                                                      ? 'Laki-laki'
                                                      : '—'}
                                            </p>
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
                                        <td className="px-5 py-4 text-xs text-muted">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      }
                                                  )
                                                : '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setDetail(item)}
                                                    aria-label={`Lihat detail ${item.name}`}
                                                    className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] border border-border px-3 text-xs font-medium transition hover:bg-surface"
                                                >
                                                    <Eye className="size-3.5" /> Detail
                                                </button>
                                                {item.registration_status === 'pending' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setForm({
                                                                    username: '',
                                                                    password: '',
                                                                    password_confirmation: '',
                                                                });
                                                                setApproving(item);
                                                            }}
                                                            className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90"
                                                        >
                                                            <BadgeCheck className="size-3.5" /> Setujui
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

                {pendaftaran.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="font-display text-xl text-foreground">Tidak ada data</p>
                        <p className="mt-1 text-sm text-muted">
                            Tidak ada pendaftaran dengan status ini.
                        </p>
                    </div>
                )}
            </div>

            {detail && (
                <Modal title="Detail Pendaftaran" onClose={() => setDetail(null)}>
                    <dl className="space-y-3 text-sm">
                        {[
                            ['Nama Lengkap', detail.name],
                            ['NIK', detail.nik],
                            ['Tanggal Lahir', detail.birth_date],
                            [
                                'Jenis Kelamin',
                                detail.gender === 'female'
                                    ? 'Perempuan'
                                    : detail.gender === 'male'
                                      ? 'Laki-laki'
                                      : '—',
                            ],
                            ['Alamat', detail.address],
                            [
                                'Status',
                                statusMeta[detail.registration_status].label,
                            ],
                            [
                                'Waktu Registrasi',
                                detail.created_at
                                    ? new Date(detail.created_at).toLocaleString('id-ID')
                                    : '—',
                            ],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="flex flex-col gap-1 rounded-xl bg-surface px-4 py-3"
                            >
                                <dt className="text-xs font-medium text-muted">{label}</dt>
                                <dd className="text-foreground">{value ?? '—'}</dd>
                            </div>
                        ))}
                    </dl>
                </Modal>
            )}

            {approving && (
                <Modal
                    title="Setujui & Buat Akun"
                    onClose={() => setApproving(null)}
                >
                    <div className="rounded-xl bg-surface px-4 py-3 text-sm">
                        <p className="font-medium text-foreground">{approving.name}</p>
                        <p className="font-mono text-xs text-muted">NIK: {approving.nik}</p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            confirmApproval();
                        }}
                        className="mt-4 space-y-4"
                    >
                        <div>
                            <label className={labelCls} htmlFor="ap-username">
                                Username
                            </label>
                            <input
                                id="ap-username"
                                className={inputCls}
                                autoComplete="off"
                                value={form.username}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, username: e.target.value }))
                                }
                                placeholder="contoh: ahmad.fauzan"
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="ap-password">
                                Password (min. 8 karakter, huruf &amp; angka)
                            </label>
                            <input
                                id="ap-password"
                                type="password"
                                className={inputCls}
                                autoComplete="new-password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, password: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="ap-password-confirm">
                                Konfirmasi Password
                            </label>
                            <input
                                id="ap-password-confirm"
                                type="password"
                                className={inputCls}
                                autoComplete="new-password"
                                value={form.password_confirmation}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        password_confirmation: e.target.value,
                                    }))
                                }
                            />
                            {passwordMismatch && (
                                <p className="mt-1.5 text-xs text-danger">
                                    Konfirmasi password tidak sama.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setApproving(null)}
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] border border-border px-4 text-sm font-medium transition hover:bg-surface"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={!canApprove || submitting}
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? 'Menyetujui...' : 'Setujui & Aktifkan Akun'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}