import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';

export default function Login() {
    const [show, setShow] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <AuthLayout title="Login Admin">
            <form onSubmit={submit} className="space-y-5" noValidate>
                <div>
                    <Label htmlFor="username">Username atau Email</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className="pl-11"
                            placeholder="masukkan username atau email"
                            autoComplete="username"
                            autoFocus
                        />
                    </div>
                    <FormError message={errors.username} />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            id="password"
                            type={show ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="pl-11 pr-11"
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShow((v) => !v)}
                            aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                        >
                            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <FormError message={errors.password} />
                </div>

                <label className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="size-4 rounded border-border accent-secondary"
                    />
                    Ingat saya
                </label>

                <Button type="submit" variant="primary" className="w-full" disabled={processing}>
                    {processing ? (
                        'Memproses...'
                    ) : (
                        <>
                            <ShieldCheck className="size-4" /> Masuk Admin
                        </>
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
}