import type { ReactNode } from 'react';

export interface NotFoundScreenProps {
	/**
	 * Main heading title.
	 * @default "Page Not Found"
	 */
	title?: string;
	/**
	 * Explanatory message or subtitle.
	 * @default "The page or puzzle you're looking for doesn't exist or has moved."
	 */
	message?: string;
	/**
	 * Target URL for the primary return link.
	 * @default "/"
	 */
	homeHref?: string;
	/**
	 * Label for the primary return button.
	 * @default "Back to Arcade"
	 */
	homeLabel?: string;
	/**
	 * Optional custom action buttons or links.
	 */
	action?: ReactNode;
}
