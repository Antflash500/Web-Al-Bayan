import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Megaphone, Plus, Send, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import type { Pengumuman } from '@/types/models';

export default function Announcements({
    announcements,
    flash,
}: {
    announcements: Pengumuman[];
    flash?: { success?: string };
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
        isi: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements', {
            onSuccess: () => reset(),
        });
    };

    const destroy = (a: Pengumuman) => {
        if (window.confirm(`Hapus pengumuman "${a.judul}"?`)) {
            router.delete(`/admin/announcements/${a.id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin | Pengumuman" />

            <div>
                <h1 className="font-display text-2xl text-foreground sm:text-3xl">Pengumuman</h1>
                <p className="mt-1 text-sm text-muted">
                    Kelola informasi dan pengumuman untuk seluruh santri.
                </p>
            </div>

            {flash?.success && (
                <p role="status" className="mt-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                    {flash.success}
                </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section
                    aria-label="Buat pengumuman"
                    className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft"
                >
                    <h2 className="flex items-center gap-2 font-semibold text-foreground">
                        <Plus className="size-4 text-secondary" /> Terbitkan Baru
                    </h2>
                    <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
                        <div>
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                placeholder="Judul pengumuman"
                            />
                            <FormError message={errors.judul} />
                        </div>
                        <div>
                            <Label htmlFor="isi">Isi</Label>
                            <textarea
                                id="isi"
                                value={data.isi}
                                onChange={(e) => setData('isi', e.target.value)}
                                rows={6}
                                placeholder="Tulis isi pengumuman..."
                                className="w-full rounded-[var(--radius-input)] border border-input bg-white px-4 py-3 text-sm text-foreground shadow-soft outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                            />
                            <FormError message={errors.isi} />
                        </div>
                        <Button type="submit" variant="primary" className="w-full" disabled={processing}>
                            <Send className="size-4" /> {processing ? 'Menerbitkan...' : 'Terbitkan'}
                        </Button>
                    </form>
                </section>

                <section
                    aria-label="Daftar pengumuman"
                    className="lg:col-span-2 rounded-[var(--radius-card)] border border-border bg-white shadow-soft"
                >
                    <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                        <Megaphone className="size-4 text-secondary" />
                        <h2 className="font-semibold text-foreground">
                            Semua Pengumuman ({announcements.length})
                        </h2>
                    </div>
                    {announcements.length === 0 ? (
                        <div className="px-6 py-16 text-center text-sm text-muted">
                            Belum ada pengumuman.
                        </div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {announcements.map((a) => (
                                <li key={a.id} className="flex items-start gap-4 px-5 py-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-foreground">{a.judul}</p>
                                        <p className="mt-1 line-clamp-2 text-sm text-muted">{a.isi}</p>
                                        <p className="mt-2 text-xs text-muted">
                                            {a.tanggal_publish
                                                ? new Date(a.tanggal_publish).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      }
                                                  )
                                                : '—'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => destroy(a)}
                                        aria-label={`Hapus ${a.judul}`}
                                        className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-button)] text-danger transition hover:bg-danger/5"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}