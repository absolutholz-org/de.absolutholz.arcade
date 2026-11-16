/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_METERED_PROJECT_URL?: string;
	readonly VITE_METERED_USERNAME?: string;
	readonly VITE_METERED_CREDENTIAL?: string;
	readonly PUBLIC_METERED_PROJECT_URL?: string;
	readonly PUBLIC_METERED_USERNAME?: string;
	readonly PUBLIC_METERED_CREDENTIAL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
