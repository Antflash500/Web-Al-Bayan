import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Search,
    User,
} from 'lucide-react';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SidebarProps {
    className?: string;
    onItemClick?: () => void;
}

export function StudentSidebar({ className, onItemClick }: SidebarProps) {
    const { url } = usePage();
    const { access } = usePage<{
        access?: {
            asrama?: boolean;
        };
    }>().props;

    const hasAsrama = access?.asrama ?? false;

    const isActive = (path: string) => {
        if (path === '/siswa') return url === '/siswa' || url === '/home';
        return url.startsWith(path);
    };

    const logout = () => {
        router.post('/logout');
    };

    return (
        <aside
            className={cn(
                'flex h-full w-64 flex-col border-r border-border bg-white p-4 shadow-sm',
                className
            )}
        >
            {/* Logo Brand Header */}
            <div className="flex items-center gap-3 px-2 py-3">
                <img
                    src={SITE.logo}
                    alt={`Logo ${SITE.name}`}
                    className="h-9 w-9 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                    <span className="font-display text-lg font-bold leading-tight text-primary">
                        AL BAYAN
                    </span>
                    <span className="text-[11px] font-medium text-muted">Portal Siswa</span>
                </div>
            </div>

            <div className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto pr-1">
                {/* Kelompok UTAMA */}
                <div>
                    <span className="px-3 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        UTAMA
                    </span>
                    <nav className="mt-2 flex flex-col gap-1">
                        <Link
                            href="/siswa"
                            onClick={onItemClick}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                isActive('/siswa')
                                    ? 'bg-primary text-white shadow-soft font-semibold'
                                    : 'text-muted hover:bg-surface hover:text-foreground'
                            )}
                        >
                            <LayoutDashboard className="size-4" />
                            Dashboard
                        </Link>
                    </nav>
                </div>

                {/* Kelompok PROGRAM */}
                <div>
                    <span className="px-3 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        PROGRAM
                    </span>
                    <nav className="mt-2 flex flex-col gap-1">
                        <Link
                            href="/siswa/program"
                            onClick={onItemClick}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                isActive('/siswa/program') && !url.includes('/cari')
                                    ? 'bg-primary text-white shadow-soft font-semibold'
                                    : 'text-muted hover:bg-surface hover:text-foreground'
                            )}
                        >
                            <BookOpen className="size-4" />
                            Program Saya
                        </Link>
                        <Link
                            href="/siswa/program/cari"
                            onClick={onItemClick}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                isActive('/siswa/program/cari') || isActive('/program')
                                    ? 'bg-primary text-white shadow-soft font-semibold'
                                    : 'text-muted hover:bg-surface hover:text-foreground'
                            )}
                        >
                            <Search className="size-4" />
                            Cari Program
                        </Link>
                    </nav>
                </div>

                {/* Kelompok AKUN */}
                <div>
                    <span className="px-3 text-[11px] font-semibold tracking-wider text-muted uppercase">
                        AKUN
                    </span>
                    <nav className="mt-2 flex flex-col gap-1">
                        <Link
                            href="/siswa/profil"
                            onClick={onItemClick}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                isActive('/siswa/profil') || isActive('/profil')
                                    ? 'bg-primary text-white shadow-soft font-semibold'
                                    : 'text-muted hover:bg-surface hover:text-foreground'
                            )}
                        >
                            <User className="size-4" />
                            Profil Saya
                        </Link>
                        <Link
                            href="/siswa/pembayaran"
                            onClick={onItemClick}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                isActive('/siswa/pembayaran')
                                    ? 'bg-primary text-white shadow-soft font-semibold'
                                    : 'text-muted hover:bg-surface hover:text-foreground'
                            )}
                        >
                            <CreditCard className="size-4" />
                            Pembayaran
                        </Link>
                        {hasAsrama && (
                            <Link
                                href="/siswa/asrama"
                                onClick={onItemClick}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                    isActive('/siswa/asrama')
                                        ? 'bg-primary text-white shadow-soft font-semibold'
                                        : 'text-muted hover:bg-surface hover:text-foreground'
                                )}
                            >
                                <Building2 className="size-4" />
                                Asrama
                            </Link>
                        )}
                    </nav>
                </div>
            </div>

            {/* Bottom Logout Button */}
            <div className="mt-auto border-t border-border pt-3">
                <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-all duration-150 hover:bg-danger/5"
                >
                    <LogOut className="size-4" />
                    Keluar
                </button>
            </div>
        </aside>
    );
}
