import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Download, Pencil, Save } from 'lucide-react';
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
        father_name?: string | null;
        father_address?: string | null;
        father_occupation?: string | null;
        father_phone?: string | null;
        mother_name?: string | null;
        mother_address?: string | null;
        mother_occupation?: string | null;
        mother_phone?: string | null;
    };
    asrama?: {
        rumah?: string | null;
        kamar?: string | null;
        ranjang?: string | null;
        posisi?: string | null;
        status?: string | null;
        tanggal_masuk?: string | null;
        catatan?: string | null;
    } | null;
}

const inputClass = (editable: boolean) =>
    editable
        ? 'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
        : 'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground cursor-not-allowed';

export default function Profil({ user, asrama }: ProfilProps) {
    const [isEditing, setIsEditing] = useState(false);

    const profileForm = useForm({
        name: user.name || '',
        username: user.username || '',
        nik: user.nik || '',
        birth_date: user.birth_date || '',
        gender: user.gender || '',
        account_status: user.account_status || '',
        phone: user.phone || '',
        address: user.address || '',
        father_name: user.father_name || '',
        father_address: user.father_address || '',
        father_occupation: user.father_occupation || '',
        father_phone: user.father_phone || '',
        mother_name: user.mother_name || '',
        mother_address: user.mother_address || '',
        mother_occupation: user.mother_occupation || '',
        mother_phone: user.mother_phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/siswa/profil', {
            onSuccess: () => setIsEditing(false),
        });
    };

    const downloadData = () => {
        const payload = {
            data_siswa: {
                id: user.id,
                nama_lengkap: user.name,
                username: user.username,
                email: user.email,
                nik: user.nik,
                tanggal_lahir: user.birth_date,
                jenis_kelamin: user.gender === 'male' ? 'Laki-laki' : user.gender === 'female' ? 'Perempuan' : user.gender,
                status_akun: user.account_status,
                status_pendaftaran: user.registration_status,
                nomor_telepon: user.phone,
                alamat: user.address,
            },
            data_orang_tua: {
                nama_ayah: user.father_name,
                alamat_ayah: user.father_address,
                pekerjaan_ayah: user.father_occupation,
                nomor_hp_ayah: user.father_phone,
                nama_ibu: user.mother_name,
                alamat_ibu: user.mother_address,
                pekerjaan_ibu: user.mother_occupation,
                nomor_hp_ibu: user.mother_phone,
            },
            data_asrama: asrama
                ? {
                      rumah: asrama.rumah,
                      kamar: asrama.kamar,
                      ranjang: asrama.ranjang,
                      posisi: asrama.posisi,
                      status: asrama.status,
                      tanggal_masuk: asrama.tanggal_masuk,
                      catatan: asrama.catatan,
                  }
                : null,
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profil-${user.username || user.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <StudentPortalLayout title="Profil Saya">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                            Profil Saya
                        </h2>
                        <p className="text-xs text-muted">
                            Kelola data diri, informasi orang tua, dan asrama Anda.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={downloadData}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-surface"
                    >
                        <Download className="size-4" /> Download Data
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Card 1: Data Diri */}
                    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Data Diri</h3>
                            <p className="text-xs text-muted">Kelola data diri Anda.</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className={inputClass(isEditing)}
                                />
                                {isEditing && profileForm.errors.name && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.name}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">NIK</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={profileForm.data.nik ?? '—'}
                                    onChange={(e) => profileForm.setData('nik', e.target.value)}
                                    className={inputClass(isEditing)}
                                />
                                {isEditing && profileForm.errors.nik && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.nik}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">Username</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={profileForm.data.username ?? '—'}
                                    onChange={(e) => profileForm.setData('username', e.target.value)}
                                    className={inputClass(isEditing)}
                                />
                                {isEditing && profileForm.errors.username && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.username}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    disabled={!isEditing}
                                    value={profileForm.data.birth_date ?? ''}
                                    onChange={(e) => profileForm.setData('birth_date', e.target.value)}
                                    className={inputClass(isEditing)}
                                />
                                {isEditing && profileForm.errors.birth_date && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.birth_date}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">Jenis Kelamin</label>
                                <select
                                    disabled={!isEditing}
                                    value={profileForm.data.gender ?? ''}
                                    onChange={(e) => profileForm.setData('gender', e.target.value)}
                                    className={inputClass(isEditing)}
                                >
                                    <option value="">— Pilih —</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                                {isEditing && profileForm.errors.gender && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.gender}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">Status Akun</label>
                                <select
                                    disabled={!isEditing}
                                    value={profileForm.data.account_status ?? ''}
                                    onChange={(e) => profileForm.setData('account_status', e.target.value)}
                                    className={inputClass(isEditing)}
                                >
                                    <option value="">— Pilih —</option>
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                    <option value="pending">Menunggu Konfirmasi</option>
                                </select>
                                {isEditing && profileForm.errors.account_status && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.account_status}</span>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted block mb-1">Nomor Telepon / WA</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                    placeholder="081234567890"
                                    className={inputClass(isEditing)}
                                />
                                {isEditing && profileForm.errors.phone && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.phone}</span>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-muted block mb-1">Alamat Lengkap</label>
                                <textarea
                                    rows={3}
                                    disabled={!isEditing}
                                    value={profileForm.data.address}
                                    onChange={(e) => profileForm.setData('address', e.target.value)}
                                    placeholder="Tuliskan alamat lengkap..."
                                    className={inputClass(isEditing)}
                                />
                                {isEditing && profileForm.errors.address && (
                                    <span className="text-[11px] text-danger mt-1 block">{profileForm.errors.address}</span>
                                )}
                            </div>
                        </div>

                        {asrama && (
                            <div className="rounded-2xl border border-border bg-surface/50 p-5 space-y-3">
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Data Asrama</h4>
                                    <p className="text-[11px] text-muted">Penempatan asrama Anda (hanya tampilan).</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <span className="text-[11px] font-semibold text-muted">Rumah</span>
                                        <p className="text-xs font-medium text-foreground">{asrama.rumah ?? '—'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-semibold text-muted">Kamar</span>
                                        <p className="text-xs font-medium text-foreground">{asrama.kamar ?? '—'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-semibold text-muted">Ranjang</span>
                                        <p className="text-xs font-medium text-foreground">{asrama.ranjang ?? '—'}</p>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-semibold text-muted">Posisi Kasur</span>
                                        <p className="text-xs font-medium text-foreground capitalize">{asrama.posisi ?? '—'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card 2: Data Orang Tua */}
                    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Data Orang Tua</h3>
                            <p className="text-xs text-muted">Kelola informasi orang tua Anda.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-foreground">Ayah</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-semibold text-muted block mb-1">Nama Ayah</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileForm.data.father_name}
                                            onChange={(e) => profileForm.setData('father_name', e.target.value)}
                                            placeholder="Nama lengkap ayah"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted block mb-1">Nomor HP Ayah</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileForm.data.father_phone}
                                            onChange={(e) => profileForm.setData('father_phone', e.target.value)}
                                            placeholder="081234567890"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-muted block mb-1">Alamat Ayah</label>
                                        <textarea
                                            rows={2}
                                            disabled={!isEditing}
                                            value={profileForm.data.father_address}
                                            onChange={(e) => profileForm.setData('father_address', e.target.value)}
                                            placeholder="Alamat ayah"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted block mb-1">Pekerjaan Ayah</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileForm.data.father_occupation}
                                            onChange={(e) => profileForm.setData('father_occupation', e.target.value)}
                                            placeholder="Pekerjaan ayah"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-foreground">Ibu</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-semibold text-muted block mb-1">Nama Ibu</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileForm.data.mother_name}
                                            onChange={(e) => profileForm.setData('mother_name', e.target.value)}
                                            placeholder="Nama lengkap ibu"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted block mb-1">Nomor HP Ibu</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileForm.data.mother_phone}
                                            onChange={(e) => profileForm.setData('mother_phone', e.target.value)}
                                            placeholder="081234567890"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-muted block mb-1">Alamat Ibu</label>
                                        <textarea
                                            rows={2}
                                            disabled={!isEditing}
                                            value={profileForm.data.mother_address}
                                            onChange={(e) => profileForm.setData('mother_address', e.target.value)}
                                            placeholder="Alamat ibu"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted block mb-1">Pekerjaan Ibu</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileForm.data.mother_occupation}
                                            onChange={(e) => profileForm.setData('mother_occupation', e.target.value)}
                                            placeholder="Pekerjaan ibu"
                                            className={inputClass(isEditing)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        profileForm.reset();
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-xs font-bold text-foreground transition hover:bg-surface"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95 disabled:opacity-50"
                                >
                                    <Save className="size-4" /> Simpan Perubahan
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-primary/95"
                            >
                                <Pencil className="size-4" /> Edit Profil
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </StudentPortalLayout>
    );
}
