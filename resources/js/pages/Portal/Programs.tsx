import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { ArrowRight, BookOpen, Clock, Search } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';
import { EmptyState } from '@/pages/Portal/parts';
import { mediaUrl } from '@/lib/image';
import type { ProgramKursus } from '@/types/models';

export default function PortalPrograms({
    programs,
    filters,
}: {
    programs: ProgramKursus[];
    filters: { q: string };
}) {
    const [query, setQuery] = useState(filters.q ?? '');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onSearch = (value: string) => {
        setQuery(value);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            router.get('/program', { q: value || undefined }, { preserveState: true, replace: true });
        }, 300);
    };

    return (
        <StudentPortalLayout>
            <Head title="Program" />

            <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <h1 className="font-display text-3xl text-foreground sm:text-4xl">Program</h1>
                <p className="mt-2 max-w-xl text-muted">
                    Pilih program yang sesuai dengan tujuan belajar Anda. Semua disajikan bertahap
                    dan dapat diikuti kapan saja.
                </p>

                <div className="mt-6 max-w-md">
                    <label className="sr-only" htmlFor="search-program">
                        Cari program
                    </label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <input
                            id="search-program"
                            type="search"
                            value={query}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder="Cari program..."
                            className="w-full rounded-[var(--radius-input)] border border-input bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    {programs.length === 0 ? (
                        <EmptyState
                            title="Program Tidak Ditemukan"
                            description="Program yang Anda cari belum tersedia. Coba kata kunci lain."
                            actionHref="/program"
                            actionLabel="Muat Ulang"
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {programs.map((p) => (
<div
                                        key={p.id}
                                        className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-soft-hover"
                                    >
                                        <div className="relative mb-1 aspect-square overflow-hidden bg-surface">
                                            {p.thumbnail ? (
                                                <img
                                                    src={mediaUrl(p.thumbnail)}
                                                    alt={p.nama_program}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center text-xs text-muted">
                                                    Tidak ada gambar
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-muted">
                                                    {p.kategori?.nama_kategori ?? 'Belajar'}
                                                </span>
                                                <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                                                    {p.tingkat}
                                                </span>
                                            </div>
                                    <h2 className="mt-3 font-display text-xl leading-snug text-foreground">
                                        {p.nama_program}
                                    </h2>
                                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                                        {p.deskripsi}
                                    </p>

                                    <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <BookOpen className="size-3.5" />
                                            {p.materi_list_count ?? 0} materi
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="size-3.5" /> {p.durasi_jam} jam
                                        </span>
                                    </div>

                                    <div className="mt-auto pt-5">
                                        <Link
                                            href={`/program/${p.slug}`}
                                            className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                                        >
                                            Masuk Program <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                                    </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StudentPortalLayout>
    );
}