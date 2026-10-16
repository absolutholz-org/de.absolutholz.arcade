import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { useCallback, useEffect } from 'react';
import type { UseLanguageSwitcherOptions } from './_LanguageSwitcher.types';

/**
 * Hook managing active language state, language switching,
 * persistent storage sync, and document root attribute updates.
 */
export function useLanguageSwitcher({
	activeLanguage: controlledActiveLanguage,
	onLanguageChange,
}: UseLanguageSwitcherOptions = {}) {
	const { language, changeLanguage, t } = useI18n();

	const activeLanguage = controlledActiveLanguage ?? language;

	const handleLanguageChange = useCallback(
		(lang: SupportedLanguageCode) => {
			if (!controlledActiveLanguage) {
				changeLanguage(lang);
			}
			if (onLanguageChange) {
				onLanguageChange(lang);
				return;
			}
			if (typeof window !== 'undefined' && activeLanguage && lang !== activeLanguage) {
				const currentPath = window.location.pathname;
				if (currentPath.includes(`/${activeLanguage}`)) {
					const targetPath = currentPath.replace(new RegExp(`/${activeLanguage}(/|$)`), `/${lang}$1`);
					window.location.assign(targetPath + window.location.search);
				}
			}
		},
		[activeLanguage, changeLanguage, controlledActiveLanguage, onLanguageChange],
	);

	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = activeLanguage;
		}
	}, [activeLanguage]);

	return {
		activeLanguage,
		handleLanguageChange,
		t,
	};
}
