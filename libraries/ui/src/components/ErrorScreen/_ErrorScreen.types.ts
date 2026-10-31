import type { ReactNode } from 'react';

export interface ErrorScreenProps {
	/**
	 * Main heading title.
	 * @default "Something went wrong"
	 */
	title?: string;
	/**
	 * Explanatory message or subtitle.
	 * @default "An unexpected error occurred while loading this screen."
	 */
	message?: string;
	/**
	 * Optional retry callback (e.g. reload or re-render error boundary).
	 */
	onRetry?: () => void;
	/**
	 * Label for the retry button.
	 * @default "Try Again"
	 */
	retryLabel?: string;
	/**
	 * Target URL for returning home.
	 * @default "/"
	 */
	homeHref?: string;
	/**
	 * Label for the return home button.
	 * @default "Return Home"
	 */
	homeLabel?: string;
	/**
	 * Optional custom action buttons or links.
	 */
	action?: ReactNode;
}
