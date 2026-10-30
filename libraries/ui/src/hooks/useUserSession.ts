import { type IUserService, type UserSession, getSharedUserService } from '@arcade/lib-user';
import { useEffect, useState } from 'react';

export interface UseUserSessionReturn {
	readonly session: UserSession;
	readonly userService: IUserService;
	readonly isLoading: boolean;
}

function resolveFirebaseConfig() {
	try {
		const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
		const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
		const appId = import.meta.env.PUBLIC_FIREBASE_APP_ID;

		if (apiKey && projectId && appId) {
			return {
				apiKey,
				authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
				projectId,
				storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
				messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
				appId,
			};
		}
	} catch {
		// Non-Vite or SSR environment where import.meta.env is inaccessible
	}
	return undefined;
}

/**
 * Global hook providing reactive access to the unified user session across tabs and views.
 * SSR-safe, lazy-initialized in the browser.
 */
export function useUserSession(): UseUserSessionReturn {
	const [userService] = useState<IUserService>(() =>
		getSharedUserService({ firebaseConfig: resolveFirebaseConfig() }),
	);
	const [session, setSession] = useState<UserSession>(() => userService.getSession());
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const unsubscribe = userService.subscribe((nextSession) => {
			setSession(nextSession);
		});

		// Ensure background initialization starts when mounted in browser
		if (typeof window !== 'undefined') {
			setIsLoading(true);
			userService
				.initialize()
				.catch((err) => {
					console.error('[@arcade/lib-ui] Failed to initialize user session:', err);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}

		return () => {
			unsubscribe();
		};
	}, [userService]);

	return { session, userService, isLoading };
}
