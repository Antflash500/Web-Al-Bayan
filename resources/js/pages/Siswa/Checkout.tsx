import { useForm } from '@inertiajs/react';
import { Building2, CreditCard, ShieldCheck } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface ProgramDetail {
    id: number;
    nama: string;
    slug: string;
    harga: number;
    durasi: string;
    requires_dorm: boolean;
}

interface UserDetail {
    name: string;
    email: string;
    phone?: string;
}

interface CheckoutProps {
    program: ProgramDetail;
    user: UserDetail;
}

export default function Checkout({ program, user }: CheckoutProps) {
    const { data, setData, post, processing } = useForm({
        program_id: program.id,
        metode_pembayaran: 'Bank Transfer',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/siswa/checkout');
    };

    return (
        <StudentPortalLayout title="Checkout Program">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                        Pendaftaran & Pembayaran
                    </h2>
                    <p className="text-xs text-muted">
                        Selesaikan transaksi pendaftaran program belajar Anda dengan aman.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Checkout Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Detail Program */}
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
                            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary text-xs">01</span>
                                Detail Program
                            </h3>
                            <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-surface/40 p-4 sm:flex-row sm:items-center">
                                <div>
                                    <h4 className="font-display font-bold text-primary">
                                        {program.nama}
                                    </h4>
                                    <p className="text-xs text-muted">
                                        Durasi: {program.durasi}
                                    </p>
                                </div>
                                {program.requires_dorm && (
                                    <span className="mt-2 inline-flex items-center gap-1 self-start rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 sm:mt-0">
                                        <Building2 className="size-3.5" /> Inc. Asrama
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Data Peserta */}
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
                            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary text-xs">02</span>
                                Data Peserta
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 text-xs">
                                <div className="space-y-1">
                                    <span className="font-semibold text-muted">Nama Lengkap</span>
                                    <p className="font-medium text-foreground">{user.name || 'Siswa'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-semibold text-muted">Alamat Email</span>
                                    <p className="font-medium text-foreground">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-semibold text-muted">Nomor Telepon</span>
                                    <p className="font-medium text-foreground">{user.phone || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Metode Pembayaran */}
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-4">
                            <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary text-xs">03</span>
                                Metode Pembayaran
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => setData('metode_pembayaran', 'Bank Transfer')}
                                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                                        data.metode_pembayaran === 'Bank Transfer'
                                            ? 'border-primary bg-primary/5 shadow-soft-hover'
                                            : 'border-border bg-white hover:bg-surface'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                                            <CreditCard className="size-4.5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-foreground block">Bank Transfer</span>
                                            <span className="text-[10px] text-muted">Virtual Account</span>
                                        </div>
                                    </div>
                                    <div className={`size-4 rounded-full border flex items-center justify-center ${
                                        data.metode_pembayaran === 'Bank Transfer' ? 'border-primary bg-primary' : 'border-muted'
                                    }`}>
                                        {data.metode_pembayaran === 'Bank Transfer' && <span className="size-1.5 rounded-full bg-white" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('metode_pembayaran', 'QRIS')}
                                    className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                                        data.metode_pembayaran === 'QRIS'
                                            ? 'border-primary bg-primary/5 shadow-soft-hover'
                                            : 'border-border bg-white hover:bg-surface'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                                            <ShieldCheck className="size-4.5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-foreground block">QRIS</span>
                                            <span className="text-[10px] text-muted">E-Wallet Instant</span>
                                        </div>
                                    </div>
                                    <div className={`size-4 rounded-full border flex items-center justify-center ${
                                        data.metode_pembayaran === 'QRIS' ? 'border-primary bg-primary' : 'border-muted'
                                    }`}>
                                        {data.metode_pembayaran === 'QRIS' && <span className="size-1.5 rounded-full bg-white" />}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Ringkasan Pembayaran */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6">
                            <h3 className="font-display font-bold text-foreground">
                                Ringkasan Pembayaran
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between text-muted">
                                    <span>Biaya Pendaftaran</span>
                                    <span>Rp {Number(program.harga).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-muted">
                                    <span>Biaya Layanan</span>
                                    <span>Rp 0</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-sm">
                                    <span>Total Bayar</span>
                                    <span className="text-primary">
                                        Rp {Number(program.harga).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95 disabled:opacity-50"
                                >
                                    Lanjutkan Pembayaran
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </StudentPortalLayout>
    );
}
