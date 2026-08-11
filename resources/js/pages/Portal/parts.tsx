import { Link } from '@inertiajs/react';
import { ArrowRight, Clock, FileText, PlayCircle, Video as VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
    return (
        <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-border', className)}>
            <div
                className="h-full rounded-full bg-secondary transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            />
        </div>
    );
}

export function EmptyState({
    title,
    description,
    actionHref,
    actionLabel,
}: {
    title: string;
    description: string;
    actionHref: string;
    actionLabel: string;
}) {
    return (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-white/60 px-6 py-12 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-muted">
                <ArrowRight className="size-6" />
            </div>
            <h3 className="mt-4 font-display text-xl text-foreground">{title}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{description}</p>
            <Link
                href={actionHref}
                className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary hover:text-secondary-foreground"
            >
                {actionLabel} <ArrowRight className="size-4" />
            </Link>
        </div>
    );
}

export function MateriTypeIcon({ type }: { type: 'video' | 'audio' | 'pdf' | 'quiz' }) {
    const map = {
        video: <VideoIcon className="size-4" />,
        audio: <PlayCircle className="size-4" />,
        pdf: <FileText className="size-4" />,
        quiz: <Clock className="size-4" />,
    };
    return (
        <span className="grid size-9 place-items-center rounded-xl bg-secondary/10 text-secondary">
            {map[type]}
        </span>
    );
}