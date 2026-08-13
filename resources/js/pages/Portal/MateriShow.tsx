import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Download, FileText, Clock, Link2 } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';
import type { Materi, MateriKonten } from '@/types/models';
import { cn } from '@/lib/utils';

function LessonSidebar({
    siblings,
    activeUrl,
    programSlug,
    label,
    onNavigate,
}: {
    siblings: { id: number; judul: string; slug: string; urutan: number }[];
    activeUrl: string;
    programSlug: string;
    label: string;
    onNavigate?: () => void;
}) {
    return (
        <nav aria-label="Daftar materi" className="space-y-1">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                {label}
            </p>
            {siblings.map((s) => {
                const href = `/program/${programSlug}/materi/${s.slug}`;
                return (
                    <Link
                        key={s.id}
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                            href === activeUrl
                                ? 'bg-secondary/10 font-medium text-secondary'
                                : 'text-muted hover:bg-surface hover:text-foreground'
                        )}
                    >
                        <span className="text-xs text-muted">{s.urutan}</span>
                        <span className="truncate">{s.judul}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

function LessonContent({
    label,
    items,
    activeUrl,
    programSlug,
}: {
    label: string;
    items: { id: number; judul: string; slug: string; urutan: number }[];
    activeUrl: string;
    programSlug: string;
}) {
    return (
        <LessonSidebar
            siblings={items}
            activeUrl={activeUrl}
            programSlug={programSlug}
            label={label}
        />
    );
}

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

function BabAttachments({ materi }: { materi: Materi }) {
    const hasAny = materi.gambar_url || materi.video_url || materi.pdf_url;
    if (!hasAny) return null;

    return (
        <div className="mt-8 space-y-6">
            <h2 className="font-display text-lg text-foreground">Lampiran Materi</h2>

            {materi.video_url && (
                <video
                    controls
                    preload="metadata"
                    className="aspect-video w-full rounded-[var(--radius-image)] border border-border bg-black"
                    src={materi.video_url}
                >
                    Browser Anda tidak mendukung pemutaran video.
                </video>
            )}

            {materi.gambar_url && (
                <figure>
                    <img
                        src={materi.gambar_url}
                        alt={materi.gambar_name ?? 'Gambar materi'}
                        className="w-full rounded-[var(--radius-image)] border border-border"
                        loading="lazy"
                    />
                </figure>
            )}

            {materi.pdf_url && (
                <a
                    href={materi.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border p-4 transition hover:bg-surface"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary/10 text-secondary">
                            <FileText className="size-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                                {materi.pdf_name ?? 'Materi PDF'}
                            </p>
                            <p className="text-xs text-muted">
                                {formatBytes(materi.pdf_size)} · Buka di tab baru
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface">
                        <Download className="size-4" /> Baca
                    </span>
                </a>
            )}
        </div>
    );
}

function KontenBlocks({ kontens }: { kontens: MateriKonten[] }) {
    if (!kontens.length) return null;

    return (
        <div className="mt-8 space-y-6">
            {kontens.map((k) => (
                <section key={k.id} className="space-y-2">
                    {k.judul && (
                        <h2 className="font-display text-lg text-foreground">{k.judul}</h2>
                    )}

                    {k.tipe === 'teks' && (
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">{k.konten}</p>
                    )}

                    {k.tipe === 'gambar' && k.media_url && (
                        <figure>
                            <img
                                src={k.media_url}
                                alt={k.judul ?? 'Gambar materi'}
                                className="w-full rounded-[var(--radius-image)] border border-border"
                                loading="lazy"
                            />
                        </figure>
                    )}

                    {k.tipe === 'video' && k.media_url && (
                        <video
                            controls
                            preload="metadata"
                            className="aspect-video w-full rounded-[var(--radius-image)] border border-border bg-black"
                            src={k.media_url}
                        >
                            Browser Anda tidak mendukung pemutaran video.
                        </video>
                    )}

                    {k.tipe === 'video_link' && k.url && (
                        youtubeEmbed(k.url) ? (
                            <iframe
                                src={youtubeEmbed(k.url)!}
                                title={k.judul ?? 'Video'}
                                className="aspect-video w-full rounded-[var(--radius-image)] border border-border"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <a
                                href={k.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface"
                            >
                                <Link2 className="size-4" /> {k.judul ?? 'Buka video'}
                            </a>
                        )
                    )}

                    {k.tipe === 'pdf' && k.media_url && (
                        <a
                            href={k.media_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border p-4 transition hover:bg-surface"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary/10 text-secondary">
                                    <FileText className="size-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {k.file_name ?? 'Materi PDF'}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {formatBytes(k.file_size)} · Buka di tab baru
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface">
                                <Download className="size-4" /> Baca
                            </span>
                        </a>
                    )}
                </section>
            ))}
        </div>
    );
}

export default function MateriShow({
    materi,
    siblings,
    programSlug,
}: {
    materi: Materi;
    siblings: { id: number; judul: string; slug: string; urutan: number }[];
    programSlug: string;
}) {
    const videos = materi.videos ?? [];
    const pdfs = materi.pdfs ?? [];
    const audios = materi.audios ?? [];
    const currentUrl = `/program/${programSlug}/materi/${materi.slug}`;
    const currentIndex = siblings.findIndex((s) => s.slug === materi.slug);
    const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
    const next = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

    return (
        <StudentPortalLayout>
            <Head title={materi.judul} />

            <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li>
                            <Link href={`/program/${programSlug}`} className="hover:text-foreground">
                                {materi.program?.nama_program ?? 'Program'}
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li className="font-medium text-foreground">{materi.judul}</li>
                    </ol>
                </nav>

                <div className="lg:hidden">
                    <label className="sr-only" htmlFor="materi-nav-mobile">
                        Pilih materi
                    </label>
                    <select
                        id="materi-nav-mobile"
                        value={materi.slug}
                        onChange={(e) => router.visit(`/program/${programSlug}/materi/${e.target.value}`)}
                        className="w-full rounded-[var(--radius-input)] border border-input bg-white py-3 pl-4 pr-9 text-sm font-medium text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                    >
                        {siblings.map((s) => (
                            <option key={s.id} value={s.slug}>
                                {s.urutan}. {s.judul}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-8 lg:mt-0 lg:grid-cols-4">
                    <div className="hidden lg:block">
                        <div className="sticky top-24 rounded-[var(--radius-card)] border border-border bg-white p-3 shadow-soft">
                            <LessonContent
                                label="Daftar Materi"
                                items={siblings}
                                activeUrl={currentUrl}
                                programSlug={programSlug}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <article className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft sm:p-8">
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                                <Clock className="size-3.5" /> {materi.estimasi_menit} menit
                            </span>
                            <h1 className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">
                                {materi.judul}
                            </h1>
                            <p className="mt-3 leading-relaxed text-muted">{materi.deskripsi}</p>

                            <BabAttachments materi={materi} />

                            {videos.length > 0 && (
                                <div className="mt-6 overflow-hidden rounded-[var(--radius-image)] border border-border bg-surface">
                                    <video
                                        controls
                                        preload="metadata"
                                        className="aspect-video w-full bg-black"
                                        src={videos[0].url_video}
                                    >
                                        Browser Anda tidak mendukung pemutaran video.
                                    </video>
                                    <p className="px-4 py-3 text-sm font-medium text-foreground">
                                        {videos[0].judul_video}
                                    </p>
                                </div>
                            )}

                            {audios.length > 0 && (
                                <div className="mt-5">
                                    <audio
                                        controls
                                        preload="none"
                                        className="w-full"
                                        src={audios[0].nama_file}
                                    >
                                        Browser Anda tidak mendukung pemutaran audio.
                                    </audio>
                                </div>
                            )}

                            {pdfs.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    {pdfs.map((pdf) => (
                                        <div
                                            key={pdf.id}
                                            className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-border p-4"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary/10 text-secondary">
                                                    <FileText className="size-5" />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-foreground">
                                                        {pdf.judul_file}
                                                    </p>
                                                    <p className="text-xs text-muted">
                                                        {pdf.ukuran_file ?? 'PDF'} ·{' '}
                                                        {pdf.jumlah_halaman} halaman
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={pdf.nama_file}
                                                download
                                                className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface"
                                            >
                                                <Download className="size-4" />
                                                Baca
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <KontenBlocks kontens={materi.kontens ?? []} />
                        </article>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {prev ? (
                                <Link
                                    href={`/program/${programSlug}/materi/${prev.slug}`}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] border border-border bg-white px-5 text-sm font-medium transition-colors hover:bg-surface"
                                >
                                    <ArrowLeft className="size-4" /> {prev.judul}
                                </Link>
                            ) : (
                                <span className="hidden sm:block" />
                            )}
                            {next && (
                                <Link
                                    href={`/program/${programSlug}/materi/${next.slug}`}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                    {next.judul} <ArrowRight className="size-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StudentPortalLayout>
    );
}