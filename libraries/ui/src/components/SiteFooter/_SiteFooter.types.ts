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
	 * When true, opens link in a new tab with rel="noopener noreferrer external"
	 * and includes an accessible screen-reader announcement plus visual external indicator.
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
	 * Accessible name for the entire footer landmark.
	 * Defaults to localized "Site Footer" via i18n navigation.footer.
	 */
	ariaLabel?: string;
	/**
	 * Games directory links (Column 2).
	 * When omitted, automatically self-resolves active categories from @arcade/lib-games.
	 */
	gamesLinks?: SiteFooterLinkItem[];
	/**
	 * Accessible name for the games navigation column landmark.
	 * Defaults to localized "Games" via i18n navigation.games.
	 */
	gamesAriaLabel?: string;
	/**
	 * Heading for the games navigation column.
	 * Defaults to localized "Games" via i18n navigation.games.
	 */
	gamesHeading?: ReactNode;
	/**
	 * Backwards compatibility alias for games directory links (Column 2).
	 */
	catalogLinks?: SiteFooterLinkItem[];
	/**
	 * Backwards compatibility alias for games navigation column landmark.
	 */
	catalogAriaLabel?: string;
	/**
	 * Backwards compatibility alias for games navigation column heading.
	 */
	catalogHeading?: ReactNode;
	/**
	 * Arcade profile & progress links (Column 3).
	 * When omitted, automatically self-resolves Medals, Stats, and Settings links.
	 */
	arcadeLinks?: SiteFooterLinkItem[];
	/**
	 * Accessible name for the arcade profile navigation column landmark.
	 * Defaults to localized "Arcade" via i18n app.title.
	 */
	arcadeAriaLabel?: string;
	/**
	 * Heading for the arcade profile navigation column.
	 * Defaults to localized "Arcade" via i18n app.title.
	 */
	arcadeHeading?: ReactNode;
	/**
	 * Platform & development links (Column 4).
	 * When omitted, automatically self-resolves Accessibility, GitHub, and Storybook links.
	 */
	aboutLinks?: SiteFooterLinkItem[];
	/**
	 * Accessible name for the platform navigation column landmark.
	 * Defaults to localized "About" via i18n navigation.about.
	 */
	aboutAriaLabel?: string;
	/**
	 * Heading for the platform navigation column.
	 * Defaults to localized "About" via i18n navigation.about.
	 */
	aboutHeading?: ReactNode;
	/**
	 * Legal navigation links (Sub-footer), e.g. Privacy, Imprint.
	 * When omitted, automatically self-resolves Privacy and Imprint links.
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
	 * Backwards compatibility alias for platform/resource links.
	 */
	resourceLinks?: SiteFooterLinkItem[];
	/**
	 * Backwards compatibility alias for resources navigation landmark.
	 */
	resourcesAriaLabel?: string;
	/**
	 * Optional additional child elements.
	 */
	children?: ReactNode;
}

export type BaseSiteFooterProps = SiteFooterProps;
