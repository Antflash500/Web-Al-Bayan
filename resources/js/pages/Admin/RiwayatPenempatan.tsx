import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, History, UserCheck, UserPlus } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface RiwayatItem {
    id: number;
    siswa_nama: string;
    siswa_email: string;
    ranjang_lama: string;
    ranjang_baru: string;
    dipindah_oleh: string;
    alasan: string;
    waktu: string;
}

interface RiwayatProps {
    riwayat: RiwayatItem[];
}

export default function RiwayatPenempatan({ riwayat }: RiwayatProps) {
    return (
        <AdminLayout>
            <Head title="Riwayat Penempatan Asrama" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/asrama"
                        className="grid size-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-surface"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-foreground">
                            Riwayat Penempatan Asrama
                        </h1>
                        <p className="text-xs text-muted">
                            Catatan semua perpindahan kamar dan ranjang mahasiswa.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/60 bg-surface/50">
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        Siswa
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        Ranjang Lama
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        Ranjang Baru
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        Dipindah Oleh
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        Alasan
                                    </th>
                                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted uppercase">
                                        Waktu
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {riwayat.length > 0 ? (
                                    riwayat.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-border/30 text-xs"
                                        >
                                            <td className="px-4 py-3 text-muted">
                                                {item.id}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-foreground">
                                                    {item.siswa_nama}
                                                </div>
                                                <div className="text-[10px] text-muted">
                                                    {item.siswa_email}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted">
                                                {item.ranjang_lama}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                                    <UserPlus className="size-3" />
                                                    {item.ranjang_baru}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted">
                                                <span className="inline-flex items-center gap-1">
                                                    <UserCheck className="size-3.5 text-primary" />
                                                    {item.dipindah_oleh}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted">
                                                {item.alasan}
                                            </td>
                                            <td className="px-4 py-3 text-muted">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="size-3.5" />
                                {item.waktu}
                                                </div>
                                            </td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-xs text-muted"
                                            >
                                            <div className="flex flex-col items-center gap-3">
                                                <History className="size-8 text-muted/40" />
                                                <p>Belum ada riwayat perpindahan.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
