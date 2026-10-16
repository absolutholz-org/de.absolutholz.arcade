import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface LanguageSelectorProps {
	/**
	 * Optional language code to pass to the internal I18nProvider during SSG / SSR.
	 */
	lang?: SupportedLanguageCode;
	/**
	 * Optional custom CSS class name.
	 */
	className?: string;
	/**
	 * Optional callback invoked when the user selects a language.
	 */
	onLanguageChange?: (lang: SupportedLanguageCode) => void;
}
