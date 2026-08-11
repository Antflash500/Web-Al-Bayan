import { motion, type Transition, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

export const easeOut: Transition = { duration: 0.5, ease: EASE };

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: easeOut },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

export const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function Reveal({
    children,
    variants = fadeUp,
    className,
    delay = 0,
    amount = 0.2,
}: {
    children: ReactNode;
    variants?: Variants;
    className?: string;
    delay?: number;
    amount?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={variants}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
