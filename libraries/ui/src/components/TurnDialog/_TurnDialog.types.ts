import type { ReactNode } from 'react';

export interface TurnDialogProps {
	/**
	 * Controls whether the turn dialog is visible.
	 */
	isOpen: boolean;
	/**
	 * Name of the player whose turn it now is.
	 */
	playerName?: string;
	/**
	 * Mark or symbol associated with the active player (e.g. 'X' or 'O').
	 */
	playerMark?: string;
	/**
	 * Custom dialog title. If omitted, falls back to standard i18n title.
	 */
	title?: ReactNode;
	/**
	 * Custom message or instructions. If omitted, falls back to standard pass device or waiting prompt.
	 */
	message?: ReactNode;
	/**
	 * When true, indicates online waiting state (waiting for opponent).
	 * In waiting state, no confirm button is rendered.
	 * When false, indicates local pass-and-play handoff requiring confirmation.
	 * @default false
	 */
	isWaiting?: boolean;
	/**
	 * Callback triggered when the next player confirms they are ready.
	 */
	onConfirm?: () => void;
	/**
	 * Custom text for the confirmation button (defaults to "OK" or "Ready" via i18n).
	 */
	confirmText?: string;
	/**
	 * Optional custom HTML ID for the dialog.
	 */
	id?: string;
}
