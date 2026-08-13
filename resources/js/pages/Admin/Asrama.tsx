import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Home,
    Info,
    Plus,
    Search,
    Trash2,
    User,
    UserMinus,
    UserPlus,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import axios from 'axios';

interface StudentData {
    id: number;
    name: string;
    email: string;
    program: string;
    is_online: boolean;
}

interface KasurData {
    id: number;
    posisi: 'atas' | 'bawah';
    status: 'tersedia' | 'terisi' | 'maintenance' | 'nonaktif';
    student: StudentData | null;
}

interface RanjangData {
    id: number;
    nomor_ranjang: string;
    status: string;
    kasur: KasurData[];
}

interface KamarData {
    id: number;
    nomor_kamar: string;
    status: string;
    keterangan: string;
    ranjang: RanjangData[];
}

interface RumahData {
    id: number;
    nama: string;
    status: string;
    keterangan: string;
    kamar: KamarData[];
}

interface AsramaProps {
    stats: {
        totalRumah: number;
        totalKamar: number;
        totalRanjang: number;
        totalKasur: number;
        terisi: number;
        tersedia: number;
    };
    rumah: RumahData[];
}

interface KamarForm {
    rumah_id: string | number;
    nomor_kamar: string;
    kapasitas: number;
    status: string;
    keterangan: string;
}

interface RumahForm {
    nama: string;
    status: string;
    keterangan: string;
}

export default function Asrama({ stats, rumah }: AsramaProps) {
    const [selectedKasur, setSelectedKasur] = useState<KasurData | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<KamarData | null>(null);
    const [selectedRumah, setSelectedRumah] = useState<RumahData | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [manageKamarOpen, setManageKamarOpen] = useState(false);
    const [editingKamar, setEditingKamar] = useState<KamarData | null>(null);
    const [kamarFormState, setKamarFormState] = useState<KamarForm>({
        rumah_id: rumah[0]?.id ?? '',
        nomor_kamar: '',
        kapasitas: 6,
        status: 'tersedia',
        keterangan: '',
    });

    const [manageRumahOpen, setManageRumahOpen] = useState(false);
    const [editingRumah, setEditingRumah] = useState<RumahData | null>(null);
    const [rumahFormState, setRumahFormState] = useState<RumahForm>({
        nama: '',
        status: 'aktif',
        keterangan: '',
    });

    // Search and Autocomplete States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ id: number; name: string; email: string }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
    const [searching, setSearching] = useState(false);

    const handleKasurClick = (rumahItem: RumahData, room: KamarData, kasur: KasurData) => {
        setSelectedRumah(rumahItem);
        setSelectedRoom(room);
        setSelectedKasur(kasur);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedStudent(null);
        setModalOpen(true);
    };

    // Debounce search autocomplete
    useEffect(() => {
        if (searchQuery.trim().length < 1) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        const timer = setTimeout(() => {
            axios
                .get(`/admin/asrama/search-students?q=${searchQuery}`)
                .then((res) => {
                    setSearchResults(res.data);
                })
                .finally(() => {
                    setSearching(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAssign = () => {
        if (!selectedStudent || !selectedKasur) return;

        router.post(
            '/admin/asrama/assign',
            {
                user_id: selectedStudent.id,
                kasur_id: selectedKasur.id,
            },
            {
                onSuccess: () => {
                    setModalOpen(false);
                    setSelectedKasur(null);
                    setSelectedRoom(null);
                    setSelectedRumah(null);
                },
            }
        );
    };

    const handleVacate = (kasurId: number) => {
        if (!confirm('Apakah Anda yakin ingin mengosongkan kasur ini?')) return;

        router.post(
            `/admin/asrama/vacate/${kasurId}`,
            {},
            {
                onSuccess: () => {
                    setModalOpen(false);
                    setSelectedKasur(null);
                    setSelectedRoom(null);
                    setSelectedRumah(null);
                },
            }
        );
    };

    const handleCreateKamar = () => {
        setEditingKamar(null);
        setKamarFormState({
            rumah_id: rumah[0]?.id ?? '',
            nomor_kamar: '',
            kapasitas: 6,
            status: 'tersedia',
            keterangan: '',
        });
        setManageKamarOpen(true);
    };

    const handleEditKamar = (rumahItem: RumahData, kamar: KamarData) => {
        setEditingKamar(kamar);
        setKamarFormState({
            rumah_id: rumahItem.id,
            nomor_kamar: kamar.nomor_kamar,
            kapasitas: kamar.ranjang?.length ?? 6,
            status: kamar.status,
            keterangan: kamar.keterangan ?? '',
        });
        setManageKamarOpen(true);
    };

    const handleDeleteKamar = (kamarId: number) => {
        if (!confirm('Hapus kamar ini? Semua kasur harus kosong.')) return;
        router.delete(`/admin/asrama/kamar/${kamarId}`);
    };

    const submitKamar = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            rumah_id: kamarFormState.rumah_id,
            nomor_kamar: kamarFormState.nomor_kamar,
            kapasitas: kamarFormState.kapasitas,
            status: kamarFormState.status,
            keterangan: kamarFormState.keterangan,
        };

        if (editingKamar) {
            router.patch(`/admin/asrama/kamar/${editingKamar.id}`, data, {
                onSuccess: () => {
                    setManageKamarOpen(false);
                    setEditingKamar(null);
                },
            });
        } else {
            router.post('/admin/asrama/kamar', data, {
                onSuccess: () => {
                    setManageKamarOpen(false);
                },
            });
        }
    };

    const handleCreateRumah = () => {
        setEditingRumah(null);
        setRumahFormState({ nama: '', status: 'aktif', keterangan: '' });
        setManageRumahOpen(true);
    };

    const handleEditRumah = (rumahItem: RumahData) => {
        setEditingRumah(rumahItem);
        setRumahFormState({
            nama: rumahItem.nama,
            status: rumahItem.status,
            keterangan: rumahItem.keterangan ?? '',
        });
        setManageRumahOpen(true);
    };

    const handleDeleteRumah = (rumahId: number) => {
        if (!confirm('Hapus rumah ini? Rumah harus dalam keadaan kosong (tanpa kamar).')) return;
        router.delete(`/admin/asrama/rumah/${rumahId}`);
    };

    const submitRumah = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            nama: rumahFormState.nama,
            status: rumahFormState.status,
            keterangan: rumahFormState.keterangan,
        };

        if (editingRumah) {
            router.patch(`/admin/asrama/rumah/${editingRumah.id}`, data, {
                onSuccess: () => {
                    setManageRumahOpen(false);
                    setEditingRumah(null);
                },
            });
        } else {
            router.post('/admin/asrama/rumah', data, {
                onSuccess: () => {
                    setManageRumahOpen(false);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Asrama" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-foreground">
                            Manajemen Asrama & Ranjang
                        </h1>
                        <p className="text-xs text-muted">
                            Kelola rumah, kamar, ranjang tingkat, dan kasur (atas/bawah) beserta penempatan siswa.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/asrama/riwayat"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-primary/5 hover:border-primary/20"
                        >
                            <Info className="size-4" /> Riwayat Penempatan
                        </Link>
                        <button
                            type="button"
                            onClick={handleCreateRumah}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-primary/5 hover:border-primary/20"
                        >
                            <Home className="size-4" /> Tambah Rumah
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateKamar}
                            disabled={rumah.length === 0}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50"
                            title={rumah.length === 0 ? 'Buat Rumah terlebih dahulu' : ''}
                        >
                            <Plus className="size-4" /> Tambah Kamar
                        </button>
                    </div>
                </div>

                {rumah.length === 0 && (
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                        <Home className="size-4 shrink-0" />
                        Belum ada rumah. Silakan buat rumah terlebih dahulu sebelum menambahkan kamar.
                    </div>
                )}

                {/* Statistics Grid */}
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                            Rumah
                        </span>
                        <span className="font-display text-2xl font-bold text-foreground mt-2 block">
                            {stats.totalRumah}
                        </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                            Total Kamar
                        </span>
                        <span className="font-display text-2xl font-bold text-foreground mt-2 block">
                            {stats.totalKamar}
                        </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                            Total Ranjang
                        </span>
                        <span className="font-display text-2xl font-bold text-foreground mt-2 block">
                            {stats.totalRanjang}
                        </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                            Total Kasur
                        </span>
                        <span className="font-display text-2xl font-bold text-foreground mt-2 block">
                            {stats.totalKasur}
                        </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                            Terisi
                        </span>
                        <span className="font-display text-2xl font-bold text-primary mt-2 block">
                            {stats.terisi}
                        </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                            Tersedia
                        </span>
                        <span className="font-display text-2xl font-bold text-emerald-600 mt-2 block">
                            {stats.tersedia}
                        </span>
                    </div>
                </div>

                {/* Rumah Sections */}
                <div className="space-y-6">
                    {rumah.map((rumahItem) => (
                        <div
                            key={rumahItem.id}
                            className="rounded-2xl border border-border bg-surface/40 p-5 shadow-soft space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-border/60 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="grid size-9 place-items-center rounded-xl bg-primary text-white">
                                        <Home className="size-4.5" />
                                    </span>
                                    <div>
                                        <h2 className="font-display font-bold text-foreground text-base">
                                            {rumahItem.nama}
                                        </h2>
                                        <p className="text-[10px] text-muted">
                                            {rumahItem.keterangan ?? 'Tanpa keterangan'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                        rumahItem.status === 'nonaktif'
                                            ? 'bg-rose-50 text-rose-600'
                                            : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        {rumahItem.status === 'nonaktif' ? 'Nonaktif' : 'Aktif'}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditRumah(rumahItem)}
                                            className="grid size-7 place-items-center rounded-lg text-xs text-muted transition hover:bg-surface"
                                            title="Edit Rumah"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRumah(rumahItem.id)}
                                            className="grid size-7 place-items-center rounded-lg text-xs text-danger transition hover:bg-rose-50"
                                            title="Hapus Rumah"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {rumahItem.kamar.length === 0 ? (
                                <p className="text-xs text-muted italic">
                                    Belum ada kamar di rumah ini.
                                </p>
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {rumahItem.kamar.map((room) => (
                                        <div
                                            key={room.id}
                                            className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4"
                                        >
                                            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                                <div>
                                                    <h3 className="font-display font-bold text-foreground text-base">
                                                        Kamar {room.nomor_kamar}
                                                    </h3>
                                                    <p className="text-[10px] text-muted">{room.keterangan}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                                        room.status === 'penuh'
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-emerald-50 text-emerald-700'
                                                    }`}>
                                                        {room.status === 'penuh' ? 'Penuh' : 'Tersedia'}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditKamar(rumahItem, room)}
                                                            className="grid size-7 place-items-center rounded-lg text-xs text-muted transition hover:bg-surface"
                                                            title="Edit Kamar"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteKamar(room.id)}
                                                            className="grid size-7 place-items-center rounded-lg text-xs text-danger transition hover:bg-rose-50"
                                                            title="Hapus Kamar"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ranjang Bunk Visualizer */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {room.ranjang.map((bed) => {
                                                    const kasurAtas = bed.kasur.find((k) => k.posisi === 'atas');
                                                    const kasurBawah = bed.kasur.find((k) => k.posisi === 'bawah');

                                                    return (
                                                        <div
                                                            key={bed.id}
                                                            className="rounded-xl border border-border bg-white overflow-hidden"
                                                        >
                                                            <div className="flex items-center justify-between border-b border-border/60 bg-surface/40 px-3 py-1.5">
                                                                <span className="text-[10px] font-bold text-muted uppercase">
                                                                    Ranjang {bed.nomor_ranjang}
                                                                </span>
                                                                <span className={`text-[9px] font-semibold uppercase ${
                                                                    bed.status === 'terisi'
                                                                        ? 'text-primary'
                                                                        : bed.status === 'sebagian'
                                                                          ? 'text-amber-600'
                                                                          : 'text-emerald-600'
                                                                }`}>
                                                                    {bed.status === 'terisi'
                                                                        ? 'Penuh'
                                                                        : bed.status === 'sebagian'
                                                                          ? 'Sebagian'
                                                                          : 'Kosong'}
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => kasurAtas && handleKasurClick(rumahItem, room, kasurAtas)}
                                                                disabled={!kasurAtas || ['maintenance', 'nonaktif'].includes(kasurAtas.status)}
                                                                className={`flex items-center justify-between gap-2 px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                                    kasurAtas?.status === 'terisi'
                                                                        ? 'bg-primary/5 hover:bg-primary/10'
                                                                        : 'hover:bg-emerald-50/30'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[9px] font-bold uppercase text-muted">
                                                                        Atas
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-foreground">
                                                                        {kasurAtas?.student
                                                                            ? kasurAtas.student.name.length > 14
                                                                                ? `${kasurAtas.student.name.slice(0, 14)}...`
                                                                                : kasurAtas.student.name
                                                                            : 'Kasur Kosong'}
                                                                    </span>
                                                                </div>
                                                                {kasurAtas?.student ? (
                                                                    <span className="relative grid size-6 shrink-0 place-items-center rounded-lg bg-primary text-white text-[9px] font-bold uppercase">
                                                                        {kasurAtas.student.name.charAt(0).toUpperCase()}
                                                                        {kasurAtas.student.is_online && (
                                                                            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[9px] font-bold uppercase text-emerald-600">
                                                                        Pilih
                                                                    </span>
                                                                )}
                                                            </button>

                                                            <div className="mx-3 border-t-2 border-border/80" />

                                                            <button
                                                                type="button"
                                                                onClick={() => kasurBawah && handleKasurClick(rumahItem, room, kasurBawah)}
                                                                disabled={!kasurBawah || ['maintenance', 'nonaktif'].includes(kasurBawah.status)}
                                                                className={`flex items-center justify-between gap-2 px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                                    kasurBawah?.status === 'terisi'
                                                                        ? 'bg-primary/5 hover:bg-primary/10'
                                                                        : 'hover:bg-emerald-50/30'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[9px] font-bold uppercase text-muted">
                                                                        Bawah
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-foreground">
                                                                        {kasurBawah?.student
                                                                            ? kasurBawah.student.name.length > 14
                                                                                ? `${kasurBawah.student.name.slice(0, 14)}...`
                                                                                : kasurBawah.student.name
                                                                            : 'Kasur Kosong'}
                                                                    </span>
                                                                </div>
                                                                {kasurBawah?.student ? (
                                                                    <span className="relative grid size-6 shrink-0 place-items-center rounded-lg bg-primary text-white text-[9px] font-bold uppercase">
                                                                        {kasurBawah.student.name.charAt(0).toUpperCase()}
                                                                        {kasurBawah.student.is_online && (
                                                                            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[9px] font-bold uppercase text-emerald-600">
                                                                        Pilih
                                                                    </span>
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Kasur Placement / Detail Modal */}
            {modalOpen && selectedKasur && selectedRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
                    />
                    <div className="relative w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-soft-modal space-y-6">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <h3 className="font-display font-bold text-foreground text-lg">
                                {selectedRumah?.nama} — Kamar {selectedRoom.nomor_kamar} — Kasur {selectedKasur.posisi}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="text-muted hover:text-foreground"
                            >
                                Tutup
                            </button>
                        </div>

                        {selectedKasur.status === 'terisi' && selectedKasur.student ? (
                            // View Student Details and Vacate Options
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-12 place-items-center rounded-2xl bg-primary text-white font-bold text-lg">
                                        {selectedKasur.student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-display font-bold text-foreground text-base">
                                                {selectedKasur.student.name}
                                            </h4>
                                            <span className={`size-2.5 rounded-full ${
                                                selectedKasur.student.is_online ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`} />
                                        </div>
                                        <p className="text-xs text-muted">{selectedKasur.student.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-2xl border border-border bg-surface/50 p-4 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted">Program Aktif</span>
                                        <span className="font-semibold text-foreground">
                                            {selectedKasur.student.program}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">Posisi Kasur</span>
                                        <span className="font-semibold text-foreground capitalize">
                                            {selectedKasur.posisi}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">Status Online</span>
                                        <span className={`font-semibold ${
                                            selectedKasur.student.is_online ? 'text-emerald-600' : 'text-muted'
                                        }`}>
                                            {selectedKasur.student.is_online ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleVacate(selectedKasur.id)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                    >
                                        <UserMinus className="size-4" /> Kosongkan Kasur
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Place Student Form
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                                    <Info className="size-4 shrink-0" />
                                    Kasur kosong. Silakan cari siswa terdaftar untuk ditempatkan.
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted block">
                                        Cari Nama Siswa / Email
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSelectedStudent(null);
                                            }}
                                            placeholder="Ketik inisial nama siswa..."
                                            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-foreground outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Autocomplete Search Dropdown */}
                                {searchResults.length > 0 && !selectedStudent && (
                                    <div className="rounded-xl border border-border bg-white shadow-soft max-h-40 overflow-y-auto divide-y divide-border">
                                        {searchResults.map((item) => (
                                            <button
                                                type="button"
                                                key={item.id}
                                                onClick={() => {
                                                    setSelectedStudent({ id: item.id, name: item.name });
                                                    setSearchQuery(item.name);
                                                    setSearchResults([]);
                                                }}
                                                className="w-full px-4 py-2 text-left text-xs font-semibold text-foreground hover:bg-surface flex justify-between"
                                            >
                                                <span>{item.name}</span>
                                                <span className="text-[10px] text-muted">{item.email}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {searching && (
                                    <p className="text-[10px] text-muted italic">Mencari siswa...</p>
                                )}

                                {selectedStudent && (
                                    <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <User className="size-4 text-primary" />
                                            <span className="font-semibold text-primary">
                                                {selectedStudent.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedStudent(null)}
                                            className="text-[10px] text-danger font-semibold hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                                    <button
                                        type="button"
                                        disabled={!selectedStudent}
                                        onClick={handleAssign}
                                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95 disabled:opacity-50"
                                    >
                                        <UserPlus className="size-4" /> Tempatkan Siswa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Kamar Management Modal */}
            {manageKamarOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={() => setManageKamarOpen(false)}
                        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
                    />
                    <div className="relative w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-soft-modal">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <h3 className="font-display font-bold text-foreground text-lg">
                                {editingKamar ? 'Edit Kamar' : 'Tambah Kamar Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setManageKamarOpen(false)}
                                className="text-muted hover:text-foreground"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitKamar} className="mt-4 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Rumah
                                </label>
                                <select
                                    required
                                    value={kamarFormState.rumah_id}
                                    onChange={(e) => setKamarFormState({ ...kamarFormState, rumah_id: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
                                >
                                    {rumah.map((rumahItem) => (
                                        <option key={rumahItem.id} value={rumahItem.id}>
                                            {rumahItem.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Nomor Kamar
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={kamarFormState.nomor_kamar}
                                    onChange={(e) => setKamarFormState({ ...kamarFormState, nomor_kamar: e.target.value })}
                                    placeholder="Contoh: 01"
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Kapasitas Ranjang (tingkat)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    max={20}
                                    value={kamarFormState.kapasitas}
                                    onChange={(e) => setKamarFormState({ ...kamarFormState, kapasitas: parseInt(e.target.value) || 6 })}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="mt-1 text-[10px] text-muted">
                                    Setiap ranjang tingkat otomatis memiliki 2 kasur (atas & bawah).
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Status
                                </label>
                                <select
                                    value={kamarFormState.status}
                                    onChange={(e) => setKamarFormState({ ...kamarFormState, status: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
                                >
                                    <option value="tersedia">Tersedia</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Keterangan
                                </label>
                                <textarea
                                    value={kamarFormState.keterangan}
                                    onChange={(e) => setKamarFormState({ ...kamarFormState, keterangan: e.target.value })}
                                    placeholder="Opsional"
                                    rows={2}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                                <button
                                    type="button"
                                    onClick={() => setManageKamarOpen(false)}
                                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted transition hover:bg-surface"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                                >
                                    <Plus className="size-4" />
                                    {editingKamar ? 'Simpan Perubahan' : 'Buat Kamar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rumah Management Modal */}
            {manageRumahOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={() => setManageRumahOpen(false)}
                        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
                    />
                    <div className="relative w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-soft-modal">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <h3 className="font-display font-bold text-foreground text-lg">
                                {editingRumah ? 'Edit Rumah' : 'Tambah Rumah Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setManageRumahOpen(false)}
                                className="text-muted hover:text-foreground"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitRumah} className="mt-4 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Nama Rumah
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={rumahFormState.nama}
                                    onChange={(e) => setRumahFormState({ ...rumahFormState, nama: e.target.value })}
                                    placeholder="Contoh: Rumah 01"
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Status
                                </label>
                                <select
                                    value={rumahFormState.status}
                                    onChange={(e) => setRumahFormState({ ...rumahFormState, status: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Keterangan
                                </label>
                                <textarea
                                    value={rumahFormState.keterangan}
                                    onChange={(e) => setRumahFormState({ ...rumahFormState, keterangan: e.target.value })}
                                    placeholder="Opsional"
                                    rows={2}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                                <button
                                    type="button"
                                    onClick={() => setManageRumahOpen(false)}
                                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted transition hover:bg-surface"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                                >
                                    <Plus className="size-4" />
                                    {editingRumah ? 'Simpan Perubahan' : 'Buat Rumah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
