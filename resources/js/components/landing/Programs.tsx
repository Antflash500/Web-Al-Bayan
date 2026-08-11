import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { stagger, item } from '@/components/share-motion';
import { mediaUrl } from '@/lib/image';
import type { ProgramKursus } from '@/types/models';

export function Programs({ programs }: { programs: ProgramKursus[] }) {
    if (programs.length === 0) {
        return null;
    }

    return (
        <section id="program" className="scroll-mt-24 bg-surface py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                <SectionHeader
                    title="Program Pilihan"
                    description="Program belajar Bahasa Arab dan pengembangan diri yang dirancang sesuai kebutuhan."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {programs.map((program) => (
                        <motion.article
                            key={program.id}
                            variants={item}
                            className="group flex flex-col overflow-hidden rounded-[20px] border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-soft"
                        >
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={mediaUrl(program.thumbnail) || '/images/logo.png'}
                                    alt={program.nama_program}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/logo.png';
                                    }}
                                />
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                                    <span className="rounded-full bg-primary/5 px-2.5 py-0.5 font-medium capitalize text-primary">
                                        {program.kategori?.nama_kategori ?? 'Belajar'}
                                    </span>
                                    <span className="capitalize">{program.tingkat}</span>
                                    <span className="text-border">·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3.5 text-secondary" />
                                        {program.durasi_jam} jam
                                    </span>
                                    {program.materi_list_count != null && (
                                        <>
                                            <span className="text-border">·</span>
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="size-3.5 text-secondary" />
                                                {program.materi_list_count} materi
                                            </span>
                                        </>
                                    )}
                                </div>
                                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                                    {program.nama_program}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                                    {program.deskripsi}
                                </p>
                                <a
                                    href="/register"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
                                >
                                    Lihat Detail
                                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}