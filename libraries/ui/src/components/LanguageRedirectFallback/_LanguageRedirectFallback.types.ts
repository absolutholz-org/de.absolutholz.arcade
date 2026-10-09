import type { ComponentPropsWithoutRef } from 'react';

export interface LanguageRedirectItem {
	/** Language ISO code (e.g., 'en', 'de', 'fr', 'pt') */
	code: string;
	/** Human-readable language name (e.g., 'English', 'Deutsch') */
	label: string;
	/** Optional flag emoji (e.g., '🇺🇸', '🇩🇪') */
	flag?: string;
	/** Resolved destination URL for this language route */
	href: string;
}

export interface LanguageRedirectFallbackProps
	extends Omit<ComponentPropsWithoutRef<'main'>, 'style' | 'children' | 'title'> {
	/**
	 * The title of the application or game (e.g., "Arcade" or "Sudoku").
	 */
	title: string;

	/**
	 * The status or explanation message indicating language redirection.
	 */
	message?: string;

	/**
	 * Accessible label for the navigation element containing language links.
	 */
	languagesAriaLabel?: string;

	/**
	 * List of languages available for selection.
	 */
	languages: readonly LanguageRedirectItem[] | LanguageRedirectItem[];
}
