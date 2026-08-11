import type { ReactNode } from 'react';
import { Reveal } from '@/components/share-motion';
import { cn } from '@/lib/utils';

export function SectionHeader({
    title,
    description,
    align = 'left',
    className,
}: {
    title: ReactNode;
    description?: ReactNode;
    align?: 'left' | 'center';
    className?: string;
}) {
    return (
        <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
                {title}
            </h2>
            {description ? (
                <p className={cn('mt-5 leading-relaxed text-muted')}>{description}</p>
            ) : null}
        </Reveal>
    );
}
