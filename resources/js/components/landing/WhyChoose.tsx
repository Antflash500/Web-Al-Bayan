import { getIcon } from '@/lib/icons';
import { WHY_CHOOSE } from '@/lib/constants';
import { Reveal } from '@/components/share-motion';
import { SectionHeader } from '@/components/landing/SectionHeader';

export function WhyChoose() {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
                <SectionHeader
                    title="Mengapa Al Bayan"
                    description="Al Bayan menghadirkan lingkungan yang menunjang perjalanan belajar menjadi pribadi yang unggul."
                />

                <div className="mt-14 grid gap-x-16 lg:grid-cols-2">
                    {WHY_CHOOSE.map((feature) => {
                        const Icon = getIcon(feature.icon);
                        return (
                            <Reveal key={feature.title}>
                                <div className="flex gap-6 border-t border-border py-7">
                                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-surface">
                                        <Icon className="size-5 text-primary" strokeWidth={1.75} />
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
