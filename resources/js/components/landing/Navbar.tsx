import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_MENU, SITE } from '@/lib/constants';
import { scrollToSection } from '@/lib/scroll';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
            <nav
                className={cn(
                    'mx-auto flex w-full max-w-[1280px] items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 sm:px-5',
                    scrolled
                        ? 'border-border bg-white/90 shadow-soft backdrop-blur-xl'
                        : 'border-transparent bg-white/60 backdrop-blur-md'
                )}
            >
                <a
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('/');
                    }}
                    className="flex items-center gap-3"
                >
                    <img
                        src={SITE.logo}
                        alt={`Logo ${SITE.name}`}
                        className="h-12 w-12 rounded-lg object-cover"
                        width={48}
                        height={48}
                    />
                    <span className="font-display text-lg text-primary sm:text-xl">Al Bayan</span>
                </a>

                <div className="hidden items-center gap-1 md:flex">
                    {NAV_MENU.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(item.href);
                            }}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                <button
                    type="button"
                    aria-label="Buka menu"
                    onClick={() => setOpen(true)}
                    className="grid size-10 place-items-center rounded-lg text-primary hover:bg-primary/5 md:hidden"
                >
                    <Menu className="size-5" />
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.button
                            aria-label="Tutup menu"
                            className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            className="fixed inset-x-4 top-4 z-50 rounded-2xl border border-border bg-white p-5 shadow-soft-modal md:hidden"
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2, ease: EASE }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={SITE.logo}
                                        alt={`Logo ${SITE.name}`}
                                        className="h-9 w-9 rounded-lg object-cover"
                                        width={36}
                                        height={36}
                                    />
                                    <span className="font-display text-lg text-primary">
                                        Al Bayan
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    aria-label="Tutup menu"
                                    onClick={() => setOpen(false)}
                                    className="grid size-10 place-items-center rounded-lg text-muted hover:bg-surface"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>
                            <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
                                {NAV_MENU.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setOpen(false);
                                            scrollToSection(item.href);
                                        }}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-primary/5 hover:text-primary"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
