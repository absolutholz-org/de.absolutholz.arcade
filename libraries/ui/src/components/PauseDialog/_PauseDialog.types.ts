export interface PauseDialogProps {
	/**
	 * Controls whether the pause dialog is visible.
	 */
	isOpen: boolean;
	/**
	 * Callback triggered when the player clicks Resume or dismisses the dialog.
	 */
	onResume: () => void;
	/**
	 * Callback triggered when the player clicks Restart to start over.
	 */
	onRestart: () => void;
	/**
	 * Optional custom HTML ID for the dialog.
	 */
	id?: string;
}
