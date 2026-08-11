declare module '@inertiajs/react' {
    export interface PageProps {
        [key: string]: unknown;
        auth?: {
            user?: {
                id: number;
                email: string;
                role: string;
                verified: boolean;
            } | null;
        } | null;
        profile?: Record<string, unknown> | null;
        errors?: Record<string, string>;
        flash?: Record<string, string>;
    }
}

export {};
