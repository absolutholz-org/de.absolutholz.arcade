import { type FirebaseApp, type FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';

/**
 * Internal container holding modular Firebase instances.
 * Kept private to avoid leaking SDK instances to consuming packages.
 */
export interface FirebaseServices {
	readonly app: FirebaseApp;
	readonly auth: Auth;
	readonly firestore: Firestore;
}

let cachedServices: FirebaseServices | null = null;

/**
 * Attempts to resolve Firebase credentials from environment variables
 * across Astro / Vite (import.meta.env) or Node (process.env).
 */
function resolveEnvConfig(): FirebaseOptions | null {
	// Astro / Vite environment variables
	const metaEnv =
		typeof import.meta !== 'undefined' && 'env' in import.meta
			? (import.meta as { env?: Record<string, string | undefined> }).env
			: undefined;

	// Node environment variables fallback
	const globalScope =
		typeof globalThis !== 'undefined'
			? (globalThis as { process?: { env?: Record<string, string | undefined> } })
			: undefined;
	const nodeEnv = globalScope?.process?.env;

	const apiKey = metaEnv?.PUBLIC_FIREBASE_API_KEY ?? nodeEnv?.PUBLIC_FIREBASE_API_KEY ?? nodeEnv?.FIREBASE_API_KEY;
	const projectId =
		metaEnv?.PUBLIC_FIREBASE_PROJECT_ID ?? nodeEnv?.PUBLIC_FIREBASE_PROJECT_ID ?? nodeEnv?.FIREBASE_PROJECT_ID;

	if (!apiKey || !projectId) {
		return null;
	}

	return {
		apiKey,
		authDomain:
			metaEnv?.PUBLIC_FIREBASE_AUTH_DOMAIN ??
			nodeEnv?.PUBLIC_FIREBASE_AUTH_DOMAIN ??
			nodeEnv?.FIREBASE_AUTH_DOMAIN,
		projectId,
		storageBucket:
			metaEnv?.PUBLIC_FIREBASE_STORAGE_BUCKET ??
			nodeEnv?.PUBLIC_FIREBASE_STORAGE_BUCKET ??
			nodeEnv?.FIREBASE_STORAGE_BUCKET,
		messagingSenderId:
			metaEnv?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
			nodeEnv?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
			nodeEnv?.FIREBASE_MESSAGING_SENDER_ID,
		appId: metaEnv?.PUBLIC_FIREBASE_APP_ID ?? nodeEnv?.PUBLIC_FIREBASE_APP_ID ?? nodeEnv?.FIREBASE_APP_ID,
	};
}

/**
 * Initializes or retrieves existing Firebase modular instances.
 *
 * @param config Optional explicit Firebase credentials.
 * @returns Initialized services or null if configuration is absent.
 */
export function initFirebase(config?: FirebaseOptions): FirebaseServices | null {
	if (cachedServices) {
		return cachedServices;
	}

	const existingApps = getApps();
	if (existingApps.length > 0) {
		const app = existingApps[0];
		cachedServices = {
			app,
			auth: getAuth(app),
			firestore: getFirestore(app),
		};
		return cachedServices;
	}

	const targetConfig = config ?? resolveEnvConfig();
	if (!targetConfig || !targetConfig.apiKey || !targetConfig.projectId) {
		return null;
	}

	try {
		const app = initializeApp(targetConfig);
		cachedServices = {
			app,
			auth: getAuth(app),
			firestore: getFirestore(app),
		};
		return cachedServices;
	} catch (error) {
		console.warn('[@arcade/lib-user] Failed to initialize Firebase:', error);
		return null;
	}
}

/**
 * Returns active modular Firebase services if initialized.
 */
export function getFirebaseServices(): FirebaseServices | null {
	if (cachedServices) {
		return cachedServices;
	}
	return initFirebase();
}

/**
 * Resets the cached Firebase services instance.
 * Useful for test isolation and clean re-initialization.
 */
export function resetFirebaseServices(): void {
	cachedServices = null;
}
