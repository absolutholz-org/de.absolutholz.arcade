import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface ThemeSelectorProps {
	/**
	 * Optional language code to pass to the internal I18nProvider during SSG / SSR.
	 */
	lang?: SupportedLanguageCode;
	/**
	 * Whether to hide the internal header (title and description) when embedded inside a section that already renders a header.
	 * @default false
	 */
	hideHeader?: boolean;
	/**
	 * Optional custom CSS class name.
	 */
	className?: string;
}
