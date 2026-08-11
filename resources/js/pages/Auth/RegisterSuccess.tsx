import { Link } from '@inertiajs/react';
import { Clock4, Home } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';

export default function RegisterSuccess() {
    return (
        <AuthLayout title="Pendaftaran Terkirim">
            <div className="flex flex-col items-center text-center">
                <span className="grid size-16 place-items-center rounded-full bg-secondary/10 text-secondary">
                    <Clock4 className="size-8" />
                </span>

                <h2 className="mt-5 font-display text-xl font-bold text-foreground">
                    Alhamdulillah, akun Anda selesai dibuat
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                    Silakan tunggu konfirmasi admin untuk username/password Anda.
                </p>

                <div className="mt-6 flex w-full flex-col gap-3">
                    <Link href="/" className="w-full">
                        <Button variant="secondary" className="w-full">
                            <Home className="size-4" />
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}