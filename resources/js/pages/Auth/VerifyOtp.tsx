import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { FormError } from '@/components/ui/form-error';

export default function VerifyOtp() {
    const { email } = usePage().props as { email?: string };
    const { data, setData, post, processing, errors } = useForm({
        email: email ?? '',
        code: '',
    });
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (timer <= 0) return;
        const t = setTimeout(() => setTimer((v) => v - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/verify-otp');
    };

    return (
        <AuthLayout title="Verifikasi OTP">
            <p className="text-center text-sm text-muted">
                Masukkan kode OTP 6 digit yang dikirim ke{' '}
                <strong className="text-foreground">{email}</strong>.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-6" noValidate>
                <OtpInput value={data.code} onChange={(v) => setData('code', v)} />
                <FormError message={errors.code} className="justify-center" />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={data.code.length !== 6 || processing}
                >
                    {processing ? 'Memverifikasi...' : 'Verifikasi'}
                </Button>

                <p className="text-center text-xs text-muted">
                    Belum menerima kode?{' '}
                    <button
                        type="button"
                        disabled={timer > 0}
                        className="font-semibold text-primary disabled:opacity-40"
                        onClick={() => setTimer(60)}
                    >
                        {timer > 0 ? `Kirim ulang dalam ${timer}s` : 'Kirim Ulang'}
                    </button>
                </p>
            </form>
        </AuthLayout>
    );
}
