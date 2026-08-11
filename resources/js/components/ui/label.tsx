import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = ComponentPropsWithoutRef<'label'>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn('mb-1.5 block text-sm font-medium text-foreground', className)}
        {...props}
    />
));
Label.displayName = 'Label';

export { Label };
