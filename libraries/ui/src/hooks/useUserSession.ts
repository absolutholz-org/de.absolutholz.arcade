import { type IUserService, type UserSession, getSharedUserService } from '@arcade/lib-user';
import { useEffect, useState } from 'react';

export interface UseUserSessionReturn {
	readonly session: UserSession;
	readonly userService: IUserService;
	readonly isLoading: boolean;
}

/**
 * Global hook providing reactive access to the unified user session across tabs and views.
 * SSR-safe, lazy-initialized in the browser.
 */
export function useUserSession(): UseUserSessionReturn {
	const [userService] = useState<IUserService>(() => getSharedUserService());
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
