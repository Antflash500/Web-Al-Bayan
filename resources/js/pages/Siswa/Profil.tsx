import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { KeyRound, Save, User as UserIcon } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface ProfilProps {
    user: {
        id: number;
        email: string | null;
        name: string;
        username: string | null;
        phone?: string | null;
        address?: string | null;
        avatar?: string | null;
        birth_date?: string | null;
        gender?: string | null;
        nik?: string | null;
        registration_status?: string | null;
        account_status?: string | null;
    };
}

const statusLabel = (status?: string | null) =>
    status === 'pending'
        ? 'Menunggu Konfirmasi Admin'
        : status === 'nonaktif'
          ? 'Nonaktif'
          : status === 'aktif'
            ? 'Aktif'
            : status ?? '—';

export default function Profil({ user }: ProfilProps) {
    const [activeTab, setActiveTab] = useState<'biodata' | 'password'>('biodata');

    const profileForm = useForm({
        phone: user.phone || '',
        address: user.address || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/siswa/profil');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post('/siswa/profil/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <StudentPortalLayout title="Profil Saya">
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                        Profil & Keamanan Akun
                    </h2>
                    <p className="text-xs text-muted">
                        Kelola data diri dan keamanan password akun Anda.
                    </p>
                </div>

                {/* Tabs Header */}
                <div className="flex gap-2 border-b border-border pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('biodata')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'biodata'
                                ? 'bg-primary text-white shadow-soft'
                                : 'text-muted hover:bg-surface hover:text-foreground'
                        }`}
                    >
                        <UserIcon className="size-4" /> Data Diri
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('password')}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeTab === 'password'
                                ? 'bg-primary text-white shadow-soft'
                                : 'text-muted hover:bg-surface hover:text-foreground'
                        }`}
                    >
                        <KeyRound className="size-4" /> Ubah Password
                    </button>
                </div>

                {/* Tab 1: Biodata */}
                {activeTab === 'biodata' && (
                    <form
                        onSubmit={handleProfileSubmit}
                        className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-5"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.name}
                                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    NIK
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.nik ?? '—'}
                                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.username ?? '—'}
                                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.birth_date ?? '—'}
                                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground cursor-not-allowed"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Status Akun
                                </label>
                                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            user.account_status === 'aktif'
                                                ? 'bg-secondary/10 text-secondary'
                                                : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {statusLabel(user.account_status)}
                                    </span>
                                    {user.email && (
                                        <span className="truncate text-xs text-muted">
                                            {user.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Nomor Telepon / WA
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                {profileForm.errors.phone && (
                                    <span className="text-[11px] text-danger mt-1 block">
                                        {profileForm.errors.phone}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Jenis Kelamin
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.gender === 'female' ? 'Perempuan' : 'Laki-laki'}
                                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-muted block mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                rows={3}
                                value={profileForm.data.address}
                                onChange={(e) => profileForm.setData('address', e.target.value)}
                                placeholder="Tuliskan alamat lengkap..."
                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {profileForm.errors.address && (
                                <span className="text-[11px] text-danger mt-1 block">
                                    {profileForm.errors.address}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95 disabled:opacity-50"
                            >
                                <Save className="size-4" /> Simpan Perubahan
                            </button>
                        </div>
                    </form>
                )}

                {/* Tab 2: Ubah Password */}
                {activeTab === 'password' && (
                    <form
                        onSubmit={handlePasswordSubmit}
                        className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-5"
                    >
                        <div>
                            <label className="text-xs font-semibold text-muted block mb-1">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) =>
                                    passwordForm.setData('current_password', e.target.value)
                                }
                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {passwordForm.errors.current_password && (
                                <span className="text-[11px] text-danger mt-1 block">
                                    {passwordForm.errors.current_password}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-muted block mb-1">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            {passwordForm.errors.password && (
                                <span className="text-[11px] text-danger mt-1 block">
                                    {passwordForm.errors.password}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-muted block mb-1">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) =>
                                    passwordForm.setData('password_confirmation', e.target.value)
                                }
                                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95 disabled:opacity-50"
                            >
                                <KeyRound className="size-4" /> Ubah Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </StudentPortalLayout>
    );
}
