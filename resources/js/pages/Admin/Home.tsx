import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    ClipboardList,
    FileText,
    Megaphone,
    ShieldCheck,
    Users,
    Award,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { Pengumuman, ProgramKursus, Pengguna } from '@/types/models';

function StatCard({
    icon: Icon,
    label,
    value,
    href,
    tone = 'primary',
}: {
    icon: typeof Users;
    label: string;
    value: number;
    href: string;
    tone?: 'primary' | 'secondary' | 'accent' | 'info';
}) {
    const tones = {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        info: 'bg-info/10 text-info',
    };
    return (
        <Link
            href={href}
            className="group rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft-hover"
        >
            <div className="flex items-center justify-between">
                <span className={`grid size-11 place-items-center rounded-xl ${tones[tone]}`}>
                    <Icon className="size-5" />
                </span>
                <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-4 font-display text-3xl text-foreground">{value}</p>
            <p className="text-sm text-muted">{label}</p>
        </Link>
    );
}

export default function Home({
    stats,
    recentUsers,
    programs,
    announcements,
}: {
    stats: {
        siswa: number;
        admin: number;
        program: number;
        materi: number;
        pengumuman: number;
        sertifikat: number;
    };
    recentUsers: Pengguna[];
    programs: ProgramKursus[];
    announcements: Pengumuman[];
}) {
    return (
        <AdminLayout>
            <Head title="Admin | Dashboard" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-display text-2xl text-foreground sm:text-3xl">Dashboard</h1>
                    <p className="mt-1 text-sm text-muted">
                        Ringkasan aktivitas Al Bayan Education.
                    </p>
                </div>
                <Link
                    href="/admin/users"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    <Users className="size-4" /> Kelola Pengguna
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard icon={Users} label="Total Siswa" value={stats.siswa} href="/admin/users" tone="primary" />
                <StatCard icon={ShieldCheck} label="Total Admin" value={stats.admin} href="/admin/users" tone="secondary" />
                <StatCard icon={BookOpen} label="Program" value={stats.program} href="/admin/programs" tone="accent" />
                <StatCard icon={FileText} label="Materi" value={stats.materi} href="/admin/programs" tone="info" />
                <StatCard icon={Megaphone} label="Pengumuman" value={stats.pengumuman} href="/admin/announcements" tone="secondary" />
                <StatCard icon={Award} label="Sertifikat" value={stats.sertifikat} href="/admin/users" tone="primary" />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section
                    aria-label="Pengguna terbaru"
                    className="rounded-[var(--radius-card)] border border-border bg-white shadow-soft"
                >
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h2 className="flex items-center gap-2 font-semibold text-foreground">
                            <ClipboardList className="size-4 text-secondary" /> Pengguna Terbaru
                        </h2>
                        <Link href="/admin/users" className="text-sm font-medium text-primary hover:text-secondary">
                            Semua
                        </Link>
                    </div>
                    <ul className="divide-y divide-border">
                        {recentUsers.map((u) => (
                            <li key={u.id} className="flex items-center gap-3 px-5 py-3.5">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                                    {(u.biodata?.nama_lengkap ?? u.email).charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {u.biodata?.nama_lengkap ?? u.email}
                                    </p>
                                    <p className="truncate text-xs text-muted">{u.email}</p>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        u.status === 'aktif'
                                            ? 'bg-secondary/10 text-secondary'
                                            : 'bg-danger/10 text-danger'
                                    }`}
                                >
                                    {u.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section
                    aria-label="Program terbaru"
                    className="rounded-[var(--radius-card)] border border-border bg-white shadow-soft"
                >
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h2 className="flex items-center gap-2 font-semibold text-foreground">
                            <BookOpen className="size-4 text-secondary" /> Program
                        </h2>
                        <Link href="/admin/programs" className="text-sm font-medium text-primary hover:text-secondary">
                            Semua
                        </Link>
                    </div>
                    <ul className="divide-y divide-border">
                        {programs.map((p) => (
                            <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary/10 text-secondary">
                                    <BookOpen className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {p.nama_program}
                                    </p>
                                    <p className="text-xs text-muted">{p.materi_list_count ?? 0} materi</p>
                                </div>
                                <span className="shrink-0 text-xs capitalize text-muted">{p.tingkat}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section
                    aria-label="Pengumuman terbaru"
                    className="rounded-[var(--radius-card)] border border-border bg-white shadow-soft"
                >
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h2 className="flex items-center gap-2 font-semibold text-foreground">
                            <Megaphone className="size-4 text-secondary" /> Pengumuman
                        </h2>
                        <Link
                            href="/admin/announcements"
                            className="text-sm font-medium text-primary hover:text-secondary"
                        >
                            Semua
                        </Link>
                    </div>
                    <ul className="divide-y divide-border">
                        {announcements.map((a) => (
                            <li key={a.id} className="px-5 py-3.5">
                                <p className="text-sm font-medium text-foreground">{a.judul}</p>
                                <p className="mt-1 line-clamp-2 text-xs text-muted">{a.isi}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </AdminLayout>
    );
}