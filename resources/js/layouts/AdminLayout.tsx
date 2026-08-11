import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Building2,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Menu,
    Megaphone,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface AdminLayoutProps {
    children: ReactNode;
}

const NAV = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Pendaftaran', href: '/admin/pendaftaran', icon: ClipboardList },
    { label: 'Pengguna', href: '/admin/users', icon: Users },
    { label: 'Program', href: '/admin/programs', icon: BookOpen },
    { label: 'Pembayaran', href: '/admin/pembayaran', icon: Wallet },
    { label: 'Pengumuman', href: '/admin/announcements', icon: Megaphone },
    { label: 'Asrama', href: '/admin/asrama', icon: Building2 },
];

function NavItem({ href, label, icon: Icon }: (typeof NAV)[number]) {
    const active = window.location.pathname === href;
    return (
        <Link
            href={href}
            className={cn(
                'flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                active
                    ? 'bg-white text-primary shadow-soft'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
        >
            <Icon className="size-4 shrink-0" />
            {label}
        </Link>
    );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const userButtonRef = useRef<HTMLButtonElement>(null);
    const drawerCloseRef = useRef<HTMLButtonElement>(null);
    const { auth } = usePage<{ auth?: { user?: { email?: string; username?: string } | null } }>()
        .props;
    const adminName =
        auth?.user?.username === 'adminalbayan' ? 'Administrator' : (auth?.user?.username ?? 'Admin');

    useRealtime({ isAdmin: true, reloadProps: ['users', 'programs', 'announcements'] });

    const closeAll = () => {
        setMobileOpen(false);
        setUserOpen(false);
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeAll();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            drawerCloseRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <div className="min-h-screen bg-surface text-foreground">
            <Head title="Admin" />
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                Lewati ke konten utama
            </a>

            {/* Sidebar desktop */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-primary lg:flex">
                <div className="flex h-[72px] items-center gap-3 px-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 font-display text-lg text-white">
                        A
                    </span>
                    <div className="leading-tight">
                        <p className="font-display text-lg text-white">Al Bayan</p>
                        <p className="text-[11px] uppercase tracking-wider text-white/50">Admin Panel</p>
                    </div>
                </div>
                <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Menu admin">
                    {NAV.map((item) => (
                        <NavItem key={item.href} {...item} />
                    ))}
                </nav>
                <div className="border-t border-white/10 p-3">
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="size-4" /> Keluar
                    </button>
                </div>
            </aside>

            {/* Topbar */}
            <header
                className={cn(
                    'fixed inset-x-0 top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:left-64',
                    mobileOpen && 'lg:left-64'
                )}
            >
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Buka menu"
                        aria-expanded={mobileOpen}
                        aria-controls="admin-mobile-menu"
                        className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>
                    <h1 className="font-display text-lg text-foreground">Dashboard Admin</h1>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Notifikasi"
                        className="relative grid size-11 place-items-center rounded-full text-muted transition hover:bg-surface"
                    >
                        <Bell className="size-5" />
                        <span className="absolute right-3 top-3 size-1.5 rounded-full bg-secondary" />
                    </button>

                    <div className="relative">
                        <button
                            ref={userButtonRef}
                            type="button"
                            onClick={() => setUserOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={userOpen}
                            aria-label="Menu akun"
                            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-surface"
                        >
                            <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                                {adminName.charAt(0).toUpperCase()}
                            </span>
                            <span className="hidden text-sm font-medium sm:block">{adminName}</span>
                        </button>
                        {userOpen && (
                            <div className="absolute right-0 top-12 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-white shadow-soft-modal">
                                <div className="border-b border-border px-4 py-3">
                                    <p className="text-sm font-semibold text-foreground">{adminName}</p>
                                    <p className="text-xs text-muted">Administrator</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserOpen(false);
                                        router.post('/logout');
                                    }}
                                    className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-danger transition hover:bg-danger/5"
                                >
                                    <LogOut className="size-4" /> Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden" id="admin-mobile-menu">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Tutup menu"
                        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
                    />
                    <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-primary shadow-soft-modal">
                        <div className="flex h-[72px] items-center justify-between px-5">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-xl bg-white/10 font-display text-white">
                                    A
                                </span>
                                <div className="leading-tight">
                                    <p className="font-display text-lg text-white">Al Bayan</p>
                                    <p className="text-[11px] uppercase tracking-wider text-white/50">
                                        Admin Panel
                                    </p>
                                </div>
                            </div>
                            <button
                                ref={drawerCloseRef}
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Tutup menu"
                                className="grid size-11 place-items-center rounded-full text-white/70 hover:bg-white/10"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3" aria-label="Menu admin">
                            {NAV.map((item) => (
                                <NavItem key={item.href} {...item} />
                            ))}
                        </nav>
                        <div className="border-t border-white/10 p-3">
                            <button
                                type="button"
                                onClick={() => router.post('/logout')}
                                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                            >
                                <LogOut className="size-4" /> Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main id="main" className="min-h-screen pt-[72px] lg:pl-64">
                <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}