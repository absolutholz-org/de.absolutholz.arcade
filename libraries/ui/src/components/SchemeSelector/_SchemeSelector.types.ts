import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { Scheme } from '../SchemeSwitcher/_SchemeSwitcher.types';

export interface SchemeSelectorProps {
	/**
	 * Optional language code to pass to the internal I18nProvider during SSG / SSR.
	 */
	lang?: SupportedLanguageCode;
	/**
	 * Optional custom CSS class name.
	 */
	className?: string;
	/**
	 * Optional callback invoked when the user selects a color scheme.
	 */
	onSchemeChange?: (scheme: Scheme) => void;
}
