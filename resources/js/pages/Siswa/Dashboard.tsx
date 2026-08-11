import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Building2,
    CheckCircle2,
    Clock,
    CreditCard,
    Sparkles,
} from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface ProgramItem {
    id: number;
    nama: string;
    slug: string;
    status: string;
    progress: number;
}

interface AktivitasItem {
    id: number;
    aktivitas: string;
    waktu: string;
}

interface DashboardProps {
    auth: {
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
            avatar?: string | null;
        };
    };
    access?: {
        asrama?: boolean;
    };
    summary: {
        programCount: number;
        pembayaran: {
            status: 'lunas' | 'pending';
            pending_count: number;
        };
        asrama: {
            is_assigned: boolean;
            kamar: string | null;
            ranjang: string | null;
        };
    };
    programs: ProgramItem[];
    aktivitas: AktivitasItem[];
}

export default function Dashboard({ auth, summary, programs, aktivitas, access }: DashboardProps) {
    const userName = auth.user.name ?? auth.user.email ?? 'Siswa';
    const hasAsrama = access?.asrama ?? false;

    return (
        <StudentPortalLayout title="Dashboard Siswa">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Welcome Header Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary to-primary/95 p-6 sm:p-8 text-white shadow-soft">
                    <div className="absolute -right-8 -top-8 size-48 rounded-full bg-white/5 blur-2xl" />
                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                            <Sparkles className="size-3.5 text-amber-300" />
                            Portal Digital Al Bayan
                        </div>
                        <h2 className="font-display text-2xl font-bold sm:text-3xl">
                            Selamat datang, {userName}
                        </h2>
                        <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                            Kelola program, pembayaran, dan informasi asrama Anda dalam satu portal terpadu.
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className={`grid gap-5 ${hasAsrama ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                    {/* Kartu 1 — Program Saya */}
                    <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-muted uppercase">
                                PROGRAM SAYA
                            </span>
                            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                                <BookOpen className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="font-display text-3xl font-bold text-foreground">
                                {summary.programCount}
                            </span>
                            <p className="mt-1 text-xs font-medium text-muted">
                                Program yang diikuti
                            </p>
                        </div>
                    </div>

                    {/* Kartu 2 — Pembayaran */}
                    <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wider text-muted uppercase">
                                PEMBAYARAN
                            </span>
                            <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                                <CreditCard className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            {summary.pembayaran.status === 'lunas' ? (
                                <>
                                    <span className="inline-flex items-center gap-1.5 font-display text-2xl font-bold text-emerald-600">
                                        <CheckCircle2 className="size-6 text-emerald-500" />
                                        LUNAS
                                    </span>
                                    <p className="mt-1 text-xs font-medium text-muted">
                                        Tidak ada pembayaran tertunda
                                    </p>
                                </>
                            ) : (
                                <>
                                    <span className="font-display text-3xl font-bold text-amber-600">
                                        {summary.pembayaran.pending_count}
                                    </span>
                                    <p className="mt-1 text-xs font-medium text-muted">
                                        Pembayaran menunggu
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {hasAsrama && (
                        <>
                            {/* Kartu 3 — Asrama */}
                            <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-wider text-muted uppercase">
                                        ASRAMA
                                    </span>
                                    <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <Building2 className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    {summary.asrama.is_assigned ? (
                                        <>
                                            <div className="font-display text-xl font-bold text-foreground">
                                                Kamar {summary.asrama.kamar}
                                            </div>
                                            <p className="mt-1 text-xs font-medium text-muted">
                                                Ranjang {summary.asrama.ranjang}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-display text-lg font-semibold text-muted">
                                                Belum ditempatkan
                                            </span>
                                            <p className="mt-1 text-xs font-medium text-muted">
                                                Menunggu penempatan kamar
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Section Program Saya */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display text-lg font-bold text-foreground">
                                Program Saya
                            </h3>
                            <p className="text-xs text-muted">
                                Daftar program bahasa Arab yang sedang Anda ikuti
                            </p>
                        </div>
                        <Link
                            href="/siswa/program/cari"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                        >
                            Cari Program
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>

                    <div className="mt-6">
                        {programs.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {programs.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col justify-between rounded-xl border border-border bg-surface/50 p-5 transition hover:border-primary/30 hover:bg-white"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                                                    {item.status}
                                                </span>
                                            </div>
                                            <h4 className="mt-3 font-display font-bold text-foreground">
                                                {item.nama}
                                            </h4>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                                            <span className="text-xs font-medium text-muted">
                                                Progress: {item.progress}%
                                            </span>
                                            <Link
                                                href={`/program/${item.slug}`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                            >
                                                Lihat Program <ArrowRight className="size-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border py-12 text-center">
                                <BookOpen className="mx-auto size-10 text-muted/60" />
                                <h4 className="mt-3 font-display font-semibold text-foreground">
                                    Belum ada program
                                </h4>
                                <p className="mt-1 text-xs text-muted">
                                    Anda belum mengikuti program apa pun saat ini.
                                </p>
                                <Link
                                    href="/siswa/program/cari"
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                                >
                                    Cari Program
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section Aktivitas Terbaru */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <h3 className="font-display text-lg font-bold text-foreground">
                        Aktivitas Terbaru
                    </h3>
                    <p className="text-xs text-muted">
                        Riwayat kegiatan dan peristiwa penting akun Anda
                    </p>

                    <div className="mt-6 space-y-3">
                        {aktivitas.length > 0 ? (
                            aktivitas.map((act) => (
                                <div
                                    key={act.id}
                                    className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/40 px-4 py-3 text-xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                                            <Clock className="size-4" />
                                        </div>
                                        <span className="font-medium text-foreground">
                                            {act.aktivitas}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted">
                                        {act.waktu}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-xs text-muted">
                                Belum ada riwayat aktivitas terbaru.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentPortalLayout>
    );
}
