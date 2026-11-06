import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { useCallback, useEffect } from 'react';
import type { UseLanguageSwitcherOptions } from './_LanguageSwitcher.types';

const FOCUS_RESTORE_KEY = 'arcade_restore_focus';
const LANGUAGE_RADIO_FOCUS_SELECTOR = 'input[name="arcade-language"]:checked';

/**
 * Restores focus to the element flagged before a language-triggered page navigation.
 * No-ops on cold visits, where no flag exists in sessionStorage.
 */
export function useRestoreFocusAfterNavigation() {
	useEffect(() => {
		const selector = window.sessionStorage.getItem(FOCUS_RESTORE_KEY);
		if (!selector) {
			return;
		}
		window.sessionStorage.removeItem(FOCUS_RESTORE_KEY);
		document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
	}, []);
}

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
					window.sessionStorage.setItem(FOCUS_RESTORE_KEY, LANGUAGE_RADIO_FOCUS_SELECTOR);
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
