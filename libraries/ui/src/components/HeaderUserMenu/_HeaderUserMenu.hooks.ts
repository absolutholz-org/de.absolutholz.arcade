import {
	type ConsentPreferences,
	type ConsentUpdatedEventDetail,
	loadConsentPreferences,
	subscribeToConsent,
} from '@arcade/lib-consent';
import {
	DEFAULT_PLAYER_AVATAR,
	DEFAULT_PLAYER_NAME,
	type PlayerAvatar,
	type PlayerProfile,
	type UserSession,
	resolveCurrentDataTier,
} from '@arcade/lib-user';
import { useCallback, useEffect, useState } from 'react';
import { useUserSession } from '../../hooks/useUserSession';

export interface UseHeaderUserMenuOptions {
	session?: UserSession;
}

export function useHeaderUserMenu({ session: externalSession }: UseHeaderUserMenuOptions = {}) {
	const { session: internalSession, userService, isLoading: isSessionLoading } = useUserSession();
	const session = externalSession ?? internalSession;

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [preferences, setPreferences] = useState<ConsentPreferences>(() => loadConsentPreferences());

	// Keep consent preferences synced across tabs and in-page updates
	useEffect(() => {
		setPreferences(loadConsentPreferences());
		const unsubscribe = subscribeToConsent((detail: ConsentUpdatedEventDetail) => {
			setPreferences(detail.preferences);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	// Listen for cross-tab profile updates persisted in local storage
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const handleStorage = (event: StorageEvent) => {
			if (event.key?.includes('user')) {
				userService.initialize().catch(() => {});
			}
		};
		window.addEventListener('storage', handleStorage);
		return () => {
			window.removeEventListener('storage', handleStorage);
		};
	}, [userService]);

	const isLoading = isSessionLoading || isActionLoading;

	const handleOpenChange = useCallback((open: boolean) => {
		setIsMenuOpen(open);
		if (!open) {
			setErrorMessage(null);
		}
	}, []);

	const handleTriggerClick = useCallback(
		(e: React.MouseEvent) => {
			if (!session.isAuthenticated) {
				e.preventDefault();
				setIsAuthDialogOpen(true);
			} else {
				setIsMenuOpen((prev) => !prev);
			}
		},
		[session.isAuthenticated],
	);

	const handleCloseAuthDialog = useCallback(() => {
		setIsAuthDialogOpen(false);
	}, []);

	const handleAuthSuccess = useCallback(() => {
		setIsAuthDialogOpen(false);
	}, []);

	const handleSignOut = useCallback(async () => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.signOut();
			setIsMenuOpen(false);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
		}
	}, [userService]);

	const isAuthenticated = session.isAuthenticated;
	const isCloudSyncActive = preferences.cloudSync && session.user?.storageMode === 'cloud';
	const isPublicConsentActive = isCloudSyncActive && preferences.publicBroadcast;
	const currentTier = resolveCurrentDataTier(isAuthenticated, isCloudSyncActive, isPublicConsentActive);

	const user: PlayerProfile | null = session.user;
	const displayName = user?.displayName || DEFAULT_PLAYER_NAME;
	const avatar: PlayerAvatar = user?.avatar || DEFAULT_PLAYER_AVATAR;

	return {
		avatar,
		currentTier,
		displayName,
		errorMessage,
		handleAuthSuccess,
		handleCloseAuthDialog,
		handleOpenChange,
		handleSignOut,
		handleTriggerClick,
		isAuthenticated,
		isAuthDialogOpen,
		isLoading,
		isMenuOpen,
		session,
		user,
		userService,
	};
}
