import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY } from '@/lib/constants';
import { Reveal } from '@/components/share-motion';
import { SectionHeader } from '@/components/landing/SectionHeader';

export function Gallery() {
    const [active, setActive] = useState<number | null>(null);

    const close = useCallback(() => setActive(null), []);
    const prev = useCallback(
        () => setActive((i) => (i === null ? null : (i - 1 + GALLERY.length) % GALLERY.length)),
        []
    );
    const next = useCallback(
        () => setActive((i) => (i === null ? null : (i + 1) % GALLERY.length)),
        []
    );

    useEffect(() => {
        if (active === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [active, close, prev, next]);

    return (
        <section id="galeri" className="scroll-mt-24 bg-white py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                <SectionHeader
                    title="Galeri Fasilitas"
                    description="Suasana dan fasilitas hunian serta lingkungan belajar Al Bayan Education."
                />

                <Reveal className="mt-14">
                    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
                        {GALLERY.map((photo, index) => (
                            <button
                                key={photo.title}
                                onClick={() => setActive(index)}
                                className="group relative block w-full overflow-hidden rounded-[20px] border border-border shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft-hover"
                            >
                                <img
                                    src={photo.image}
                                    alt={photo.title}
                                    className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            '/images/logo.png';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a120d]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <h3 className="font-semibold text-white">{photo.title}</h3>
                                    <p className="text-xs text-white/75">{photo.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </Reveal>
            </div>

            {active !== null && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a120d]/95 p-4 backdrop-blur-md sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Lightbox galeri"
                    onClick={close}
                >
                    <button
                        onClick={close}
                        aria-label="Tutup"
                        className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25"
                    >
                        <X className="size-6" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                        aria-label="Foto sebelumnya"
                        className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25 sm:left-8"
                    >
                        <ChevronLeft className="size-6" />
                    </button>

                    <div
                            className="flex h-[78vh] w-full max-w-[95vw] items-center justify-center overflow-hidden rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                key={active}
                                src={GALLERY[active].image}
                                alt={GALLERY[active].title}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                                }}
                                className="h-full w-full object-cover"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25 }}
                            />
                        </div>
                        <div className="mt-5 text-center">
                            <h3 className="font-display text-xl text-white">
                                {GALLERY[active].title}
                            </h3>
                            <p className="mt-1 text-sm text-white/75">
                                {GALLERY[active].description}
                            </p>
                            <p className="mt-2 text-xs text-white/50">
                                {active + 1} / {GALLERY.length}
                            </p>
                        </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                        aria-label="Foto berikutnya"
                        className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25 sm:right-8"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            )}
        </section>
    );
}
