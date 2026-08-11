import { Head } from '@inertiajs/react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';
import {
    ArrowRight,
    BookOpen,
    Calendar,
    Megaphone,
    PlayCircle,
    Search,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { getGreeting, ProgressBar } from '@/pages/Portal/parts';
import type { ContinueLearning, Materi, Pengumuman, ProgramKursus } from '@/types/models';

export default function PortalHome({
    programs,
    materis,
    announcements,
    continueLearning,
    firstName,
}: {
    programs: ProgramKursus[];
    materis: Materi[];
    announcements: Pengumuman[];
    continueLearning: ContinueLearning | null;
    firstName: string;
}) {
    return (
        <StudentPortalLayout>
            <Head title="Beranda" />

            <section className="border-b border-border bg-gradient-to-b from-[#eaf4ee] to-surface">
                <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                    <p className="text-sm font-medium text-secondary">{getGreeting()},</p>
                    <h1 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                        {firstName}
                    </h1>
                    <p className="mt-3 max-w-xl text-base text-muted">
                        Lanjutkan perjalanan belajar Bahasa Arab Anda hari ini. Semua materi siap
                        diakses kapan saja.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {continueLearning?.program ? (
                            <Link
                                href={`/program/${continueLearning.program.slug}`}
                                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary hover:text-secondary-foreground"
                            >
                                <PlayCircle className="size-4" /> Lanjutkan Belajar
                            </Link>
                        ) : (
                            <Link
                                href="/program"
                                className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                <BookOpen className="size-4" /> Lihat Program
                            </Link>
                        )}
                        <Link
                            href="/program"
                            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-secondary/40"
                        >
                            Semua Program
                        </Link>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1280px] space-y-12 px-4 py-12 sm:px-6 lg:px-8">
                {continueLearning?.program && (
                    <section aria-label="Lanjutkan belajar">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">
                                Lanjutkan Pembelajaran
                            </h2>
                            <span className="font-display text-2xl text-primary">
                                {continueLearning.progress}%
                            </span>
                        </div>
                        <div className="mt-4 flex flex-col gap-5 rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:p-6">
                            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary/10">
                                <BookOpen className="size-7 text-secondary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-display text-xl text-foreground">
                                    {continueLearning.program.nama_program}
                                </h3>
                                <p className="mt-1 text-sm text-muted">
                                    {continueLearning.lesson_terakhir ?? 'Lanjutkan dari bagian terakhir'}
                                </p>
                                <ProgressBar value={continueLearning.progress} className="mt-3" />
                            </div>
                            <Link
                                href={`/program/${continueLearning.program.slug}`}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Lanjutkan <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </section>
                )}

                <section aria-label="Program saya">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-foreground">Program Saya</h2>
                        <Link
                            href="/program"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
                        >
                            Lihat semua <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {programs.length === 0 ? (
                        <div className="mt-4 text-center text-sm text-muted">
                            <Search className="mx-auto size-6" />
                            <p className="mt-2">Belum ada program.</p>
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {programs.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/program/${p.slug}`}
                                    className="group rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-soft-hover"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-muted">
                                            {p.kategori?.nama_kategori ?? 'Belajar'}
                                        </span>
                                        <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                                            {p.tingkat}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 font-display text-lg leading-snug text-foreground">
                                        {p.nama_program}
                                    </h3>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between text-xs text-muted">
                                            <span>{p.materi_list_count ?? 0} materi</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="size-3.5" /> {p.durasi_jam} jam
                                            </span>
                                        </div>
                                        <ProgressBar value={0} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section aria-label="Materi terbaru">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Materi Terbaru</h2>
                        <Link
                            href="/program"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
                        >
                            Lihat semua <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {materis.map((m) => (
                            <div
                                key={m.id}
                                className="rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft transition hover:shadow-soft-hover"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="grid size-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                                        <BookOpen className="size-5" />
                                    </div>
                                    <p className="text-sm text-muted">{m.program?.nama_program}</p>
                                </div>
                                <h3 className="mt-3 font-display text-lg text-foreground">
                                    {m.judul}
                                </h3>
                                <p className="mt-2 line-clamp-2 text-sm text-muted">
                                    {m.deskripsi}
                                </p>
                                <Link
                                    href={`/program/${m.program?.slug}/materi/${m.slug}`}
                                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary"
                                >
                                    Pelajari <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <section aria-label="Pengumuman">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <Megaphone className="size-5 text-secondary" /> Pengumuman
                        </h2>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {announcements.map((a) => (
                            <div
                                key={a.id}
                                className="rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft"
                            >
                                <h3 className="font-semibold text-foreground">{a.judul}</h3>
                                <p className="mt-2 line-clamp-3 text-sm text-muted">{a.isi}</p>
                                <p className="mt-3 text-xs text-muted">
                                    {new Date(a.tanggal_publish ?? '').toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </StudentPortalLayout>
    );
}