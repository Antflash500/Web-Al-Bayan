import { Building2, CheckCircle2, Info } from 'lucide-react';
import StudentPortalLayout from '@/layouts/StudentPortalLayout';

interface AsramaProps {
    penempatan: {
        is_assigned: boolean;
        kamar: string | null;
        ranjang: string | null;
        status: string;
        tanggal_masuk: string | null;
        catatan: string | null;
    };
}

export default function Asrama({ penempatan }: AsramaProps) {
    return (
        <StudentPortalLayout title="Informasi Asrama">
            <div className="mx-auto max-w-4xl space-y-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                        Informasi Asrama & Ranjang
                    </h2>
                    <p className="text-xs text-muted">
                        Detail tempat tinggal dan penempatan ranjang mahasiswa Al Bayan.
                    </p>
                </div>

                {penempatan.is_assigned ? (
                    <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <Building2 className="size-6" />
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                    <CheckCircle2 className="size-3.5" /> Penempatan Aktif
                                </span>
                                <h3 className="font-display text-xl font-bold text-foreground">
                                    Asrama Mahasiswa Al Bayan
                                </h3>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border/80 bg-surface/50 p-5">
                                <span className="text-xs font-bold tracking-wider text-muted uppercase">
                                    NOMOR KAMAR
                                </span>
                                <div className="mt-2 font-display text-3xl font-bold text-primary">
                                    Kamar {penempatan.kamar}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/80 bg-surface/50 p-5">
                                <span className="text-xs font-bold tracking-wider text-muted uppercase">
                                    NOMOR RANJANG
                                </span>
                                <div className="mt-2 font-display text-3xl font-bold text-primary">
                                    Ranjang {penempatan.ranjang}
                                </div>
                            </div>
                        </div>

                        {penempatan.tanggal_masuk && (
                            <div className="rounded-xl border border-border/60 p-4 text-xs text-muted">
                                <span className="font-semibold text-foreground">Tanggal Masuk:</span>{' '}
                                {penempatan.tanggal_masuk}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-border bg-white p-12 text-center shadow-sm space-y-4">
                        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-surface text-muted">
                            <Building2 className="size-8" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-bold text-foreground">
                                Belum Ditempatkan di Asrama
                            </h3>
                            <p className="mt-1 max-w-md mx-auto text-xs text-muted">
                                Penempatan kamar dan ranjang dilakukan secara otomatis oleh sistem backend setelah pembayaran program yang membutuhkan asrama dikonfirmasi lunas.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
                            <Info className="size-4" />
                            Status: Menunggu Penempatan
                        </div>
                    </div>
                )}
            </div>
        </StudentPortalLayout>
    );
}
