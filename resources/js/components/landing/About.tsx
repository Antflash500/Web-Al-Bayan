import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/share-motion';

const highlights = [
    'Pembelajaran Bahasa Arab terstruktur',
    'Hunian mahasiswa yang nyaman',
    'Lingkungan islami yang kondusif',
    'Pembinaan akademik dan karakter',
];

export function About() {
    return (
        <section id="tentang" className="scroll-mt-24 bg-white py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
                    <Reveal>
                        <div className="relative">
                            <div className="aspect-[4/3] overflow-hidden rounded-[20px] border border-border shadow-soft">
                                <img
                                    src="/images/landing.png"
                                    alt="Lingkungan Al Bayan Education"
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            '/images/logo.png';
                                    }}
                                />
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
                            Lembaga Bahasa Arab yang{' '}
                            <span className="text-primary">Modern & Kontekstual</span>
                        </h2>
                        <p className="mt-6 max-w-xl leading-relaxed text-muted">
                            Al Bayan Education menghadirkan pembelajaran Bahasa Arab berkualitas
                            serta hunian mahasiswa yang nyaman dalam satu lingkungan islami. Kami
                            membangun ekosistem yang mendukung perkembangan akademik dan karakter
                            setiap peserta.
                        </p>

                        <ul className="mt-8 space-y-4">
                            {highlights.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-foreground">
                                    <span className="mt-2 size-2 shrink-0 rounded-full bg-secondary" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 flex items-center justify-end gap-10 border-t border-border pt-8">
                            <a
                                href="/register"
                                className="group ml-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
                            >
                                Mulai Belajar
                                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
