import { type ReactNode, useState } from 'react';
import { Head, Link, router, usePage, type PageProps } from '@inertiajs/react';
import { Bell, LayoutDashboard, LogOut, Menu, Megaphone, Sparkles, User, X } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { StudentProfile } from '@/types/models';

const NAV = [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Program', href: '/dashboard/program', icon: Sparkles },
    { label: 'Pengumuman', href: '/dashboard/announcement', icon: Megaphone },
    { label: 'Profil', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const { profile } = usePage<PageProps>().props as { profile?: StudentProfile | null };

    const current = NAV.find((n) =>
        typeof window !== 'undefined' ? window.location.pathname.startsWith(n.href) : false
    );

    return (
        <div className="flex min-h-screen bg-surface">
            <Head title="Dashboard" />

            <button
                onClick={() => setOpen(true)}
                aria-label="Buka menu"
                className="fixed left-4 top-4 z-30 grid size-11 place-items-center rounded-full bg-primary text-white shadow-soft lg:hidden"
            >
                <Menu className="size-5" />
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-30 bg-primary/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform bg-primary text-white shadow-soft transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between px-5">
                    <a href="/" className="flex items-center gap-2.5">
                        <img
                            src={SITE.logo}
                            alt={`Logo ${SITE.name}`}
                            className="h-9 w-9 rounded-full object-cover"
                            width={36}
                            height={36}
                        />
                        <span className="font-display text-lg">Al Bayan</span>
                    </a>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Tutup menu"
                        className="grid size-9 place-items-center rounded-full hover:bg-white/10 lg:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <nav className="mt-4 px-3">
                    <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                        Menu Utama
                    </p>
                    <ul className="space-y-1">
                        {NAV.map((item) => {
                            const Icon = item.icon;
                            const active = current?.href === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                                            active
                                                ? 'bg-secondary text-white'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        )}
                                    >
                                        <Icon className="size-4.5" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="absolute inset-x-0 bottom-0 p-3">
                    <button
                        onClick={() => router.post('/logout')}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-danger/20 hover:text-white"
                    >
                        <LogOut className="size-4.5" />
                        Keluar
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/80 px-5 backdrop-blur sm:px-8 lg:ml-0">
                    <div className="flex items-center gap-3 lg:ml-0">
                        <span className="hidden text-sm font-semibold text-muted lg:block">
                            {current?.label ?? 'Dashboard'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Notifikasi"
                            className="relative grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface"
                        >
                            <Bell className="size-5" />
                            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-secondary" />
                        </button>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                {profile?.full_name?.charAt(0) ?? 'A'}
                            </div>
                            <div className="hidden leading-tight md:block">
                                <p className="text-sm font-semibold text-foreground">
                                    {profile?.full_name ?? 'Santri'}
                                </p>
                                <p className="text-xs text-muted">{profile?.nim ?? ''}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-5 sm:p-8">{children}</main>
            </div>
        </div>
    );
}
