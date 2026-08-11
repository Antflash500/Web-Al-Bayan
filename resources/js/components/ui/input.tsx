import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = ComponentPropsWithoutRef<'input'>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn(
            'flex h-12 w-full rounded-[var(--radius-input)] border border-input bg-white px-4 py-2 text-sm text-foreground shadow-soft outline-none transition placeholder:text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/30 disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        ref={ref}
        {...props}
    />
));
Input.displayName = 'Input';

export { Input };
