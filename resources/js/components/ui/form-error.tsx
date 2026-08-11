import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FormError({ message, className }: { message?: string; className?: string }) {
    if (!message) return null;

    return (
        <p
            role="alert"
            className={cn('mt-1.5 flex items-center gap-1.5 text-xs text-danger', className)}
        >
            <AlertCircle className="size-3.5 shrink-0" />
            {message}
        </p>
    );
}
