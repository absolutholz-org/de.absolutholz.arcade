import type { USER_PROFILE_DIALOG_VIEWS } from './_UserProfileDialog.constants';

export type UserProfileDialogView = (typeof USER_PROFILE_DIALOG_VIEWS)[number];

export interface UserProfileDialogSessionUser {
	displayName: string;
	storageMode: 'local' | 'cloud';
	email?: string | null;
}

export interface UserProfileDialogSession {
	user: UserProfileDialogSessionUser | null;
	isAuthenticated: boolean;
}

export interface UserProfileDialogProps {
	/**
	 * Controls whether the user profile dialog is open and visible.
	 */
	isOpen: boolean;

	/**
	 * Callback triggered when the dialog is dismissed.
	 */
	onClose: () => void;

	/**
	 * Current user session information.
	 */
	session: UserProfileDialogSession;

	/**
	 * Whether an asynchronous operation is in progress.
	 */
	isLoading?: boolean;

	/**
	 * Optional error message to display in an alert banner.
	 */
	errorMessage?: string | null;

	/**
	 * Callback to update the user's display name.
	 */
	onUpdateDisplayName: (name: string) => Promise<void> | void;

	/**
	 * Callback to switch the storage persistence mode.
	 */
	onSwitchStorageMode: (mode: 'local' | 'cloud') => Promise<void> | void;

	/**
	 * Callback to authenticate with email and password.
	 */
	onSignInEmail: (email: string, pass: string) => Promise<void> | void;

	/**
	 * Callback to create a new account with email, password, and optional display name.
	 */
	onSignUpEmail: (email: string, pass: string, name?: string) => Promise<void> | void;

	/**
	 * Callback to initiate password reset for an email address.
	 */
	onResetPassword: (email: string) => Promise<void> | void;

	/**
	 * Callback to sign out of the active cloud session.
	 */
	onSignOut: () => Promise<void> | void;

	/**
	 * Additional CSS class name.
	 */
	className?: string;

	/**
	 * Optional custom ID for accessibility and testing.
	 */
	id?: string;
}
