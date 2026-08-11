import { Head } from '@inertiajs/react';
import { Camera, Mail, User } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';
import type { StudentProfile } from '@/types/models';

export default function PortalProfil({
    email,
    profile,
}: {
    email: string;
    profile: StudentProfile | null;
}) {
    return (
        <StudentPortalLayout>
            <Head title="Profil" />
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <h1 className="font-display text-3xl text-foreground sm:text-4xl">Profil</h1>
                <p className="mt-2 text-muted">
                    Kelola informasi akun dan biodata belajar Anda.
                </p>

                <div className="mt-8 rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft sm:p-8">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                        <div className="relative">
                            <div className="grid size-20 place-items-center rounded-full bg-primary text-3xl font-bold text-white">
                                {(profile?.full_name ?? 'S').charAt(0)}
                            </div>
                            <button
                                type="button"
                                aria-label="Ganti foto profil"
                                className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border border-border bg-white text-muted shadow-soft"
                            >
                                <Camera className="size-4" />
                            </button>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="font-display text-xl text-foreground">
                                {profile?.full_name ?? 'Santri'}
                            </h2>
                            <p className="flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start">
                                <Mail className="size-4" /> {email}
                            </p>
                            <span className="mt-2 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                                Siswa Aktif
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                            <User className="size-4 shrink-0 text-muted" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted">Jenis Kelamin</p>
                                <p className="font-medium capitalize text-foreground">
                                    {profile?.gender ?? '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                            <User className="size-4 shrink-0 text-muted" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted">Tanggal Lahir</p>
                                <p className="font-medium text-foreground">
                                    {profile?.birth_date ?? '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                            <User className="size-4 shrink-0 text-muted" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted">No. HP</p>
                                <p className="truncate font-medium text-foreground">
                                    {profile?.phone ?? '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                            <User className="size-4 shrink-0 text-muted" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted">Alamat</p>
                                <p className="truncate font-medium text-foreground">
                                    {profile?.address ?? '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentPortalLayout>
    );
}