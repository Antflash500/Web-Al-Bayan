import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { cn } from '@/lib/utils';

const STEPS = ['Data Siswa', 'Data Pribadi', 'Konfirmasi'];

const fieldVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
};

const genderLabel = (value: string) => (value === 'female' ? 'Perempuan' : 'Laki-laki');

export default function Register() {
    const [step, setStep] = useState(0);
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        nik: '',
        email: '',
        phone: '',
        address: '',
        birth_date: '',
        gender: '',
        website: '',
    });

    const nickDigitsOnly = (value: string) => value.replace(/\D/g, '').slice(0, 16);
    const nikValid = data.nik.length === 16;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

    const stepOneValid =
        data.full_name.trim() !== '' &&
        nikValid &&
        emailValid;

    const stepTwoValid =
        data.address.trim() !== '' &&
        data.birth_date !== '' &&
        data.gender !== '';

    const next = () => {
        if ((step === 0 && !stepOneValid) || (step === 1 && !stepTwoValid)) return;
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const back = () => setStep((s) => Math.max(s - 1, 0));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AuthLayout title="Daftar Siswa">
            <div className="mb-6 flex items-center">
                {STEPS.map((label, i) => (
                    <div key={label} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <span
                                className={cn(
                                    'grid size-8 place-items-center rounded-full text-xs font-bold transition-colors duration-300',
                                    i < step
                                        ? 'bg-secondary text-white'
                                        : i === step
                                          ? 'bg-primary text-white'
                                          : 'bg-surface text-muted ring-1 ring-inset ring-border'
                                )}
                            >
                                {i < step ? <Check className="size-4" /> : i + 1}
                            </span>
                            <span className="text-[11px] font-medium text-muted">{label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className={cn(
                                    'mx-2 mb-5 h-0.5 flex-1 rounded-full transition-colors duration-300',
                                    i < step ? 'bg-secondary' : 'bg-border'
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={submit} noValidate>
                <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Jangan diisi</label>
                    <input
                        id="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                    />
                </div>
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step-0"
                            variants={fieldVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            <div>
                                <Label htmlFor="full_name">Nama Lengkap</Label>
                                <Input
                                    id="full_name"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    placeholder="Nama sesuai identitas (KTP)"
                                    autoComplete="name"
                                />
                                <FormError message={errors.full_name} />
                            </div>
                            <div>
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    value={data.nik}
                                    onChange={(e) => setData('nik', nickDigitsOnly(e.target.value))}
                                    placeholder="16 digit Nomor Induk Kependudukan"
                                    inputMode="numeric"
                                    autoComplete="off"
                                />
                                {data.nik.length > 0 && !nikValid && (
                                    <p className="mt-1.5 text-xs text-danger">
                                        NIK harus terdiri dari tepat 16 digit angka.
                                    </p>
                                )}
                                <FormError message={errors.nik} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    autoComplete="email"
                                />
                                {data.email.length > 0 && !emailValid && (
                                    <p className="mt-1.5 text-xs text-danger">
                                        Format email tidak valid.
                                    </p>
                                )}
                                <FormError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="phone">Nomor HP</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    autoComplete="tel"
                                />
                                <FormError message={errors.phone} />
                            </div>
                            <Button
                                type="button"
                                onClick={next}
                                disabled={!stepOneValid}
                                className="w-full"
                            >
                                Lanjut
                                <ArrowRight className="size-4" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step-1"
                            variants={fieldVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            <div>
                                <Label htmlFor="address">Alamat Siswa</Label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Contoh No. 10, RT 02/RW 03, Desa ..., Kecamatan ..., Kabupaten ..."
                                    className="w-full rounded-[var(--radius-input)] border border-input bg-white px-4 py-3 text-sm text-foreground shadow-soft outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                                />
                                <FormError message={errors.address} />
                            </div>
                            <div>
                                <Label htmlFor="birth_date">Tanggal Lahir</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                />
                                <FormError message={errors.birth_date} />
                            </div>
                            <div>
                                <Label>Jenis Kelamin</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'male', label: 'Laki-laki' },
                                        { value: 'female', label: 'Perempuan' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setData('gender', opt.value)}
                                            className={cn(
                                                'h-12 rounded-[var(--radius-input)] border text-sm font-medium transition-all duration-200',
                                                data.gender === opt.value
                                                    ? 'border-secondary bg-secondary text-white shadow-soft'
                                                    : 'border-border bg-white text-foreground hover:border-primary/40'
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <FormError message={errors.gender} />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={back}
                                    className="w-14 border-border"
                                >
                                    <ArrowLeft className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={next}
                                    disabled={!stepTwoValid}
                                    className="flex-1"
                                >
                                    Lanjut
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step-2"
                            variants={fieldVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            <div className="rounded-xl border border-border bg-surface p-5">
                                <p className="text-sm leading-relaxed text-foreground/80">
                                    Pastikan data berikut sudah benar sebelum mengirim pendaftaran.
                                    Username & password akun akan dibuat oleh admin setelah
                                    pendaftaran disetujui.
                                </p>
                            </div>

                            <dl className="space-y-3 rounded-xl border border-border bg-white p-5 text-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">Nama Lengkap</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {data.full_name}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">NIK</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {data.nik}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">Email</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {data.email}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">Nomor HP</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {data.phone || '-'}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">Alamat</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {data.address}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">Tanggal Lahir</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {data.birth_date}
                                    </dd>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <dt className="text-muted">Jenis Kelamin</dt>
                                    <dd className="text-right font-medium text-foreground">
                                        {genderLabel(data.gender)}
                                    </dd>
                                </div>
                            </dl>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={back}
                                    className="w-14 border-border"
                                >
                                    <ArrowLeft className="size-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pendaftaran'}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Sudah punya akun?{' '}
                <Link
                    href="/login"
                    className="font-semibold text-primary transition-colors hover:text-secondary"
                >
                    Masuk di sini
                </Link>
            </p>
        </AuthLayout>
    );
}