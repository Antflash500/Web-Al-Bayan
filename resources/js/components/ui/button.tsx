import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-soft-hover active:scale-[0.98]',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90 hover:shadow-soft-hover active:scale-[0.98]',
                accent: 'bg-accent text-accent-foreground shadow-soft hover:bg-accent/90 hover:shadow-soft-hover active:scale-[0.98]',
                outline:
                    'border border-primary/20 bg-white/80 text-primary backdrop-blur hover:border-primary/40 hover:bg-white active:scale-[0.98]',
                ghost: 'text-primary hover:bg-primary/5',
                light: 'bg-white text-primary shadow-soft hover:bg-white/90 hover:shadow-soft-hover active:scale-[0.98]',
            },
            size: {
                default: 'h-11 px-6',
                sm: 'h-9 px-4',
                lg: 'h-13 px-8 text-base',
                icon: 'size-11',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
