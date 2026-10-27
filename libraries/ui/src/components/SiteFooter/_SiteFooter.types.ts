import type { ReactNode } from 'react';

export interface SiteFooterLinkItem {
	/**
	 * URL target for the link.
	 */
	href: string;
	/**
	 * Visual label text or React element.
	 */
	label: ReactNode;
	/**
	 * Optional BCP 47 language code of the linked resource (e.g., 'en', 'de').
	 */
	hrefLang?: string;
	/**
	 * When true, opens link in a new tab with rel="noopener noreferrer"
	 * and includes an accessible screen-reader announcement.
	 */
	external?: boolean;
	/**
	 * Accessible label override for assistive technologies.
	 */
	ariaLabel?: string;
}

export interface SiteFooterCopyright {
	/**
	 * The entity or organization name owning the copyright.
	 * @default 'absolutholz'
	 */
	owner?: string;
	/**
	 * Starting year for a copyright range (e.g., 2024).
	 */
	startYear?: number;
	/**
	 * Current/end year for the copyright notice.
	 */
	currentYear?: number;
}

export interface SiteFooterProps {
	/**
	 * Legal navigation links (Cluster A), e.g. Privacy, Accessibility.
	 * When omitted, automatically self-resolves standard legal links using ambient i18n context.
	 */
	legalLinks?: SiteFooterLinkItem[];
	/**
	 * Accessible name for the legal navigation landmark.
	 * @default 'Legal'
	 */
	legalAriaLabel?: string;
	/**
	 * Copyright configuration object, custom string, or false to hide.
	 */
	copyright?: SiteFooterCopyright | string | false;
	/**
	 * Accessible name for the copyright span.
	 * @default 'Copyright notice'
	 */
	copyrightAriaLabel?: string;
	/**
	 * Version string to display alongside the copyright notice.
	 * Defaults to the version defined in package.json. Pass false to hide.
	 */
	version?: string | false;
	/**
	 * Project or resource navigation links (Cluster C), e.g., GitHub, Storybook.
	 * When omitted, automatically self-resolves standard resource links.
	 */
	resourceLinks?: SiteFooterLinkItem[];
	/**
	 * Accessible name for the resources navigation landmark.
	 * @default 'Project resources'
	 */
	resourcesAriaLabel?: string;
	/**
	 * Optional additional child elements.
	 */
	children?: ReactNode;
}

export type BaseSiteFooterProps = SiteFooterProps;
