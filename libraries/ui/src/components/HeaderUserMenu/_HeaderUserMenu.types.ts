import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export interface HeaderUserMenuProps {
	/**
	 * Active language code for localized strings.
	 */
	lang?: SupportedLanguageCode;

	/**
	 * Optional additional CSS class name.
	 */
	className?: string;
}
