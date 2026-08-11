import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRight, Megaphone, CalendarDays, Sparkles } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import type { Announcement, Program, StudentProfile } from '@/types/models';

export default function DashboardHome({
    profile,
    announcements,
    programs,
}: {
    profile: StudentProfile | null;
    announcements: Announcement[];
    programs: Program[];
}) {
    const firstName = profile?.full_name?.split(' ')[0] ?? 'Santri';

    return (
        <DashboardLayout>
            <Head title="Beranda" />
            <div className="space-y-6">
                <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-primary via-primary to-[#0f3d22] p-6 text-white shadow-soft sm:p-8">
                    <p className="text-sm text-secondary">Assalamu'alaikum,</p>
                    <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                        Selamat Datang, {firstName}!
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-white/75">
                        Semoga Allah memudahkan setiap langkah belajar Anda. Pantau perkembangan
                        program dan pengumuman terbaru di sini.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                <Megaphone className="size-5 text-primary" />
                                Pengumuman
                            </h2>
                            <Link
                                href="/dashboard/announcement"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
                            >
                                Lihat semua <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {announcements.length === 0 && (
                                <div className="rounded-[var(--radius-card)] border border-border bg-white p-6 text-center text-sm text-muted">
                                    Belum ada pengumuman.
                                </div>
                            )}
                            {announcements.map((a) => (
                                <div
                                    key={a.id}
                                    className="rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft transition hover:shadow-soft-hover"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold text-foreground">{a.title}</h3>
                                        {a.published_at && (
                                            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted">
                                                <CalendarDays className="size-3.5" />
                                                {format(new Date(a.published_at), 'd MMMM yyyy', {
                                                    locale: id,
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-muted">
                                        {a.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                <Sparkles className="size-5 text-secondary" />
                                Program
                            </h2>
                            <Link
                                href="/dashboard/program"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
                            >
                                Lihat semua <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {programs.map((p) => (
                                <div
                                    key={p.id}
                                    className="rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-soft transition hover:shadow-soft-hover"
                                >
                                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                                    <p className="mt-1 text-sm text-muted">{p.schedule}</p>
                                    <span className="mt-3 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                                        {p.duration}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
