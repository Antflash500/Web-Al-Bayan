import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    ChevronDown,
    ChevronRight,
    Clock,
    FileText,
    Film,
    Image as ImageIcon,
    Link2,
    Pencil,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Materi, MateriKonten } from '@/types/models';

const inputCls =
    'w-full rounded-[var(--radius-input)] border border-input bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30';
const labelCls = 'mb-1.5 block text-xs font-medium text-muted';

function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
        n /= 1024;
        i++;
    }
    return `${n.toFixed(i === 0 || n >= 10 ? 0 : 1)} ${units[i]}`;
}

function youtubeEmbed(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

const tipeLabels: Record<MateriKonten['tipe'], string> = {
    teks: 'Teks',
    pdf: 'PDF',
    video: 'Video',
    gambar: 'Gambar',
    video_link: 'Video Link',
};

const tipeIcons: Record<MateriKonten['tipe'], typeof FileText> = {
    teks: FileText,
    pdf: FileText,
    video: Film,
    gambar: ImageIcon,
    video_link: Link2,
};

function Modal({
    title,
    onClose,
    children,
    wide,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    wide?: boolean;
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
            <div
                className={`relative max-h-[90vh] w-full overflow-y-auto rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft ${
                    wide ? 'max-w-2xl' : 'max-w-lg'
                }`}
            >
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

const emptyBab = {
    judul: '',
    deskripsi: '',
    estimasi_menit: '30',
    status: 'aktif',
    gambar: null as File | null,
    pdf: null as File | null,
    video: null as File | null,
    remove_gambar: false,
    remove_pdf: false,
    remove_video: false,
};

const attachLabels = {
    gambar: { label: 'Upload Gambar', accept: 'image/*', hint: 'JPG, PNG, WebP. Maks 10 MB.' },
    pdf: { label: 'Upload PDF', accept: 'application/pdf', hint: 'File PDF. Maks 50 MB.' },
    video: { label: 'Upload Video', accept: 'video/*', hint: 'MP4, WebM, OGG. Maks 200 MB.' },
} as const;

function AttachmentField({
    field,
    onChange,
    existing,
    removing,
    onRemove,
}: {
    field: 'gambar' | 'pdf' | 'video';
    onChange: (file: File | null) => void;
    existing: { name?: string | null; url?: string | null; size?: number | null };
    removing: boolean;
    onRemove: () => void;
}) {
    const meta = attachLabels[field];
    return (
        <div>
            <label className={labelCls} htmlFor={`pb-${field}`}>
                {meta.label}
            </label>
            <input
                id={`pb-${field}`}
                type="file"
                accept={meta.accept}
                disabled={removing}
                className={inputCls}
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-xs text-muted">{meta.hint}</p>
            {removing && (
                <p className="mt-1 text-xs text-danger">File ini akan dihapus saat disimpan.</p>
            )}
            {!removing && existing.url && (
                <div className="mt-2 flex items-center gap-2">
                    {field === 'gambar' ? (
                        <img src={existing.url} alt="" className="h-14 w-14 rounded-lg border border-border object-cover" />
                    ) : (
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary/10 text-secondary">
                            {field === 'pdf' ? <FileText className="size-5" /> : <Film className="size-5" />}
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{existing.name}</p>
                        <p className="text-xs text-muted">{formatBytes(existing.size)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="grid size-8 shrink-0 place-items-center rounded-lg text-danger transition hover:bg-danger/5"
                        aria-label="Hapus file"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

type KontenForm = {
    tipe: MateriKonten['tipe'];
    judul: string;
    konten: string;
    url: string;
    file: File | null;
};

const emptyKonten: KontenForm = { tipe: 'teks', judul: '', konten: '', url: '', file: null };

export default function ProgramMateri({
    program,
    materis,
    flash,
}: {
    program: { id: number; nama_program: string; slug: string };
    materis: (Materi & { kontens: (MateriKonten & { media_url?: string | null })[] })[];
    flash?: { success?: string };
}) {
    const { errors } = usePage().props as { errors: Record<string, string> };
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [editingBab, setEditingBab] = useState<Materi | null>(null);
    const [creatingBab, setCreatingBab] = useState(false);
    const [babForm, setBabForm] = useState(emptyBab);
    const [editingKonten, setEditingKonten] = useState<MateriKonten | null>(null);
    const [creatingKonten, setCreatingKonten] = useState<Materi | null>(null);
    const [kontenForm, setKontenForm] = useState<KontenForm>(emptyKonten);

    const base = `/admin/programs/${program.id}/materi`;

    const toggle = (id: number) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const openCreateBab = () => {
        setBabForm(emptyBab);
        setCreatingBab(true);
        setEditingBab(null);
    };

    const openEditBab = (m: Materi) => {
        setBabForm({
            judul: m.judul,
            deskripsi: m.deskripsi ?? '',
            estimasi_menit: String(m.estimasi_menit ?? 0),
            status: m.status,
            gambar: null,
            pdf: null,
            video: null,
            remove_gambar: false,
            remove_pdf: false,
            remove_video: false,
        });
        setEditingBab(m);
        setCreatingBab(false);
    };

    const submitBab = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingBab ? `${base}/${editingBab.id}` : base;
        const data = new FormData();
        data.append('judul', babForm.judul);
        data.append('deskripsi', babForm.deskripsi);
        data.append('estimasi_menit', String(Number(babForm.estimasi_menit) || 0));
        data.append('status', babForm.status);
        if (babForm.gambar) data.append('gambar', babForm.gambar);
        if (babForm.pdf) data.append('pdf', babForm.pdf);
        if (babForm.video) data.append('video', babForm.video);
        if (babForm.remove_gambar) data.append('remove_gambar', '1');
        if (babForm.remove_pdf) data.append('remove_pdf', '1');
        if (babForm.remove_video) data.append('remove_video', '1');
        const onSuccess = () => {
            setCreatingBab(false);
            setEditingBab(null);
        };
        if (editingBab) router.patch(url, data, { forceFormData: true, onSuccess });
        else router.post(url, data, { forceFormData: true, onSuccess });
    };

    const destroyBab = (m: Materi) => {
        if (window.confirm(`Hapus bab "${m.judul}" beserta semua kontennya?`)) {
            router.delete(`${base}/${m.id}`);
        }
    };

    const openCreateKonten = (m: Materi) => {
        setKontenForm(emptyKonten);
        setCreatingKonten(m);
        setEditingKonten(null);
    };

    const openEditKonten = (k: MateriKonten) => {
        setKontenForm({
            tipe: k.tipe,
            judul: k.judul ?? '',
            konten: k.konten ?? '',
            url: k.url ?? '',
            file: null,
        });
        setEditingKonten(k);
        setCreatingKonten(null);
    };

    const submitKonten = (e: React.FormEvent) => {
        e.preventDefault();
        const targetMateri = creatingKonten ?? materis.find((m) => m.kontens.some((k) => k.id === editingKonten?.id));
        if (!targetMateri) return;

        const data = new FormData();
        data.append('tipe', kontenForm.tipe);
        data.append('judul', kontenForm.judul);
        data.append('konten', kontenForm.konten);
        data.append('url', kontenForm.url);
        if (kontenForm.file) data.append('file', kontenForm.file);

        const url = editingKonten
            ? `${base}/${targetMateri.id}/konten/${editingKonten.id}`
            : `${base}/${targetMateri.id}/konten`;
        const onSuccess = () => {
            setCreatingKonten(null);
            setEditingKonten(null);
            setExpanded((prev) => new Set(prev).add(targetMateri.id));
        };

        if (editingKonten) router.patch(url, data, { forceFormData: true, onSuccess });
        else router.post(url, data, { forceFormData: true, onSuccess });
    };

    const destroyKonten = (m: Materi, k: MateriKonten) => {
        if (window.confirm(`Hapus konten "${k.judul ?? tipeLabels[k.tipe]}"?`)) {
            router.delete(`${base}/${m.id}/konten/${k.id}`);
        }
    };

    const fieldForTipe = (tipe: MateriKonten['tipe']) => {
        switch (tipe) {
            case 'teks':
                return (
                    <div>
                        <label className={labelCls} htmlFor="pk-konten">
                            Isi Teks
                        </label>
                        <textarea
                            id="pk-konten"
                            rows={6}
                            required
                            className={inputCls}
                            value={kontenForm.konten}
                            onChange={(e) => setKontenForm((d) => ({ ...d, konten: e.target.value }))}
                            placeholder="Tulis isi materi di sini…"
                        />
                    </div>
                );
            case 'video_link':
                return (
                    <div>
                        <label className={labelCls} htmlFor="pk-url">
                            Link Video (YouTube)
                        </label>
                        <input
                            id="pk-url"
                            className={inputCls}
                            required
                            value={kontenForm.url}
                            onChange={(e) => setKontenForm((d) => ({ ...d, url: e.target.value }))}
                            placeholder="https://www.youtube.com/watch?v=…"
                        />
                    </div>
                );
            case 'pdf':
            case 'video':
            case 'gambar':
                return (
                    <div>
                        <label className={labelCls} htmlFor="pk-file">
                            {tipe === 'pdf' ? 'File PDF' : tipe === 'video' ? 'File Video' : 'File Gambar'}
                        </label>
                        <input
                            id="pk-file"
                            type="file"
                            accept={
                                tipe === 'pdf'
                                    ? 'application/pdf'
                                    : tipe === 'video'
                                      ? 'video/*'
                                      : 'image/*'
                            }
                            required={!editingKonten?.file_path}
                            className={inputCls}
                            onChange={(e) => setKontenForm((d) => ({ ...d, file: e.target.files?.[0] ?? null }))}
                        />
                        {editingKonten?.file_path && !kontenForm.file && (
                            <p className="mt-1 text-xs text-muted">
                                File lama akan dipertahankan jika tidak memilih file baru.
                            </p>
                        )}
                    </div>
                );
        }
    };

    return (
        <AdminLayout>
            <Head title={`Admin | Materi ${program.nama_program}`} />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/programs"
                        aria-label="Kembali ke Program"
                        className="grid size-10 place-items-center rounded-lg border border-border text-muted transition hover:bg-surface hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl text-foreground sm:text-3xl">Materi Program</h1>
                        <p className="mt-1 text-sm text-muted">{program.nama_program}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={openCreateBab}
                    className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    <Plus className="size-4" /> Tambah Bab
                </button>
            </div>

            {flash?.success && (
                <p role="status" className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {flash.success}
                </p>
            )}

            <div className="mt-6 space-y-4">
                {materis.length === 0 && (
                    <div className="rounded-[var(--radius-card)] border border-border bg-white p-10 text-center shadow-soft">
                        <p className="text-sm text-muted">
                            Belum ada bab materi. Klik <span className="font-semibold text-foreground">Tambah Bab</span> untuk memulai.
                        </p>
                    </div>
                )}

                {materis.map((m, i) => {
                    const open = expanded.has(m.id);
                    const Icon = open ? ChevronDown : ChevronRight;
                    return (
                        <div
                            key={m.id}
                            className="rounded-[var(--radius-card)] border border-border bg-white shadow-soft"
                        >
                            <div className="flex items-center gap-3 p-4">
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary/10 text-xs font-bold text-secondary">
                                    {i + 1}
                                </span>
                                <button type="button" onClick={() => toggle(m.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                                    <Icon className="size-4 shrink-0 text-muted" />
                                    <span className="truncate font-medium text-foreground">{m.judul}</span>
                                </button>
                                <span
                                    className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${
                                        m.status === 'aktif'
                                            ? 'bg-secondary/10 text-secondary'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {m.status}
                                </span>
                                <span className="hidden items-center gap-1 text-xs text-muted md:flex">
                                    <Clock className="size-3.5" /> {m.estimasi_menit} mnt
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={i === 0}
                                        onClick={() => router.post(`${base}/${m.id}/move/up`)}
                                        aria-label="Naikkan urutan"
                                        className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ArrowUp className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={i === materis.length - 1}
                                        onClick={() => router.post(`${base}/${m.id}/move/down`)}
                                        aria-label="Turunkan urutan"
                                        className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ArrowDown className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openEditBab(m)}
                                        aria-label="Edit bab"
                                        className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => destroyBab(m)}
                                        aria-label="Hapus bab"
                                        className="grid size-8 place-items-center rounded-lg text-danger transition hover:bg-danger/5"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {open && (
                                <div className="border-t border-border p-4">
                                    {m.deskripsi && (
                                        <p className="mb-4 whitespace-pre-wrap text-sm text-muted">{m.deskripsi}</p>
                                    )}
                                    {m.kontens.length === 0 && (
                                        <p className="text-sm text-muted">Belum ada konten pada bab ini.</p>
                                    )}
                                    <div className="space-y-3">
                                        {m.kontens.map((k, ki) => {
                                            const KIcon = tipeIcons[k.tipe];
                                            const kUp = ki === 0;
                                            const kDown = ki === m.kontens.length - 1;
                                            return (
                                                <div
                                                    key={k.id}
                                                    className="rounded-xl border border-border bg-surface/40"
                                                >
                                                    <div className="flex items-center gap-2 px-3 py-2">
                                                        <span className="grid size-7 place-items-center rounded-lg bg-white text-secondary ring-1 ring-border">
                                                            <KIcon className="size-3.5" />
                                                        </span>
                                                        <span className="text-xs font-medium text-foreground">
                                                            {tipeLabels[k.tipe]}
                                                            {k.judul ? ` · ${k.judul}` : ''}
                                                        </span>
                                                        <span className="ml-auto flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={kUp}
                                                                onClick={() => router.post(`${base}/${m.id}/konten/${k.id}/move/up`)}
                                                                aria-label="Naikkan urutan konten"
                                                                className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
                                                            >
                                                                <ArrowUp className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={kDown}
                                                                onClick={() => router.post(`${base}/${m.id}/konten/${k.id}/move/down`)}
                                                                aria-label="Turunkan urutan konten"
                                                                className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
                                                            >
                                                                <ArrowDown className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditKonten(k)}
                                                                aria-label="Edit konten"
                                                                className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-surface"
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => destroyKonten(m, k)}
                                                                aria-label="Hapus konten"
                                                                className="grid size-7 place-items-center rounded-lg text-danger transition hover:bg-danger/5"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-border p-3">
                                                        {k.tipe === 'teks' && (
                                                            <p className="whitespace-pre-wrap text-sm text-foreground">{k.konten}</p>
                                                        )}
                                                        {k.tipe === 'pdf' && k.media_url && (
                                                            <a
                                                                href={k.media_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground transition hover:bg-surface"
                                                            >
                                                                <FileText className="size-4 text-danger" />
                                                                <span className="font-medium">{k.file_name ?? 'Lihat PDF'}</span>
                                                                <span className="text-xs text-muted">{formatBytes(k.file_size)}</span>
                                                            </a>
                                                        )}
                                                        {k.tipe === 'gambar' && k.media_url && (
                                                            <img
                                                                src={k.media_url}
                                                                alt={k.judul ?? 'Gambar'}
                                                                className="max-h-72 rounded-lg border border-border object-contain"
                                                                loading="lazy"
                                                            />
                                                        )}
                                                        {k.tipe === 'video' && k.media_url && (
                                                            <video
                                                                src={k.media_url}
                                                                controls
                                                                preload="metadata"
                                                                className="max-h-72 w-full rounded-lg border border-border bg-black"
                                                            />
                                                        )}
                                                        {k.tipe === 'video_link' && k.url && (
                                                            youtubeEmbed(k.url) ? (
                                                                <iframe
                                                                    src={youtubeEmbed(k.url)!}
                                                                    title={k.judul ?? 'Video'}
                                                                    className="aspect-video w-full rounded-lg border border-border"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={k.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                                                                >
                                                                    <Link2 className="size-4" /> {k.judul ?? 'Buka video'}
                                                                </a>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openCreateKonten(m)}
                                        className="mt-4 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-dashed border-border px-4 text-xs font-medium text-muted transition hover:border-secondary hover:text-secondary"
                                    >
                                        <Plus className="size-3.5" /> Tambah Konten
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {(creatingBab || editingBab) && (
                <Modal
                    title={editingBab ? 'Edit Bab Materi' : 'Tambah Bab Materi'}
                    onClose={() => {
                        setCreatingBab(false);
                        setEditingBab(null);
                    }}
                >
                    <form onSubmit={submitBab} className="space-y-4">
                        <div>
                            <label className={labelCls} htmlFor="pb-judul">
                                Judul Bab
                            </label>
                            <input
                                id="pb-judul"
                                className={inputCls}
                                required
                                value={babForm.judul}
                                onChange={(e) => setBabForm((d) => ({ ...d, judul: e.target.value }))}
                                placeholder="Contoh: Pengenalan Huruf Hijaiyah"
                            />
                        </div>
                        <div>
                            <label className={labelCls} htmlFor="pb-deskripsi">
                                Deskripsi
                            </label>
                            <textarea
                                id="pb-deskripsi"
                                rows={3}
                                className={inputCls}
                                value={babForm.deskripsi}
                                onChange={(e) => setBabForm((d) => ({ ...d, deskripsi: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls} htmlFor="pb-menit">
                                    Estimasi (menit)
                                </label>
                                <input
                                    id="pb-menit"
                                    type="number"
                                    min={0}
                                    className={inputCls}
                                    value={babForm.estimasi_menit}
                                    onChange={(e) => setBabForm((d) => ({ ...d, estimasi_menit: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className={labelCls} htmlFor="pb-status">
                                    Status
                                </label>
                                <select
                                    id="pb-status"
                                    className={inputCls}
                                    value={babForm.status}
                                    onChange={(e) => setBabForm((d) => ({ ...d, status: e.target.value }))}
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="draft">Draft</option>
                                    <option value="arsip">Arsip</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <AttachmentField
                                field="gambar"
                                onChange={(file) => setBabForm((d) => ({ ...d, gambar: file, remove_gambar: false }))}
                                existing={{
                                    name: editingBab?.gambar_name,
                                    url: editingBab?.gambar_url,
                                    size: editingBab?.gambar_size,
                                }}
                                removing={babForm.remove_gambar}
                                onRemove={() => setBabForm((d) => ({ ...d, remove_gambar: true, gambar: null }))}
                            />
                            <AttachmentField
                                field="pdf"
                                onChange={(file) => setBabForm((d) => ({ ...d, pdf: file, remove_pdf: false }))}
                                existing={{
                                    name: editingBab?.pdf_name,
                                    url: editingBab?.pdf_url,
                                    size: editingBab?.pdf_size,
                                }}
                                removing={babForm.remove_pdf}
                                onRemove={() => setBabForm((d) => ({ ...d, remove_pdf: true, pdf: null }))}
                            />
                            <AttachmentField
                                field="video"
                                onChange={(file) => setBabForm((d) => ({ ...d, video: file, remove_video: false }))}
                                existing={{
                                    name: editingBab?.video_name,
                                    url: editingBab?.video_url,
                                    size: editingBab?.video_size,
                                }}
                                removing={babForm.remove_video}
                                onRemove={() => setBabForm((d) => ({ ...d, remove_video: true, video: null }))}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setCreatingBab(false);
                                    setEditingBab(null);
                                }}
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] border border-border px-4 text-sm font-medium transition hover:bg-surface"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                {editingBab ? 'Simpan Perubahan' : 'Simpan Bab'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {(creatingKonten || editingKonten) && (
                <Modal
                    title={editingKonten ? 'Edit Konten' : 'Tambah Konten'}
                    onClose={() => {
                        setCreatingKonten(null);
                        setEditingKonten(null);
                    }}
                >
                    <form onSubmit={submitKonten} className="space-y-4">
                        <div>
                            <label className={labelCls}>Tipe Konten</label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {(Object.keys(tipeLabels) as MateriKonten['tipe'][]).map((tipe) => {
                                    const active = kontenForm.tipe === tipe;
                                    const TIcon = tipeIcons[tipe];
                                    return (
                                        <button
                                            key={tipe}
                                            type="button"
                                            onClick={() => setKontenForm((d) => ({ ...d, tipe }))}
                                            className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                                                active
                                                    ? 'border-secondary bg-secondary/10 text-secondary'
                                                    : 'border-border text-muted hover:bg-surface'
                                            }`}
                                        >
                                            <TIcon className="size-3.5" /> {tipeLabels[tipe]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {kontenForm.tipe !== 'teks' && (
                            <div>
                                <label className={labelCls} htmlFor="pk-judul">
                                    Judul (opsional)
                                </label>
                                <input
                                    id="pk-judul"
                                    className={inputCls}
                                    value={kontenForm.judul}
                                    onChange={(e) => setKontenForm((d) => ({ ...d, judul: e.target.value }))}
                                />
                            </div>
                        )}
                        {fieldForTipe(kontenForm.tipe)}
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                                {errors.error ?? Object.values(errors)[0]}
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setCreatingKonten(null);
                                    setEditingKonten(null);
                                }}
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] border border-border px-4 text-sm font-medium transition hover:bg-surface"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex min-h-10 items-center rounded-[var(--radius-button)] bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                {editingKonten ? 'Simpan Perubahan' : 'Simpan Konten'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
}
