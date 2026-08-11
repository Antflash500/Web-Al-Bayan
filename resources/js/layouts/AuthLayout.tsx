import { type ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { SITE } from '@/lib/constants';

export default function AuthLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <div className="flex min-h-[100dvh] flex-col bg-surface lg:flex-row">
            <Head title={title} />

            {/* Brand panel */}
            <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-primary p-12 lg:flex xl:p-16">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="geometric-pattern absolute inset-0 opacity-60" />
                    <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_-10%,rgba(34,197,94,0.18),transparent_60%)]" />
                    <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-secondary/10 blur-3xl" />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3">
                        <img
                            src={SITE.logoAuth}
                            alt={`Logo ${SITE.name}`}
                            className="size-12 rounded-xl object-cover ring-1 ring-white/20"
                            width={48}
                            height={48}
                        />
                        <span className="font-display text-2xl text-white">Al Bayan</span>
                    </div>

                    <h2 className="mt-14 font-display text-4xl font-bold leading-tight text-white xl:text-[2.75rem]">
                        Belajar Bahasa Arab dalam Lingkungan yang Kondusif
                    </h2>
                    <p className="mt-5 max-w-md leading-relaxed text-white/70">
                        Lembaga pendidikan Bahasa Arab dengan hunian mahasiswa yang nyaman dalam
                        lingkungan islami yang kondusif.
                    </p>
                </div>

                <div className="relative">
                    <div className="h-px w-full bg-white/15" />
                    <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
                        <span>
                            {SITE.address.street}, {SITE.address.city}
                        </span>
                        <span>{SITE.phone}</span>
                    </div>
                </div>
            </aside>

            {/* Form panel */}
            <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center text-center lg:hidden">
                        <img
                            src={SITE.logoAuth}
                            alt={`Logo ${SITE.name}`}
                            className="size-14 rounded-xl object-cover"
                            width={56}
                            height={56}
                        />
                        <h1 className="mt-3 font-display text-xl font-bold text-primary">
                            Al Bayan
                        </h1>
                    </div>

                    <div className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-soft sm:p-9">
                        <Link
                            href="/"
                            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke Beranda
                        </Link>

                        <h1 className="font-display text-2xl font-bold text-primary sm:text-[1.75rem]">
                            {title}
                        </h1>

                        <div className="mt-6">{children}</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
