import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Clock, GraduationCap } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';
import { ProgressBar } from '@/pages/Portal/parts';
import type { ProgramKursus } from '@/types/models';

export default function PortalProgramDetail({ program, isEnrolled }: { program: ProgramKursus; isEnrolled: boolean }) {
    const materiList = program.materi_list ?? [];

    return (
        <StudentPortalLayout>
            <Head title={program.nama_program} />

            <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 text-sm text-muted"
                >
                    <ol className="flex flex-wrap items-center gap-1.5">
                        <li>
                            <Link href="/home" className="transition hover:text-foreground">
                                Beranda
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>
                            <Link href="/program" className="transition hover:text-foreground">
                                Program
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li className="font-medium text-foreground" aria-current="page">
                            {program.nama_program}
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-primary">
                            <div className="absolute inset-0 geometric-pattern opacity-40" />
                            <div className="relative flex min-h-[200px] items-center justify-center p-8 text-center sm:min-h-[240px]">
                                <div>
                                    <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                                        {program.kategori?.nama_kategori ?? 'Program'}
                                    </span>
                                    <h1 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
                                        {program.nama_program}
                                    </h1>
                                    <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
                                        {program.deskripsi}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-foreground">Daftar Materi</h2>
                            <ul className="mt-4 space-y-3">
                                {materiList.length === 0 && (
                                    <li className="rounded-[var(--radius-card)] border border-dashed border-border bg-white p-6 text-center text-sm text-muted">
                                        Materi akan segera tersedia.
                                    </li>
                                )}
                                {materiList.map((m, index) => {
                                    const done = index < 0;
                                    return (
                                        <li key={m.id}>
                                            {isEnrolled ? (
                                                <Link
                                                    href={`/program/${program.slug}/materi/${m.slug}`}
                                                    className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border bg-white p-4 shadow-soft transition hover:border-secondary/40 hover:shadow-soft-hover"
                                                >
                                                    <span
                                                        className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                                                            done
                                                                ? 'bg-secondary text-white'
                                                                : 'bg-surface text-muted'
                                                        }`}
                                                    >
                                                        {m.urutan}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate font-medium text-foreground">
                                                            {m.judul}
                                                        </h3>
                                                        <p className="text-xs text-muted">
                                                            {m.estimasi_menit} menit
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="size-4 shrink-0 text-muted" />
                                                </Link>
                                            ) : (
                                                <div
                                                    className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border bg-white/70 p-4 opacity-75"
                                                >
                                                    <span
                                                        className="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold bg-surface text-muted"
                                                    >
                                                        {m.urutan}
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate font-medium text-muted">
                                                            {m.judul}
                                                        </h3>
                                                        <p className="text-xs text-muted">
                                                            {m.estimasi_menit} menit
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <div className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                            <h2 className="font-display text-lg text-foreground">Informasi</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted">Tingkat</dt>
                                    <dd className="font-medium capitalize text-foreground">
                                        {program.tingkat}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted">Durasi</dt>
                                    <dd className="flex items-center gap-1.5 font-medium text-foreground">
                                        <Clock className="size-4 text-muted" /> {program.durasi_jam} jam
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted">Instruktur</dt>
                                    <dd className="flex items-center gap-1.5 font-medium text-foreground">
                                        <GraduationCap className="size-4 text-muted" />
                                        {program.instruktur ?? 'Tim Al Bayan'}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-muted">Materi</dt>
                                    <dd className="flex items-center gap-1.5 font-medium text-foreground">
                                        <BookOpen className="size-4 text-muted" />
                                        {materiList.length} item
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft">
                            {isEnrolled ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-semibold text-foreground">Perkembangan</h2>
                                        <span className="font-display text-xl text-primary">0%</span>
                                    </div>
                                    <ProgressBar value={0} className="mt-3" />
                                    <Link
                                        href={materiList[0] ? `/program/${program.slug}/materi/${materiList[0].slug}` : '/program'}
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                                    >
                                        Mulai Belajar <ArrowRight className="size-4" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-semibold text-foreground">Biaya Pendaftaran</h2>
                                        <span className="font-display text-lg font-bold text-primary">
                                            Rp {Number(program.harga ?? 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/siswa/checkout/${program.slug}`}
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                                    >
                                        Daftar Program Sekarang <ArrowRight className="size-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </StudentPortalLayout>
    );
}