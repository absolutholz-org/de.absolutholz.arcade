import type { ReactNode } from 'react';

export interface OfflineScreenProps {
	/**
	 * Main heading title.
	 * @default "You're Offline"
	 */
	title?: string;
	/**
	 * Explanatory message or subtitle.
	 * @default "This content hasn't been cached for offline play yet. Check your connection to load it."
	 */
	message?: string;
	/**
	 * Optional retry callback (e.g. check connection or reload).
	 */
	onRetry?: () => void;
	/**
	 * Label for the retry button.
	 * @default "Retry Connection"
	 */
	retryLabel?: string;
	/**
	 * Target URL for returning to cached games.
	 * @default "/"
	 */
	homeHref?: string;
	/**
	 * Label for the return home button.
	 * @default "Play Cached Games"
	 */
	homeLabel?: string;
	/**
	 * Optional custom action buttons or links.
	 */
	action?: ReactNode;
}
