import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, CheckCircle2, Clock, Search } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface ProgramCatalogItem {
    id: number;
    nama: string;
    slug: string;
    harga: number;
    durasi: string;
    deskripsi: string;
    requires_dorm: boolean;
    status?: 'enrolled' | 'pending' | null;
}

export default function CariProgram({
    programs,
    searchQuery = '',
}: {
    programs: ProgramCatalogItem[];
    searchQuery?: string;
}) {
    const [query, setQuery] = useState(searchQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/siswa/program/cari', { q: query }, { preserveState: true });
    };

    return (
        <StudentPortalLayout title="Cari Program">
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                        Katalog Program Belajar
                    </h2>
                    <p className="text-xs text-muted">
                        Temukan program pembelajaran Bahasa Arab yang sesuai dengan kebutuhan Anda.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari program bahasa Arab..."
                        className="w-full rounded-2xl border border-border bg-white py-3.5 pl-11 pr-24 text-sm font-medium text-foreground outline-none shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary/95"
                    >
                        Cari
                    </button>
                </form>

                {/* Program Cards Grid */}
                {programs.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {programs.map((item) => {
                            const enrolled = item.status === 'enrolled';
                            const pending = item.status === 'pending';

                            return (
                            <div
                                key={item.id}
                                className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm transition ${
                                    enrolled
                                        ? 'border-emerald-200 opacity-60 saturate-50'
                                        : pending
                                          ? 'border-amber-200'
                                          : 'border-border hover:-translate-y-0.5 hover:shadow-soft'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted">
                                            {item.durasi}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {enrolled && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                    <CheckCircle2 className="size-3" /> Sudah Terdaftar
                                                </span>
                                            )}
                                            {pending && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                                    <Clock className="size-3" /> Menunggu Konfirmasi
                                                </span>
                                            )}
                                            {item.requires_dorm && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                    <Building2 className="size-3" /> Inc. Asrama
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="mt-3 font-display text-lg font-bold text-primary">
                                        {item.nama}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
                                        {item.deskripsi || 'Program intensif pembelajaran Bahasa Arab.'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-medium text-muted block">
                                            Biaya Program
                                        </span>
                                        <span className="font-display text-base font-bold text-foreground">
                                            Rp {Number(item.harga).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    {enrolled ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
                                            Aktif
                                        </span>
                                    ) : pending ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-muted/50 px-4 py-2 text-xs font-bold text-muted" aria-disabled="true">
                                            Menunggu
                                        </span>
                                    ) : (
                                        <Link
                                            href={`/program/${item.slug}`}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                                        >
                                            Daftar <ArrowRight className="size-3.5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center shadow-sm">
                        <Search className="mx-auto size-12 text-muted/50" />
                        <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                            Program Tidak Ditemukan
                        </h3>
                        <p className="mt-1 text-xs text-muted">
                            Coba kata kunci pencarian yang lain.
                        </p>
                    </div>
                )}
            </div>
        </StudentPortalLayout>
    );
}
