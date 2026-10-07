import { SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { CollapsibleListboxOption, ICollapsibleListboxOption } from '../CollapsibleListbox';

/**
 * List of options derived from supported languages for the CollapsibleListbox.
 */
export const LANGUAGE_OPTIONS: readonly CollapsibleListboxOption<SupportedLanguageCode>[] = SUPPORTED_LANGUAGES.map(
	(lang) => ({
		icon: lang.flag,
		id: lang.code,
		label: lang.label,
		title: lang.label,
	}),
);

/**
 * Compatibility alias matching the options contract.
 */
export const OPTIONS: readonly ICollapsibleListboxOption<SupportedLanguageCode>[] = LANGUAGE_OPTIONS;
