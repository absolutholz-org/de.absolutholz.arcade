import type { IUserService } from '@arcade/lib-user';
import type { AUTH_DIALOG_MODES } from './_AuthDialog.constants';

export type AuthDialogMode = (typeof AUTH_DIALOG_MODES)[number];

export interface AuthDialogProps {
	/**
	 * Unique identifier for the modal element.
	 */
	id?: string;

	/**
	 * Additional CSS class name.
	 */
	className?: string;

	/**
	 * Whether the authentication modal dialog is open.
	 */
	isOpen: boolean;

	/**
	 * Callback invoked when the dialog is dismissed (cancel, backdrop, or escape).
	 */
	onClose: () => void;

	/**
	 * Initial view mode when opening the dialog.
	 * @default 'signIn'
	 */
	initialMode?: AuthDialogMode;

	/**
	 * Optional user service instance override for testing/mocking.
	 */
	userService?: IUserService;

	/**
	 * Optional callback triggered on successful authentication or reset.
	 */
	onSuccess?: () => void;
}
