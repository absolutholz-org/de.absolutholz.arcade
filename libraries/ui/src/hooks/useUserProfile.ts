import type { PlayerProfile, UserSession } from '@arcade/lib-user';
import { useUserSession } from './useUserSession';

export interface UseUserProfileReturn {
	readonly isAuthenticated: boolean;
	readonly isHydrated: boolean;
	readonly name: string;
	readonly profile: PlayerProfile | null;
	readonly session: UserSession;
}

/**
 * Convenient hook exposing normalized user identity, authentication state, and hydration status.
 */
export function useUserProfile(): UseUserProfileReturn {
	const { session, isLoading } = useUserSession();

	return {
		isAuthenticated: session.isAuthenticated,
		isHydrated: !isLoading,
		name: session.user?.displayName?.trim() || 'Guest',
		profile: session.user,
		session,
	};
}
