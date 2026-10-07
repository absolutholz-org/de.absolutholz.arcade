import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface HeaderActionsProps {
	/**
	 * Active language code of the current page.
	 */
	lang: SupportedLanguageCode;
	/**
	 * Optional content slug for preserving current page during language switch.
	 */
	currentSlug?: string;
}
