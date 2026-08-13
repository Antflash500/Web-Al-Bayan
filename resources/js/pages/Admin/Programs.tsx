import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    BookOpen,
    Clock,
    FileText,
    Layers,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { cropSquare, mediaUrl } from '@/lib/image';
import type { ProgramKursus } from '@/types/models';

const inputCls =
    'w-full rounded-[var(--radius-input)] border border-input bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30';
const labelCls = 'mb-1.5 block text-xs font-medium text-muted';

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

const emptyForm = {
    nama_program: '',
    deskripsi: '',
    instruktur: '',
    tingkat: 'pemula',
    durasi_jam: '',
    harga: '',
    requires_dorm: false,
    status: 'aktif',
    thumbnail: null as Blob | null,
};

export default function Programs({
    programs,
    stats,
    flash,
}: {
    programs: ProgramKursus[];
    stats: { total: number; aktif: number; materi: number };
    flash?: { success?: string };
}) {
    const { errors } = usePage().props as { errors: Record<string, string> };
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<ProgramKursus | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [preview, setPreview] = useState<string>('');
    const [cropping, setCropping] = useState(false);

    const openCreate = () => {
        setForm(emptyForm);
        setPreview('');
        setCreating(true);
    };

    const openEdit = (p: ProgramKursus) => {
        setForm({
            nama_program: p.nama_program,
            deskripsi: p.deskripsi ?? '',
            instruktur: p.instruktur ?? '',
            tingkat: String(p.tingkat ?? 'pemula').toLowerCase(),
            durasi_jam: String(p.durasi_jam ?? ''),
            harga: p.harga !== undefined && p.harga !== null ? String(p.harga) : '',
            requires_dorm: Boolean(p.requires_dorm ?? false),
            status: p.status,
            thumbnail: null,
        });
        setPreview(mediaUrl(p.thumbnail));
        setEditing(p);
    };

    const pickThumbnail = async (file?: File) => {
        if (!file) {
            setForm((d) => ({ ...d, thumbnail: null }));
            setPreview('');
            return;
        }
        setCropping(true);
        try {
            const blob = await cropSquare(file);
            if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
            setForm((d) => ({ ...d, thumbnail: blob }));
            setPreview(URL.createObjectURL(blob));
        } catch {
            setForm((d) => ({ ...d, thumbnail: null }));
        } finally {
            setCropping(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('nama_program', form.nama_program);
        data.append('deskripsi', form.deskripsi);
        data.append('instruktur', form.instruktur);
        data.append('tingkat', form.tingkat);
        data.append('durasi_jam', String(form.durasi_jam));
        data.append('harga', String(form.harga === '' ? 0 : form.harga));
        data.append('requires_dorm', form.requires_dorm ? '1' : '0');
        data.append('status', form.status);
        if (form.thumbnail) data.append('thumbnail', form.thumbnail, 'thumbnail.jpg');

        const url = editing ? `/admin/programs/${editing.id}` : '/admin/programs';
        const onSuccess = () => {
            if (editing) {
                setEditing(null);
            } else {
                setCreating(false);
            }
            setForm(emptyForm);
            setPreview('');
        };

        if (editing) {
            router.patch(url, data, { forceFormData: true, onSuccess });
        } else {
            router.post(url, data, { forceFormData: true, onSuccess });
        }
    };

    const destroy = (p: ProgramKursus) => {
        if (window.confirm(`Hapus program "${p.nama_program}"?`)) {
            router.delete(`/admin/programs/${p.id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin | Program" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl text-foreground sm:text-3xl">Program</h1>
                    <p className="mt-1 text-sm text-muted">
                        Daftar program pembelajaran yang tersedia di Al Bayan Education.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    <Plus className="size-4" /> Tambah Program
                </button>
            </div>

            {flash?.success && (
                <p role="status" className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {flash.success}
                </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { label: 'Total Program', value: stats.total, icon: Layers },
                    { label: 'Program Aktif', value: stats.aktif, icon: BookOpen },
                    { label: 'Total Materi', value: stats.materi, icon: FileText },
                ].map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft"
                    >
                        <span className="grid size-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                            <Icon className="size-5" />
                        </span>
                        <div>
                            <p className="font-display text-2xl text-foreground">{value}</p>
                            <p className="text-sm text-muted">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {programs.map((p) => (
                    <div
                        key={p.id}
                        className="flex flex-col rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft"
                    >
                        <div className="relative mb-4 -mt-2 aspect-[16/10] overflow-hidden rounded-xl">
                            {p.thumbnail ? (
                                <img
                                    src={mediaUrl(p.thumbnail)}
                                    alt={p.nama_program}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="grid h-full w-full place-items-center bg-surface text-xs text-muted">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted">
                                {p.kategori?.nama_kategori ?? 'Umum'}
                            </span>
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    p.status === 'aktif'
                                        ? 'bg-secondary/10 text-secondary'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {p.status}
                            </span>
                        </div>
                        <h2 className="mt-3 font-display text-lg leading-snug text-foreground">
                            {p.nama_program}
                        </h2>
                        <p className="mt-1 text-xs text-muted">{p.instruktur ?? 'Tim Al Bayan'}</p>
                        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="size-3.5" /> {p.materi_list_count ?? 0} materi
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5" /> {p.durasi_jam} jam
                            </span>
                            <span className="ml-auto capitalize">{p.tingkat}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => router.get(`/admin/programs/${p.id}/materi`)}
                                className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium transition hover:bg-surface"
                            >
                                <BookOpen className="size-3.5" /> Materi
                            </button>
                            <button
                                type="button"
                                onClick={() => openEdit(p)}
                                className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium transition hover:bg-surface"
                            >
                                <Pencil className="size-3.5" /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => destroy(p)}
                                aria-label={`Hapus ${p.nama_program}`}
                                className="grid size-9 place-items-center rounded-lg text-danger transition hover:bg-danger/5"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(creating || editing) && (
                <Modal title={editing ? 'Edit Program' : 'Tambah Program'} onClose={() => (editing ? setEditing(null) : setCreating(false))}>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className={labelCls} htmlFor="np-thumb">
                                Gambar Program (otomatis di-crop 1:1)
                            </label>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mb-2 aspect-square w-40 rounded-xl border border-border object-cover"
                                />
                            )}
                            <input
                                id="np-thumb"
                                type="file"
                                accept="image/*"
                                className={inputCls}
                                onChange={(e) => pickThumbnail(e.target.files?.[0])}
                            />
                            <p className="mt-1 text-xs text-muted">
                                {cropping
                                    ? 'Memproses gambar ke ukuran 1:1…'
                                    : 'Pilih gambar; akan disimpan sebagai JPEG 1:1.'}
                            </p>
                            {errors.thumbnail && (
                                <p role="alert" className="mt-1 text-xs text-danger">
                                    {errors.thumbnail}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="np-name">
                                Nama Program
                            </label>
                            <input
                                id="np-name"
                                className={inputCls}
                                required
                                value={form.nama_program}
                                onChange={(e) => setForm((d) => ({ ...d, nama_program: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="np-desc">
                                Deskripsi
                            </label>
                            <textarea
                                id="np-desc"
                                rows={3}
                                className={inputCls}
                                value={form.deskripsi}
                                onChange={(e) => setForm((d) => ({ ...d, deskripsi: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="np-instruktur">
                                Instruktur
                            </label>
                            <input
                                id="np-instruktur"
                                className={inputCls}
                                value={form.instruktur}
                                onChange={(e) => setForm((d) => ({ ...d, instruktur: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className={labelCls} htmlFor="np-tingkat">
                                    Tingkat
                                </label>
                                <select
                                    id="np-tingkat"
                                    className={inputCls}
                                    value={form.tingkat}
                                    onChange={(e) => setForm((d) => ({ ...d, tingkat: e.target.value }))}
                                >
                                    <option value="pemula">Pemula</option>
                                    <option value="menengah">Menengah</option>
                                    <option value="lanjutan">Lanjutan</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="np-durasi">
                                    Durasi (jam)
                                </label>
                                <input
                                    id="np-durasi"
                                    type="number"
                                    min={1}
                                    className={inputCls}
                                    required
                                    value={form.durasi_jam}
                                    onChange={(e) => setForm((d) => ({ ...d, durasi_jam: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="np-harga">
                                    Harga (Rp)
                                </label>
                                <input
                                    id="np-harga"
                                    type="number"
                                    min={0}
                                    step={1000}
                                    className={inputCls}
                                    value={form.harga}
                                    onChange={(e) => setForm((d) => ({ ...d, harga: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="np-status">
                                    Status
                                </label>
                                <select
                                    id="np-status"
                                    className={inputCls}
                                    value={form.status}
                                    onChange={(e) => setForm((d) => ({ ...d, status: e.target.value }))}
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="draft">Draft</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>
                        </div>
                        <label className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/40 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={form.requires_dorm}
                                onChange={(e) => setForm((d) => ({ ...d, requires_dorm: e.target.checked }))}
                                className="size-4 accent-secondary"
                            />
                            <span className="text-xs font-medium text-foreground">
                                Program ini membutuhkan asrama (auto-assign ranjang saat pembayaran lunas)
                            </span>
                        </label>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => (editing ? setEditing(null) : setCreating(false))}
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] border border-border px-4 text-sm font-medium transition hover:bg-surface"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                {editing ? 'Simpan Perubahan' : 'Simpan Program'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}