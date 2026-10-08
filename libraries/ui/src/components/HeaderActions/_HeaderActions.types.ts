import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface HeaderActionsProps {
	/**
	 * Active language code used to initialize and synchronize the language switcher.
	 */
	lang?: SupportedLanguageCode;

	/**
	 * Optional page slug to preserve during language switching.
	 */
	currentSlug?: string;
}
