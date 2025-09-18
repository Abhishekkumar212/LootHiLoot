// Fix: Manually define the types for import.meta.env for Vite environment variables.
// This resolves TypeScript errors about 'env' not existing on 'ImportMeta' and
// the error about "vite/client" types not being found.

interface ImportMetaEnv {
    readonly VITE_ADMIN_EMAIL: string;
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
