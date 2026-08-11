import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import type { StudentProfile } from '@/types/models';

export default function DashboardProfile({ profile }: { profile: StudentProfile | null }) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: profile?.full_name ?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/profile');
    };

    return (
        <DashboardLayout>
            <Head title="Profil" />
            <div className="mx-auto max-w-2xl">
                <h1 className="text-2xl font-bold text-foreground">Profil Saya</h1>
                <p className="mt-1 text-sm text-muted">Perbarui informasi profil Anda.</p>

                <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft sm:p-8">
                    <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                            {profile?.full_name?.charAt(0) ?? 'A'}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">
                                {profile?.full_name}
                            </p>
                            <p className="text-sm text-muted">NIM: {profile?.nim}</p>
                            <p className="text-sm text-muted">
                                {profile?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5" noValidate>
                        <div>
                            <Label htmlFor="full_name" className="text-foreground">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                className="bg-white text-foreground"
                            />
                            <FormError message={errors.full_name} />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="text-foreground">
                                Nomor HP
                            </Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="bg-white text-foreground"
                                placeholder="08xxxxxxxxxx"
                            />
                            <FormError message={errors.phone} />
                        </div>
                        <div>
                            <Label htmlFor="address" className="text-foreground">
                                Alamat
                            </Label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="min-h-28 w-full rounded-[var(--radius-input)] border border-input bg-white px-4 py-3 text-sm text-foreground shadow-soft outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                                placeholder="Alamat lengkap"
                            />
                            <FormError message={errors.address} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
