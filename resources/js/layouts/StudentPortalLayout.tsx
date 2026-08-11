import { type ReactNode, useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    User as UserIcon,
    X,
} from 'lucide-react';
import { StudentSidebar } from '@/components/siswa/StudentSidebar';
import { useRealtime, useHeartbeat } from '@/hooks/useRealtime';

interface PortalProps {
    title?: string;
    children: ReactNode;
}

export default function StudentPortalLayout({ title = 'Dashboard Siswa', children }: PortalProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const { auth, flash } = usePage<{
        auth?: {
            user?: {
                id: number;
                email: string;
                name?: string;
                role: string;
                avatar?: string | null;
            } | null;
        };
        flash?: {
            success?: string | null;
            message?: string | null;
            error?: string | null;
        };
    }>().props;

    const user = auth?.user;
    const displayName = user?.name ?? user?.email ?? 'Siswa';

    useHeartbeat(user?.id);

    useRealtime({
        userId: user?.id,
        events: [
            'PaymentStatusUpdated',
            'ProgramEnrollmentUpdated',
            'BedAssignmentUpdated',
            'StudentStatusUpdated',
        ],
    });

    const logout = () => router.post('/logout');

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileOpen(false);
                setUserOpen(false);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#f8faf8] text-foreground">
            <Head title={title} />

            {/* Desktop Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <StudentSidebar />
            </div>

            {/* Mobile Drawer Backdrop & Sidebar */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Tutup menu"
                        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
                    />
                    <div className="absolute left-0 top-0 h-full w-64 max-w-[85%] bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <span className="font-display font-bold text-primary">Menu</span>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="grid size-9 place-items-center rounded-lg hover:bg-surface"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <StudentSidebar onItemClick={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Container */}
            <div className="flex flex-1 flex-col md:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Buka menu"
                            className="grid size-10 place-items-center rounded-xl border border-border text-foreground md:hidden"
                        >
                            <Menu className="size-5" />
                        </button>
                        <h1 className="font-display text-lg font-bold text-primary sm:text-xl">
                            {title}
                        </h1>
                    </div>

                    {/* Header Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Status Online Badge */}
                        <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:flex">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                        </div>

                        {/* Notification Button */}
                        <button
                            type="button"
                            aria-label="Notifikasi"
                            className="relative grid size-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-surface hover:text-foreground"
                        >
                            <Bell className="size-4" />
                            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserOpen((v) => !v)}
                                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-1.5 pr-3 transition hover:bg-surface/80"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={displayName}
                                        className="size-8 rounded-lg object-cover"
                                    />
                                ) : (
                                    <span className="grid size-8 place-items-center rounded-lg bg-primary text-xs font-bold text-white">
                                        {displayName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <span className="hidden text-xs font-semibold text-foreground sm:inline">
                                    {displayName}
                                </span>
                                <ChevronDown className="size-3.5 text-muted" />
                            </button>

                            {userOpen && (
                                <div className="absolute right-0 top-12 mt-1 w-48 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-soft-modal">
                                    <Link
                                        href="/siswa/profil"
                                        onClick={() => setUserOpen(false)}
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-foreground transition hover:bg-surface"
                                    >
                                        <UserIcon className="size-4 text-muted" /> Profil Saya
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserOpen(false);
                                            logout();
                                        }}
                                        className="flex w-full items-center gap-2.5 rounded-xl border-t border-border/50 px-3 py-2.5 text-xs font-medium text-danger transition hover:bg-danger/5"
                                    >
                                        <LogOut className="size-4" /> Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Viewport */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {flash?.success && (
                        <p role="status" className="mb-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                            {flash.success}
                        </p>
                    )}
                    {flash?.message && (
                        <p role="status" className="mb-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                            {flash.message}
                        </p>
                    )}
                    {flash?.error && (
                        <p role="alert" className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                            {flash.error}
                        </p>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}