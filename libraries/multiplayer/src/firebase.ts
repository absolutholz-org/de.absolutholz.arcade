import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';

interface MultiplayerFirebaseServices {
	readonly app: FirebaseApp;
	readonly auth: Auth;
	readonly firestore: Firestore;
}

let cachedServices: MultiplayerFirebaseServices | null = null;
let authReadyPromise: Promise<string> | null = null;

function resolveFirebaseConfig() {
	let apiKey: string | undefined;
	let projectId: string | undefined;
	let authDomain: string | undefined;
	let storageBucket: string | undefined;
	let messagingSenderId: string | undefined;
	let appId: string | undefined;

	try {
		apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
		projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
		authDomain = import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN;
		storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
		messagingSenderId = import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
		appId = import.meta.env.PUBLIC_FIREBASE_APP_ID;
	} catch {
		// Non-Vite environment
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

export function getMultiplayerFirebase(): MultiplayerFirebaseServices | null {
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

	const config = resolveFirebaseConfig();
	if (!config) {
		return null;
	}

	const app = initializeApp(config);
	cachedServices = {
		app,
		auth: getAuth(app),
		firestore: getFirestore(app),
	};
	return cachedServices;
}

/**
 * Ensures an authenticated Firebase UID is available (reusing an existing
 * signed-in user or signing in anonymously so anyone with a link can play).
 */
export async function ensureMultiplayerUid(): Promise<string> {
	const services = getMultiplayerFirebase();
	if (!services) {
		throw new Error('firebase-not-configured');
	}

	if (services.auth.currentUser) {
		return services.auth.currentUser.uid;
	}

	if (authReadyPromise) {
		return authReadyPromise;
	}

	authReadyPromise = new Promise<string>((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			services.auth,
			(user) => {
				unsubscribe();
				if (user) {
					resolve(user.uid);
					return;
				}
				signInAnonymously(services.auth)
					.then((cred) => resolve(cred.user.uid))
					.catch((err) => {
						authReadyPromise = null;
						reject(err);
					});
			},
			(err) => {
				unsubscribe();
				authReadyPromise = null;
				reject(err);
			},
		);
	});

	return authReadyPromise;
}
