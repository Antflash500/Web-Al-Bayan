import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import '../css/app.css';

if (typeof document !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

createInertiaApp({
    title: (title) => (title ? `${title} · Al Bayan Education` : 'Al Bayan Education'),
    resolve: (name) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pages: Record<string, () => Promise<any>> = import.meta.glob('./pages/**/*.tsx', {
            import: 'default',
        });
        const loader = pages[`./pages/${name}.tsx`];
        if (!loader) throw new Error(`Unknown page: ${name}`);
        return loader();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup({ el, App, props }: any) {
        if (!el) return;
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#22c55e',
        showSpinner: true,
    },
});
