import type { GameId } from '@arcade/lib-games';
import type { ReactNode } from 'react';
import type { PageTitleOptions } from '../../utils/seo';

export interface BaseLayoutProps {
	/**
	 * Primary document title for HTML shells.
	 */
	title?: string;
	/**
	 * Structured title formatting options. When provided, takes precedence over raw title.
	 */
	titleOptions?: PageTitleOptions;
	/**
	 * Optional description metadata.
	 */
	description?: string;
	/**
	 * Optional explicit game identifier for game-specific SEO and JSON-LD structured data.
	 * When omitted on game routes, automatically inferred from the route base/pathname.
	 */
	gameId?: GameId;
	/**
	 * Document language code.
	 * @default 'en'
	 */
	lang?: string;
	/**
	 * Text direction for the document root.
	 * @default 'ltr'
	 */
	dir?: 'ltr' | 'rtl';
	/**
	 * Full canonical URL.
	 */
	canonical?: string;
	/**
	 * Mobile web application title.
	 * @default 'Arcade'
	 */
	appTitle?: string;
	/**
	 * Web app manifest URL.
	 */
	manifestHref?: string;
	/**
	 * Content nodes rendered inside the layout shell.
	 */
	children?: ReactNode;
}
