import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface ThemeSelectorProps {
	/**
	 * Optional language code to pass to the internal I18nProvider during SSG / SSR.
	 */
	lang?: SupportedLanguageCode;
	/**
	 * Optional custom CSS class name.
	 */
	className?: string;
}
