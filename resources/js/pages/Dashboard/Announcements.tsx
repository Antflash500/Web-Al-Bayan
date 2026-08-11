import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Megaphone, CalendarDays } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import type { Announcement } from '@/types/models';

export default function DashboardAnnouncements({
    announcements,
}: {
    announcements: Announcement[];
}) {
    return (
        <DashboardLayout>
            <Head title="Pengumuman" />
            <div className="mx-auto max-w-3xl">
                <h1 className="text-2xl font-bold text-foreground">Pengumuman</h1>
                <p className="mt-1 text-sm text-muted">
                    Informasi terbaru dari Al Bayan Education.
                </p>

                <div className="mt-6 space-y-4">
                    {announcements.length === 0 && (
                        <div className="rounded-[var(--radius-card)] border border-border bg-white p-8 text-center text-sm text-muted">
                            Belum ada pengumuman.
                        </div>
                    )}
                    {announcements.map((a) => (
                        <article
                            key={a.id}
                            className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft transition hover:shadow-soft-hover"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <Megaphone className="size-5 text-primary" />
                                    {a.title}
                                </h2>
                                {a.published_at && (
                                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted">
                                        <CalendarDays className="size-3.5" />
                                        {format(new Date(a.published_at), 'd MMMM yyyy', {
                                            locale: id,
                                        })}
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted">{a.content}</p>
                        </article>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
