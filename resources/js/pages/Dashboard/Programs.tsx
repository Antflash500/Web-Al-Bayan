import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import type { Program } from '@/types/models';

export default function DashboardPrograms({ programs }: { programs: Program[] }) {
    return (
        <DashboardLayout>
            <Head title="Program" />
            <div>
                <h1 className="text-2xl font-bold text-foreground">Program Saya</h1>
                <p className="mt-1 text-sm text-muted">
                    Daftar program yang tersedia di Al Bayan Education.
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {programs.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-soft-hover"
                        >
                            <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                                {p.duration}
                            </span>
                            <h3 className="mt-3 text-lg font-semibold text-foreground">{p.name}</h3>
                            <p className="mt-1 text-xs font-medium text-primary">{p.schedule}</p>
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                                {p.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
