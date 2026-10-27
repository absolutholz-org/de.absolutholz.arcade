import type { ReactNode } from 'react';

export interface BaseLayoutProps {
	/**
	 * Primary document title for HTML shells.
	 */
	title?: string;
	/**
	 * Optional description metadata.
	 */
	description?: string;
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
