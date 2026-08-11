import { useRef } from 'react';
import { Input } from '@/components/ui/input';

export function OtpInput({
    value,
    onChange,
    length = 6,
}: {
    value: string;
    onChange: (value: string) => void;
    length?: number;
}) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(length, '').split('');

    const handleDigit = (i: number, v: string) => {
        const current = value.split('');
        if (/^\d$/.test(v)) {
            current[i] = v;
        } else if (v === '') {
            current[i] = '';
        }
        onChange(current.join(''));
        if (v && i < length - 1) refs.current[i + 1]?.focus();
    };

    const handleKey = (i: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value[i] && i > 0) {
            const current = value.split('');
            current[i - 1] = '';
            onChange(current.join(''));
            refs.current[i - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-2">
            {Array.from({ length }).map((_, i) => (
                <Input
                    key={i}
                    ref={(el) => {
                        refs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] ?? ''}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKey(i, e)}
                    className="h-14 w-12 rounded-[var(--radius-button)] border-border bg-white text-center text-xl font-bold text-foreground shadow-soft focus:border-secondary"
                    aria-label={`Digit ${i + 1}`}
                />
            ))}
        </div>
    );
}
