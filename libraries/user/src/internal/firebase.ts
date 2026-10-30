import { type FirebaseApp, type FirebaseOptions, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import {
	type Firestore,
	getFirestore,
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
} from 'firebase/firestore';

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
 * Initializes Firestore with resilient multi-tab offline persistence.
 * Falls back to getFirestore(app) if already initialized or in unsupported environments.
 */
function initFirestoreInstance(app: FirebaseApp): Firestore {
	try {
		return initializeFirestore(app, {
			localCache: persistentLocalCache({
				tabManager: persistentMultipleTabManager(),
			}),
		});
	} catch {
		return getFirestore(app);
	}
}

/**
 * Attempts to resolve Firebase credentials from environment variables
 * across Astro / Vite (import.meta.env) or Node (process.env).
 */
export function resolveEnvConfig(): {
	readonly apiKey: string;
	readonly authDomain?: string;
	readonly projectId: string;
	readonly storageBucket?: string;
	readonly messagingSenderId?: string;
	readonly appId: string;
} | null {
	let apiKey: string | undefined;
	let projectId: string | undefined;
	let authDomain: string | undefined;
	let storageBucket: string | undefined;
	let messagingSenderId: string | undefined;
	let appId: string | undefined;

	try {
		// Explicit literal accesses so Vite / Astro static define replaces them at bundle time
		apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
		projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
		authDomain = import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN;
		storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
		messagingSenderId = import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
		appId = import.meta.env.PUBLIC_FIREBASE_APP_ID;
	} catch {
		// In pure Node or non-ESM environments, import.meta.env may throw or be undefined
	}

	const globalScope =
		typeof globalThis !== 'undefined'
			? (globalThis as { process?: { env?: Record<string, string | undefined> } })
			: undefined;
	const nodeEnv = globalScope?.process?.env;

	apiKey = apiKey ?? nodeEnv?.PUBLIC_FIREBASE_API_KEY ?? nodeEnv?.FIREBASE_API_KEY;
	projectId = projectId ?? nodeEnv?.PUBLIC_FIREBASE_PROJECT_ID ?? nodeEnv?.FIREBASE_PROJECT_ID;
	authDomain = authDomain ?? nodeEnv?.PUBLIC_FIREBASE_AUTH_DOMAIN ?? nodeEnv?.FIREBASE_AUTH_DOMAIN;
	storageBucket = storageBucket ?? nodeEnv?.PUBLIC_FIREBASE_STORAGE_BUCKET ?? nodeEnv?.FIREBASE_STORAGE_BUCKET;
	messagingSenderId =
		messagingSenderId ?? nodeEnv?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? nodeEnv?.FIREBASE_MESSAGING_SENDER_ID;
	appId = appId ?? nodeEnv?.PUBLIC_FIREBASE_APP_ID ?? nodeEnv?.FIREBASE_APP_ID;

	if (!apiKey || !projectId || !appId) {
		return null;
	}

	return {
		apiKey,
		authDomain,
		projectId,
		storageBucket,
		messagingSenderId,
		appId,
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
			firestore: initFirestoreInstance(app),
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
			firestore: initFirestoreInstance(app),
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
