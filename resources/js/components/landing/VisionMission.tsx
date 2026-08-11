import { MISSIONS, VISION } from '@/lib/constants';
import { Reveal } from '@/components/share-motion';
import { SectionHeader } from '@/components/landing/SectionHeader';

export function VisionMission() {
    return (
        <section className="bg-surface py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                <SectionHeader
                    title="Arah & Tujuan"
                    description="Nilai yang menjadi pondasi Al Bayan dalam menghadirkan pendidikan Bahasa Arab yang utuh."
                />

                <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-2">
                    {/* Vision */}
                    <Reveal className="h-full">
                        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] bg-primary p-10 text-white sm:p-12">
                            <div
                                aria-hidden="true"
                                className="geometric-pattern absolute inset-0 opacity-60"
                            />
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[radial-gradient(80%_70%_at_15%_0%,rgba(255,255,255,0.08),transparent_55%)]"
                            />

                            <div className="relative">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                                    <span className="h-px w-8 bg-secondary" />
                                    Visi Kami
                                </span>
                            </div>

                            <div className="relative mt-10 flex flex-1 items-center">
                                <p className="font-display text-2xl font-bold leading-snug sm:text-[1.9rem]">
                                    &ldquo;{VISION}&rdquo;
                                </p>
                            </div>

                            <div className="relative mt-8 flex items-center justify-between">
                                <span className="text-sm text-white/60">Al Bayan Education</span>
                                <span className="font-display text-4xl text-secondary/30">V</span>
                            </div>
                        </div>
                    </Reveal>

                    {/* Mission */}
                    <Reveal delay={0.1} className="h-full">
                        <div className="flex h-full flex-col rounded-[20px] border border-border bg-white p-10 sm:p-12">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                <span className="h-px w-8 bg-primary/40" />
                                Misi Kami
                            </span>

                            <div className="mt-8 divide-y divide-border">
                                {MISSIONS.map((mission, index) => (
                                    <div
                                        key={mission.title}
                                        className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[auto_1fr] sm:gap-6"
                                    >
                                        <span className="font-display text-2xl leading-none text-primary/25">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-foreground">
                                                {mission.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-relaxed text-muted">
                                                {mission.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
