import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/lib/constants';
import { Reveal } from '@/components/share-motion';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { cn } from '@/lib/utils';

function FaqItem({
    faq,
    isOpen,
    onToggle,
}: {
    faq: (typeof FAQS)[number];
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-b border-border">
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
                <span
                    className={cn(
                        'font-medium transition-colors',
                        isOpen ? 'text-primary' : 'text-foreground'
                    )}
                >
                    {faq.question}
                </span>
                <span
                    className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-200',
                        isOpen ? 'bg-primary/5 text-primary' : 'bg-surface text-muted'
                    )}
                >
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="size-4" />
                    </motion.span>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function FAQ() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section id="faq" className="scroll-mt-24 bg-white py-24 sm:py-32">
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
                <SectionHeader title="Pertanyaan yang Sering Diajukan" />

                <div className="mt-10">
                    {FAQS.map((faq, index) => (
                        <Reveal key={faq.question} delay={index * 0.03}>
                            <FaqItem
                                faq={faq}
                                isOpen={open === index}
                                onToggle={() => setOpen(open === index ? null : index)}
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
