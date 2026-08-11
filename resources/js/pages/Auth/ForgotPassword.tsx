import { useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <AuthLayout title="Lupa Password">
            <p className="text-center text-sm text-muted">
                Masukkan email Anda untuk menerima kode OTP verifikasi.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="pl-11"
                            placeholder="nama@email.com"
                            autoComplete="email"
                        />
                    </div>
                    <FormError message={errors.email} />
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={processing}>
                    {processing ? 'Mengirim OTP...' : 'Kirim OTP'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Ingat password?{' '}
                <a
                    href="/login"
                    className="font-semibold text-primary transition-colors hover:text-secondary"
                >
                    Kembali ke masuk
                </a>
            </p>
        </AuthLayout>
    );
}
