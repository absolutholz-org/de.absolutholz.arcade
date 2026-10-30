import {
	type ConsentPreferences,
	type ConsentUpdatedEventDetail,
	type UserDataTier,
	loadConsentPreferences,
	resolveUserDataTier,
	saveConsentPreferences,
	subscribeToConsent,
} from '@arcade/lib-consent';
import type { UserSession } from '@arcade/lib-user';
import { useCallback, useEffect, useState } from 'react';
import { useUserSession } from './useUserSession';

export interface UseUserDataTierReturn {
	readonly tier: UserDataTier;
	readonly session: UserSession;
	readonly preferences: ConsentPreferences;
	readonly isAuthenticated: boolean;
	readonly hasLocalProfile: boolean;
	readonly isCloudSynced: boolean;
	readonly isPublicBroadcast: boolean;
	readonly updatePreferences: (updates: Partial<ConsentPreferences>) => ConsentPreferences;
}

/**
 * Canonical hook consolidating user profile, authentication, consent preferences,
 * and deterministic 4-tier data evaluation. Synchronizes automatically across tabs.
 */
export function useUserDataTier(): UseUserDataTierReturn {
	const { session } = useUserSession();
	const [preferences, setPreferences] = useState<ConsentPreferences>(loadConsentPreferences);

	const isAuthenticated = session.isAuthenticated;
	const hasLocalProfile = Boolean(session.user?.displayName && session.user.displayName !== 'Guest');

	useEffect(() => {
		// Sync local initial preference state
		setPreferences(loadConsentPreferences());

		// Cross-window and same-window synchronization subscription
		const unsubscribe = subscribeToConsent(
			(detail: ConsentUpdatedEventDetail) => {
				setPreferences(detail.preferences);
			},
			{ isAuthenticated, hasLocalProfile },
		);

		return () => {
			unsubscribe();
		};
	}, [isAuthenticated, hasLocalProfile]);

	const tier = resolveUserDataTier({ isAuthenticated, hasLocalProfile }, preferences);

	const updatePreferences = useCallback(
		(updates: Partial<ConsentPreferences>) => {
			const updated = saveConsentPreferences(updates, { isAuthenticated, hasLocalProfile });
			setPreferences(updated);
			return updated;
		},
		[isAuthenticated, hasLocalProfile],
	);

	const isCloudSynced = isAuthenticated && preferences.cloudSync;
	const isPublicBroadcast = isCloudSynced && preferences.publicBroadcast;

	return {
		tier,
		session,
		preferences,
		isAuthenticated,
		hasLocalProfile,
		isCloudSynced,
		isPublicBroadcast,
		updatePreferences,
	};
}
