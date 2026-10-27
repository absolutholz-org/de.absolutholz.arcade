import type { ReactNode } from 'react';
import type { BaseLayoutProps } from '../BaseLayout/_BaseLayout.types';

export interface BaseLayoutWithSiteHeaderAndSiteFooterProps extends BaseLayoutProps {
	/**
	 * When true, visually omits the brand logo and application title link in SiteHeader.
	 * @default false
	 */
	hideBrand?: boolean;
	/**
	 * Whether the header renders a bottom border.
	 * @default true
	 */
	hasBorder?: boolean;
	/**
	 * Current page slug for route detection in header actions.
	 */
	currentSlug?: string;
	/**
	 * Optional breadcrumb element rendered outside of the main content landmark.
	 */
	breadcrumb?: ReactNode;
	/**
	 * Unconstrained main content slot.
	 */
	children?: ReactNode;
}
