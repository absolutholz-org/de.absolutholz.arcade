import type { ReactNode } from 'react';
import type { BANNER_VARIANTS } from './_Banner.constants';

export type BannerVariant = (typeof BANNER_VARIANTS)[number];

export interface IBanner {
	/**
	 * Optional action to be displayed on the right side of the banner.
	 */
	action?: ReactNode;

	/**
	 * The message to be displayed in the banner.
	 */
	message: string;

	/**
	 * Explicit indicator for the status type (e.g., 'SUCCESS', 'INFO').
	 */
	statusLabel: string;

	/**
	 * The visual style of the banner.
	 * @default 'info'
	 */
	variant?: BannerVariant;
}

export type BannerProps = IBanner;
