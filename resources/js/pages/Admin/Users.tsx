import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Mail,
    Plus,
    Pencil,
    Search,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserX,
    X,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Pengguna } from '@/types/models';

const inputCls =
    'w-full rounded-[var(--radius-input)] border border-input bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30';
const labelCls = 'mb-1.5 block text-xs font-medium text-muted';

function RoleSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <select
            aria-label="Ubah peran"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 rounded-[var(--radius-input)] border border-input bg-white px-2 text-xs font-medium text-foreground outline-none transition focus:border-secondary"
        >
            <option value="siswa">Siswa</option>
            <option value="admin">Admin</option>
        </select>
    );
}

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

export default function Users({
    users,
    programs,
    filters,
    flash,
}: {
    users: Pengguna[];
    programs?: { id: number; nama_program: string; slug: string }[];
    filters: { q: string };
    flash?: { success?: string };
}) {
    const [query, setQuery] = useState(filters.q ?? '');
    const [roleDraft, setRoleDraft] = useState<Record<number, string>>({});
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<Pengguna | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const createForm = useRef({
        username: '',
        nama_lengkap: '',
        nik: '',
        email: '',
        nomor_hp: '',
        alamat: '',
        password: '',
        tanggal_lahir: '',
        jenis_kelamin: 'laki_laki',
        role: 'siswa',
    });

    const [createData, setCreateData] = useState(createForm.current);
    const [editData, setEditData] = useState({
        username: '',
        nama_lengkap: '',
        nik: '',
        email: '',
        nomor_hp: '',
        alamat: '',
        password: '',
        tanggal_lahir: '',
        jenis_kelamin: 'laki_laki',
        program_ids: [] as number[],
    });

    const onSearch = (value: string) => {
        setQuery(value);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            router.get('/admin/users', { q: value || undefined }, { preserveState: true, replace: true });
        }, 300);
    };

    const toggleStatus = (u: Pengguna) => {
        router.post(`/admin/users/${u.id}/status`);
    };

    const saveRole = (u: Pengguna) => {
        const role = roleDraft[u.id];
        if (!role || role === u.role) return;
        router.patch(`/admin/users/${u.id}`, { role, status: u.status });
    };

    const destroy = (u: Pengguna) => {
        if (window.confirm(`Hapus pengguna ${u.biodata?.nama_lengkap ?? u.email}?`)) {
            router.delete(`/admin/users/${u.id}`);
        }
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/users', createData, {
            onSuccess: () => {
                setCreating(false);
                setCreateData(createForm.current);
            },
        });
    };

    const openEdit = (u: Pengguna) => {
        setEditData({
            username: u.username ?? '',
            nama_lengkap: u.biodata?.nama_lengkap ?? '',
            nik: u.biodata?.nik ?? '',
            email: u.email,
            nomor_hp: u.biodata?.nomor_hp ?? '',
            alamat: u.biodata?.alamat ?? '',
            password: '',
            tanggal_lahir: u.biodata?.tanggal_lahir?.slice(0, 10) ?? '',
            jenis_kelamin: u.biodata?.jenis_kelamin ?? 'laki_laki',
            program_ids: u.program_ids ?? [],
        });
        setEditing(u);
    };

    const toggleProgram = (programId: number) => {
        setEditData((d) => ({
            ...d,
            program_ids: d.program_ids.includes(programId)
                ? d.program_ids.filter((id) => id !== programId)
                : [...d.program_ids, programId],
        }));
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        router.patch(`/admin/users/${editing.id}`, editData, {
            onSuccess: () => setEditing(null),
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin | Pengguna" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl text-foreground sm:text-3xl">Pengguna</h1>
                    <p className="mt-1 text-sm text-muted">
                        Kelola seluruh pengguna & siswa Al Bayan Education.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                        {users.length} terdaftar
                    </span>
                    <button
                        type="button"
                        onClick={() => setCreating(true)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        <Plus className="size-4" /> Tambah Pengguna
                    </button>
                </div>
            </div>

            {flash?.success && (
                <p role="status" className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {flash.success}
                </p>
            )}

            <div className="mt-6 max-w-md">
                <label className="sr-only" htmlFor="search-users">
                    Cari pengguna
                </label>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                    <input
                        id="search-users"
                        type="search"
                        value={query}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Cari nama atau email..."
                        className="w-full rounded-[var(--radius-input)] border border-input bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                    />
                </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface/60 text-xs uppercase tracking-wider text-muted">
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Pengguna
                                </th>
                                <th scope="col" className="px-5 py-3.5 font-semibold">
                                    Peran
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
                            {users.map((u) => (
                                <tr key={u.id} className="transition hover:bg-surface/40">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                                                {(u.biodata?.nama_lengkap ?? u.email)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-foreground">
                                                    {u.biodata?.nama_lengkap ?? 'Belum lengkap'}
                                                </p>
                                                <p className="flex items-center gap-1 truncate text-xs text-muted">
                                                    <Mail className="size-3" /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {u.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                                                <ShieldCheck className="size-3.5" /> Admin
                                            </span>
                                        ) : (
                                            <RoleSelect
                                                value={roleDraft[u.id] ?? u.role}
                                                onChange={(v) => {
                                                    setRoleDraft((d) => ({ ...d, [u.id]: v }));
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                u.status === 'aktif'
                                                    ? 'bg-secondary/10 text-secondary'
                                                    : 'bg-danger/10 text-danger'
                                            }`}
                                        >
                                            {u.status === 'aktif' ? (
                                                <UserCheck className="size-3.5" />
                                            ) : (
                                                <UserX className="size-3.5" />
                                            )}
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-muted">
                                        {u.created_at
                                            ? new Date(u.created_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : '—'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {roleDraft[u.id] && roleDraft[u.id] !== u.role && (
                                                <button
                                                    type="button"
                                                    onClick={() => saveRole(u)}
                                                    className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90"
                                                >
                                                    Simpan
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => openEdit(u)}
                                                aria-label={`Edit ${u.email}`}
                                                className="grid size-10 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(u)}
                                                className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-button)] border border-border px-3 text-xs font-medium transition hover:bg-surface"
                                            >
                                                {u.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => destroy(u)}
                                                aria-label={`Hapus ${u.email}`}
                                                className="grid size-10 place-items-center rounded-lg text-danger transition hover:bg-danger/5"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <p className="font-display text-xl text-foreground">Tidak ada pengguna</p>
                        <p className="mt-1 text-sm text-muted">Coba kata kunci pencarian lain.</p>
                        <Link
                            href="/admin/users"
                            className="mt-4 inline-flex items-center rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Muat Ulang
                        </Link>
                    </div>
                )}
            </div>

            {creating && (
                <Modal title="Tambah Pengguna" onClose={() => setCreating(false)}>
                    <form onSubmit={submitCreate} className="space-y-4">
                        <div>
                            <label className={labelCls} htmlFor="nu-username">
                                Username
                            </label>
                            <input
                                id="nu-username"
                                className={inputCls}
                                autoComplete="off"
                                required
                                value={createData.username}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, username: e.target.value }))
                                }
                                placeholder="contoh: ahmad.fauzan"
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-name">
                                Nama Lengkap
                            </label>
                            <input
                                id="nu-name"
                                className={inputCls}
                                required
                                value={createData.nama_lengkap}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, nama_lengkap: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-nik">
                                NIK
                            </label>
                            <input
                                id="nu-nik"
                                className={inputCls}
                                value={createData.nik}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, nik: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-email">
                                Email
                            </label>
                            <input
                                id="nu-email"
                                type="email"
                                className={inputCls}
                                value={createData.email}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, email: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-phone">
                                No. HP
                            </label>
                            <input
                                id="nu-phone"
                                className={inputCls}
                                value={createData.nomor_hp}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, nomor_hp: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-address">
                                Alamat
                            </label>
                            <textarea
                                id="nu-address"
                                className={inputCls}
                                rows={2}
                                value={createData.alamat}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, alamat: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-password">
                                Password (min. 8 karakter, huruf & angka)
                            </label>
                            <input
                                id="nu-password"
                                type="password"
                                className={inputCls}
                                required
                                minLength={8}
                                pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                                value={createData.password}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, password: e.target.value }))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelCls} htmlFor="nu-dob">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="nu-dob"
                                    type="date"
                                    className={inputCls}
                                    value={createData.tanggal_lahir}
                                    onChange={(e) =>
                                        setCreateData((d) => ({
                                            ...d,
                                            tanggal_lahir: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="nu-gender">
                                    Jenis Kelamin
                                </label>
                                <select
                                    id="nu-gender"
                                    className={inputCls}
                                    value={createData.jenis_kelamin}
                                    onChange={(e) =>
                                        setCreateData((d) => ({
                                            ...d,
                                            jenis_kelamin: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="laki_laki">Laki-laki</option>
                                    <option value="perempuan">Perempuan</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="nu-role">
                                Peran
                            </label>
                            <select
                                id="nu-role"
                                className={inputCls}
                                value={createData.role}
                                onChange={(e) =>
                                    setCreateData((d) => ({ ...d, role: e.target.value }))
                                }
                            >
                                <option value="siswa">Siswa</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setCreating(false)}
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] border border-border px-4 text-sm font-medium transition hover:bg-surface"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Simpan Pengguna
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {editing && (
                <Modal title="Edit Pengguna" onClose={() => setEditing(null)}>
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div>
                            <label className={labelCls} htmlFor="eu-username">
                                Username
                            </label>
                            <input
                                id="eu-username"
                                className={inputCls}
                                autoComplete="off"
                                value={editData.username}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, username: e.target.value }))
                                }
                                placeholder="contoh: ahmad.fauzan"
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="eu-name">
                                Nama Lengkap
                            </label>
                            <input
                                id="eu-name"
                                className={inputCls}
                                value={editData.nama_lengkap}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, nama_lengkap: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="eu-nik">
                                NIK
                            </label>
                            <input
                                id="eu-nik"
                                className={inputCls}
                                value={editData.nik}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, nik: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="eu-email">
                                Email
                            </label>
                            <input
                                id="eu-email"
                                type="email"
                                className={inputCls}
                                value={editData.email}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, email: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="eu-phone">
                                No. HP
                            </label>
                            <input
                                id="eu-phone"
                                className={inputCls}
                                value={editData.nomor_hp}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, nomor_hp: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="eu-address">
                                Alamat
                            </label>
                            <textarea
                                id="eu-address"
                                className={inputCls}
                                rows={2}
                                value={editData.alamat}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, alamat: e.target.value }))
                                }
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="eu-password">
                                Password baru (min. 8 karakter, huruf & angka; kosongkan bila tidak diubah)
                            </label>
                            <input
                                id="eu-password"
                                type="password"
                                className={inputCls}
                                minLength={8}
                                pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                                value={editData.password}
                                onChange={(e) =>
                                    setEditData((d) => ({ ...d, password: e.target.value }))
                                }
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelCls} htmlFor="eu-dob">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="eu-dob"
                                    type="date"
                                    className={inputCls}
                                    value={editData.tanggal_lahir}
                                    onChange={(e) =>
                                        setEditData((d) => ({ ...d, tanggal_lahir: e.target.value }))
                                    }
                                />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="eu-gender">
                                    Jenis Kelamin
                                </label>
                                <select
                                    id="eu-gender"
                                    className={inputCls}
                                    value={editData.jenis_kelamin}
                                    onChange={(e) =>
                                        setEditData((d) => ({
                                            ...d,
                                            jenis_kelamin: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="laki_laki">Laki-laki</option>
                                    <option value="perempuan">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <span className="mb-1.5 block text-xs font-medium text-muted">
                                Akses Program
                            </span>
                            {programs && programs.length > 0 ? (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {programs.map((program) => {
                                        const checked = editData.program_ids.includes(program.id);
                                        return (
                                            <label
                                                key={program.id}
                                                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition ${
                                                    checked
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border bg-surface/50 text-muted hover:border-primary/40 hover:text-foreground'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="size-4 accent-[var(--color-primary)]"
                                                    checked={checked}
                                                    onChange={() => toggleProgram(program.id)}
                                                />
                                                {program.nama_program}
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-muted">
                                    Belum ada program. Tambahkan program dulu di menu Program.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="inline-flex min-h-10 items-center rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-surface"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}