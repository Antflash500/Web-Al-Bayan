import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
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

interface RanjangData {
    id: number;
    nomor_ranjang: string;
    status: 'tersedia' | 'terisi' | 'maintenance' | 'nonaktif';
    student: StudentData | null;
}

interface KamarData {
    id: number;
    nomor_kamar: string;
    status: string;
    keterangan: string;
    ranjang: RanjangData[];
}

interface AsramaProps {
    stats: {
        totalKamar: number;
        totalRanjang: number;
        terisi: number;
        tersedia: number;
    };
    rooms: KamarData[];
}

export default function Asrama({ stats, rooms }: AsramaProps) {
    const [selectedBed, setSelectedBed] = useState<RanjangData | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<KamarData | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [manageKamarOpen, setManageKamarOpen] = useState(false);
    const [editingKamar, setEditingKamar] = useState<KamarData | null>(null);

    const kamarForm = {
        nomor_kamar: editingKamar?.nomor_kamar ?? '',
        kapasitas: editingKamar?.ranjang?.length ?? 6,
        status: editingKamar?.status ?? 'tersedia',
        keterangan: editingKamar?.keterangan ?? '',
    };

    const [kamarFormState, setKamarFormState] = useState(kamarForm);

    // Search and Autocomplete States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ id: number; name: string; email: string }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string } | null>(null);
    const [searching, setSearching] = useState(false);

    const handleBedClick = (room: KamarData, bed: RanjangData) => {
        setSelectedRoom(room);
        setSelectedBed(bed);
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
        if (!selectedStudent || !selectedBed) return;

        router.post(
            '/admin/asrama/assign',
            {
                user_id: selectedStudent.id,
                ranjang_id: selectedBed.id,
            },
            {
                onSuccess: () => {
                    setModalOpen(false);
                    setSelectedBed(null);
                    setSelectedRoom(null);
                },
            }
        );
    };

    const handleVacate = (ranjangId: number) => {
        if (!confirm('Apakah Anda yakin ingin mengosongkan ranjang ini?')) return;

        router.post(
            `/admin/asrama/vacate/${ranjangId}`,
            {},
            {
                onSuccess: () => {
                    setModalOpen(false);
                    setSelectedBed(null);
                    setSelectedRoom(null);
                },
            }
        );
    };

    const handleCreateKamar = () => {
        setEditingKamar(null);
        setKamarFormState({
            nomor_kamar: '',
            kapasitas: 6,
            status: 'tersedia',
            keterangan: '',
        });
        setManageKamarOpen(true);
    };

    const handleEditKamar = (kamar: KamarData) => {
        setEditingKamar(kamar);
        setKamarFormState({
            nomor_kamar: kamar.nomor_kamar,
            kapasitas: kamar.ranjang?.length ?? 6,
            status: kamar.status,
            keterangan: kamar.keterangan ?? '',
        });
        setManageKamarOpen(true);
    };

    const handleDeleteKamar = (kamarId: number) => {
        if (!confirm('Hapus kamar ini? Semua ranjang harus kosong.')) return;
        router.delete(`/admin/asrama/kamar/${kamarId}`);
    };

    const submitKamar = (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
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
                            Kelola kapasitas kamar, penempatan ranjang mahasiswa, dan status penempatan.
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
                                    onClick={handleCreateKamar}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                                >
                            <Plus className="size-4" /> Tambah Kamar
                        </button>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-4 sm:grid-cols-4">
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

                {/* Rooms Grid Layout */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-4"
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
                                        room.status === 'penuh' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        {room.status === 'penuh' ? 'Penuh' : 'Tersedia'}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEditKamar(room)}
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

                            {/* 6 Beds Visualizer Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {room.ranjang.map((bed) => (
                                    <button
                                        type="button"
                                        key={bed.id}
                                        onClick={() => handleBedClick(room, bed)}
                                        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                                            bed.status === 'terisi'
                                                ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                                                : 'border-border bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
                                        }`}
                                    >
                                        <div>
                                            <span className="text-[10px] font-bold text-muted block uppercase">
                                                Ranjang
                                            </span>
                                            <span className="font-display text-sm font-bold text-foreground">
                                                {bed.nomor_ranjang}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {bed.status === 'terisi' ? (
                                                <div className="relative">
                                                    <span className="grid size-7 place-items-center rounded-lg bg-primary text-white text-[10px] font-bold uppercase">
                                                        {bed.student?.name.charAt(0).toUpperCase()}
                                                    </span>
                                                    {bed.student?.is_online && (
                                                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                                                    Tersedia
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bed Placement / Detail Modal Drawer */}
            {modalOpen && selectedBed && selectedRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
                    />
                    <div className="relative w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-soft-modal space-y-6">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <h3 className="font-display font-bold text-foreground text-lg">
                                Kamar {selectedRoom.nomor_kamar} — Ranjang {selectedBed.nomor_ranjang}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="text-muted hover:text-foreground"
                            >
                                Tutup
                            </button>
                        </div>

                        {selectedBed.status === 'terisi' && selectedBed.student ? (
                            // View Student Details and Vacate Options
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="grid size-12 place-items-center rounded-2xl bg-primary text-white font-bold text-lg">
                                        {selectedBed.student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-display font-bold text-foreground text-base">
                                                {selectedBed.student.name}
                                            </h4>
                                            <span className={`size-2.5 rounded-full ${
                                                selectedBed.student.is_online ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`} />
                                        </div>
                                        <p className="text-xs text-muted">{selectedBed.student.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-2xl border border-border bg-surface/50 p-4 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted">Program Aktif</span>
                                        <span className="font-semibold text-foreground">
                                            {selectedBed.student.program}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">Status Online</span>
                                        <span className={`font-semibold ${
                                            selectedBed.student.is_online ? 'text-emerald-600' : 'text-muted'
                                        }`}>
                                            {selectedBed.student.is_online ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleVacate(selectedBed.id)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                                    >
                                        <UserMinus className="size-4" /> Kosongkan Ranjang
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Place Student Form
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                                    <Info className="size-4 shrink-0" />
                                    Ranjang kosong. Silakan cari siswa terdaftar untuk ditempatkan.
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
                                    Nomor Kamar
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={kamarFormState.nomor_kamar}
                                    onChange={(e) => setKamarFormState({...kamarFormState, nomor_kamar: e.target.value})}
                                    placeholder="Contoh: 01"
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Kapasitas Ranjang
                                </label>
                                <input
                                    type="number"
                                    required
                                    min={1}
                                    max={20}
                                    value={kamarFormState.kapasitas}
                                    onChange={(e) => setKamarFormState({...kamarFormState, kapasitas: parseInt(e.target.value) || 6})}
                                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">
                                    Status
                                </label>
                                <select
                                    value={kamarFormState.status}
                                    onChange={(e) => setKamarFormState({...kamarFormState, status: e.target.value})}
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
                                    onChange={(e) => setKamarFormState({...kamarFormState, keterangan: e.target.value})}
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
        </AdminLayout>
    );
}
