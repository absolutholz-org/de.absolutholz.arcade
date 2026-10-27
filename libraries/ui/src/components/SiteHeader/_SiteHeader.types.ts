import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SITE_HEADER_VARIANTS } from './_SiteHeader.constants';

export type SiteHeaderVariant = (typeof SITE_HEADER_VARIANTS)[number];

export interface SiteHeaderProps extends ComponentPropsWithoutRef<'header'> {
	/**
	 * Layout variant for the header container.
	 * @default 'standard'
	 */
	variant?: SiteHeaderVariant;
	/**
	 * When true, visually omits the brand logo and application title link.
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
	 * Child elements rendered inside the header container.
	 */
	children?: ReactNode;
}

export type BaseSiteHeaderProps = SiteHeaderProps;
