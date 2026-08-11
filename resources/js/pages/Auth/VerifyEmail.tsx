import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { FormError } from '@/components/ui/form-error';

export default function VerifyEmail() {
    const { data, setData, post, processing, errors } = useForm({ code: '' });
    const { post: resend, processing: resending } = useForm();
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (timer <= 0) return;
        const t = setTimeout(() => setTimer((v) => v - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.code.length === 6) post('/verify-email');
    };

    return (
        <AuthLayout title="Verifikasi Email">
            <p className="text-center text-sm text-muted">
                Kami telah mengirim kode OTP 6 digit ke email Anda. Masukkan kode untuk
                menyelesaikan verifikasi.
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

                <div className="text-center">
                    <p className="text-xs text-muted">
                        {timer > 0 ? `Kirim ulang dalam ${timer} detik` : 'Tidak menerima kode?'}{' '}
                        <button
                            type="button"
                            disabled={timer > 0 || resending}
                            onClick={() => {
                                resend('/verify-email/resend');
                                setTimer(60);
                            }}
                            className="font-semibold text-primary disabled:opacity-40"
                        >
                            {resending ? 'Mengirim...' : 'Kirim Ulang'}
                        </button>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
