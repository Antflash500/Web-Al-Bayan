/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REVERB_KEY: string;
    readonly VITE_REVERB_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
