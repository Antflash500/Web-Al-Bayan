import { useForm, usePage } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';

export default function ResetPassword() {
    const { email } = usePage().props as { email?: string };
    const { data, setData, post, processing, errors } = useForm({
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <AuthLayout title="Atur Password Baru">
            <p className="text-center text-sm text-muted">
                Buat password baru untuk akun{' '}
                <strong className="text-foreground">{email || 'Anda'}</strong>.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                <div>
                    <Label htmlFor="password">Password Baru</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="pl-11"
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                        />
                    </div>
                    <FormError message={errors.password} />
                </div>

                <div>
                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="pl-11"
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Password'}
                </Button>
            </form>
        </AuthLayout>
    );
}
