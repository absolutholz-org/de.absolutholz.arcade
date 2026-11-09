import {
	type ConsentPreferences,
	type ConsentUpdatedEventDetail,
	loadConsentPreferences,
	saveConsentPreferences,
	subscribeToConsent,
} from '@arcade/lib-consent';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import {
	DEFAULT_PLAYER_AVATAR,
	DEFAULT_PLAYER_NAME,
	MAX_DISPLAY_NAME_LENGTH,
	type PlayerAvatar,
	type PlayerProfile,
	resolveCurrentDataTier,
	sanitizeDisplayName,
} from '@arcade/lib-user';
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from 'react';
import { useUserSession } from '../../hooks/useUserSession';
import type { AuthDialogMode } from '../AuthDialog/_AuthDialog.types';
import type { PlayerProfileViewProps } from './_PlayerProfileView.types';

export function usePlayerProfileView({
	session: externalSession,
	onSaveSuccess,
}: Pick<PlayerProfileViewProps, 'session' | 'onSaveSuccess'> = {}) {
	const { t, language } = useI18n();
	const { session: internalSession, userService, isLoading: isSessionLoading } = useUserSession();
	const session = externalSession ?? internalSession;

	const initialDisplayName = session.user?.displayName ?? DEFAULT_PLAYER_NAME;
	const initialAvatar = session.user?.avatar ?? DEFAULT_PLAYER_AVATAR;

	const [displayName, setDisplayName] = useState(initialDisplayName);
	const [avatar, setAvatar] = useState<PlayerAvatar>(initialAvatar);
	const [preferences, setPreferences] = useState<ConsentPreferences>(() => loadConsentPreferences());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [statusAnnouncement, setStatusAnnouncement] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [authMode, setAuthMode] = useState<AuthDialogMode>('signIn');

	// Sync local form state when session user changes
	useEffect(() => {
		if (session.user) {
			setDisplayName(session.user.displayName || DEFAULT_PLAYER_NAME);
			setAvatar(session.user.avatar || DEFAULT_PLAYER_AVATAR);
		}
	}, [session.user]);

	// Subscribe to cross-tab or in-page consent updates
	useEffect(() => {
		setPreferences(loadConsentPreferences());
		const unsubscribe = subscribeToConsent((detail: ConsentUpdatedEventDetail) => {
			setPreferences(detail.preferences);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	// Clear temporary announcement and saved state after duration
	useEffect(() => {
		if (!isSaved) return;
		const timer = setTimeout(() => {
			setIsSaved(false);
		}, 3000);
		return () => clearTimeout(timer);
	}, [isSaved]);

	const isAuthenticated = session.isAuthenticated;
	const isCloudSyncActive = preferences.cloudSync && session.user?.storageMode === 'cloud';
	const isPublicConsentActive = isCloudSyncActive && preferences.publicBroadcast;

	// ADR 0003: Deterministic Data Tier Resolution (1 to 4)
	const currentTier = resolveCurrentDataTier(isAuthenticated, isCloudSyncActive, isPublicConsentActive);

	const trimmedName = displayName.trim();
	const isPristine =
		trimmedName === (session.user?.displayName || DEFAULT_PLAYER_NAME).trim() &&
		avatar.value === (session.user?.avatar?.value || DEFAULT_PLAYER_AVATAR.value);

	const isValid = trimmedName.length > 0 && trimmedName.length <= MAX_DISPLAY_NAME_LENGTH;

	const handleDisplayNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		const val = event.target.value;
		// Hard truncate to max length
		const nextVal = val.slice(0, MAX_DISPLAY_NAME_LENGTH);
		setDisplayName(nextVal);
		setErrorMessage(null);
		if (isSaved) setIsSaved(false);
	};

	const handleAvatarChange = (nextAvatar: PlayerAvatar) => {
		setAvatar(nextAvatar);
		if (isSaved) setIsSaved(false);
	};

	const handleSaveProfile = async (event: FormEvent) => {
		event.preventDefault();
		if (!isValid) {
			setErrorMessage(t('profile.displayNameRequired'));
			return;
		}

		setIsSubmitting(true);
		setErrorMessage(null);
		try {
			const cleanName = sanitizeDisplayName(displayName);
			const updatedProfile = await userService.updateProfile({
				displayName: cleanName,
				avatar,
			});
			setIsSaved(true);
			const successMsg = t('profile.profileUpdatedSuccess');
			setStatusAnnouncement(successMsg);
			if (onSaveSuccess) {
				onSaveSuccess(updatedProfile);
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Failed to update profile';
			setErrorMessage(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCloudSyncToggle = async (event: ChangeEvent<HTMLInputElement>) => {
		const nextChecked = event.target.checked;
		setIsSubmitting(true);
		try {
			// If disabling cloud sync, public leaderboards must also be disabled per ADR 0003
			const nextPreferences = saveConsentPreferences({
				cloudSync: nextChecked,
				publicBroadcast: nextChecked ? preferences.publicBroadcast : false,
			});
			setPreferences(nextPreferences);
			await userService.setStorageMode(nextChecked ? 'cloud' : 'local');
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Failed to update cloud synchronization';
			setErrorMessage(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePublicConsentToggle = (event: ChangeEvent<HTMLInputElement>) => {
		const nextChecked = event.target.checked;
		if (!isCloudSyncActive) return;

		const nextPreferences = saveConsentPreferences({
			publicBroadcast: nextChecked,
		});
		setPreferences(nextPreferences);
	};

	const handleExportData = () => {
		try {
			const exportPayload: Record<string, unknown> = {
				exportDate: new Date().toISOString(),
				profile: {
					id: session.user?.id,
					displayName: session.user?.displayName,
					avatar: session.user?.avatar,
					storageMode: session.user?.storageMode,
					tier: currentTier,
				},
				consent: preferences,
				data: {},
			};

			if (typeof window !== 'undefined' && window.localStorage) {
				const localData: Record<string, unknown> = {};
				for (let i = 0; i < window.localStorage.length; i++) {
					const key = window.localStorage.key(i);
					if (key?.startsWith('arcade::')) {
						try {
							localData[key] = JSON.parse(window.localStorage.getItem(key) || 'null');
						} catch {
							localData[key] = window.localStorage.getItem(key);
						}
					}
				}
				exportPayload.data = localData;
			}

			const jsonStr = JSON.stringify(exportPayload, null, 2);
			const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `arcade-player-data-${Date.now()}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			const successMsg = t('profile.dataExportedSuccess');
			setStatusAnnouncement(successMsg);
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Failed to export data';
			setErrorMessage(msg);
		}
	};

	const handleSignInGoogle = async () => {
		setIsSubmitting(true);
		setErrorMessage(null);
		try {
			await userService.signInWithGoogle();
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Sign-in failed';
			setErrorMessage(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSignOut = async () => {
		setIsSubmitting(true);
		setErrorMessage(null);
		try {
			await userService.signOut();
		} catch (err) {
			const msg = err instanceof Error ? err.message : 'Sign-out failed';
			setErrorMessage(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		t,
		language,
		session,
		displayName,
		avatar,
		preferences,
		currentTier,
		isAuthenticated,
		isCloudSyncActive,
		isPublicConsentActive,
		isSubmitting,
		isPristine,
		isValid,
		isSaved,
		statusAnnouncement,
		errorMessage,
		handleDisplayNameChange,
		handleAvatarChange,
		handleSaveProfile,
		handleCloudSyncToggle,
		handlePublicConsentToggle,
		handleExportData,
		handleSignInGoogle,
		handleSignOut,
		isAuthOpen,
		setIsAuthOpen,
		authMode,
		setAuthMode,
	};
}
