import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface ProgramItem {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string;
    status: string;
    progress: number;
}

export default function ProgramSaya({ programs }: { programs: ProgramItem[] }) {
    return (
        <StudentPortalLayout title="Program Saya">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                            Program Saya
                        </h2>
                        <p className="text-xs text-muted">
                            Daftar program pendidikan Bahasa Arab yang sedang Anda ikuti.
                        </p>
                    </div>
                    <Link
                        href="/siswa/program/cari"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                    >
                        Cari Program
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>

                {programs.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                        {programs.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-soft"
                            >
                                <div>
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                        {item.status}
                                    </span>
                                    <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                                        {item.nama}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-muted">
                                        {item.deskripsi || 'Pembelajaran Bahasa Arab terstruktur & aplikatif.'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted">
                                        Progress: {item.progress}%
                                    </span>
                                    <Link
                                        href={`/program/${item.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                    >
                                        Mulai Belajar <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center shadow-sm">
                        <BookOpen className="mx-auto size-12 text-muted/50" />
                        <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                            Belum Ada Program
                        </h3>
                        <p className="mt-1 text-xs text-muted">
                            Anda belum mendaftar di program mana pun. Pilih program belajar yang tersedia!
                        </p>
                        <Link
                            href="/siswa/program/cari"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                        >
                            Cari & Daftar Program
                        </Link>
                    </div>
                )}
            </div>
        </StudentPortalLayout>
    );
}
