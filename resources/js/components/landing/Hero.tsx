import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { scrollToSection } from '@/lib/scroll';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay: number, y = 24) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
});

export function Hero() {
    return (
        <section
            id="beranda"
            className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[#f6faf7]"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(34,197,94,0.1),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_100%_110%,rgba(212,160,23,0.05),transparent_65%)]" />
                <div className="geometric-pattern absolute inset-0 opacity-80 [mask-image:radial-gradient(75%_70%_at_50%_35%,black,transparent)]" />
            </div>

            <div className="relative mx-auto w-full max-w-4xl px-4 pb-24 pt-32 text-center sm:px-6">
                <motion.h1
                    className="font-display text-[2.75rem] font-bold leading-[1.08] text-primary sm:text-6xl lg:text-[4.25rem]"
                    {...reveal(0.05)}
                >
                    Belajar Bahasa Arab dalam Lingkungan yang Kondusif
                </motion.h1>

                <motion.p
                    className="mx-auto mt-6 max-w-2xl text-lg font-medium text-primary/80 sm:text-xl"
                    {...reveal(0.15)}
                >
                    Lembaga Pendidikan Bahasa Arab & Hunian Mahasiswa
                </motion.p>

                <motion.p
                    className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
                    {...reveal(0.25)}
                >
                    {SITE.description}
                </motion.p>

                <motion.div
                    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    {...reveal(0.35)}
                >
                    <a
                        href="/register"
                        className={cn(
                            buttonVariants({ variant: 'primary', size: 'lg' }),
                            'w-full rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-hover sm:w-auto'
                        )}
                    >
                        Daftar Sekarang
                        <ArrowRight className="size-4" />
                    </a>
                    <a href="/programs" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('/programs');
                            }}
                            className="w-full rounded-xl border-border bg-white text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-soft sm:w-auto"
                        >
                            Lihat Program
                        </Button>
                    </a>
                </motion.div>
            </div>

            <a
                href="/tentang"
                aria-label="Scroll ke bawah"
                onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('/tentang');
                }}
                className="absolute bottom-6 left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full border border-border bg-white text-primary shadow-soft transition-colors hover:bg-surface"
            >
                <ChevronDown className="size-5" />
            </a>
        </section>
    );
}
