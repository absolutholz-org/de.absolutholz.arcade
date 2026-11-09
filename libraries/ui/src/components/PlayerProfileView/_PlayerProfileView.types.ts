import type { PlayerAvatar, PlayerProfile, UserSession } from '@arcade/lib-user';

export interface PlayerProfileViewProps {
	/**
	 * Optional CSS class name for the root element.
	 */
	readonly className?: string;

	/**
	 * Optional element ID for the root profile view.
	 */
	readonly id?: string;

	/**
	 * Optional custom session for testing or controlled environments.
	 */
	readonly session?: UserSession;

	/**
	 * Optional callback dispatched when profile is saved.
	 */
	readonly onSaveSuccess?: (profile: PlayerProfile) => void;
}

export interface PlayerProfileFormState {
	displayName: string;
	avatar: PlayerAvatar;
	errorMessage: string | null;
	statusMessage: string | null;
	isSubmitting: boolean;
	isSaved: boolean;
}
