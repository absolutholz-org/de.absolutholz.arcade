import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../constants/languages.js';
import type { SupportedLanguageCode } from '../types/i18n.types.js';

export const isSupportedLanguage = (code: string): code is SupportedLanguageCode => {
	return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
};

export const getPersistedLanguage = (): SupportedLanguageCode | null => {
	if (typeof window === 'undefined') return null;
	try {
		const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (stored && isSupportedLanguage(stored)) {
			return stored;
		}
	} catch {
		// Ignore storage access errors (e.g., restricted iframe or private browsing)
	}
	return null;
};

export const getBrowserLanguage = (): SupportedLanguageCode | null => {
	if (typeof navigator === 'undefined') return null;
	const candidateList = navigator.languages?.length ? navigator.languages : [navigator.language];
	for (const candidate of candidateList) {
		if (!candidate) continue;
		const baseCode = candidate.toLowerCase().split('-')[0];
		if (isSupportedLanguage(baseCode)) {
			return baseCode;
		}
	}
	return null;
};

export const resolveInitialLanguage = (): SupportedLanguageCode => {
	const persisted = getPersistedLanguage();
	if (persisted) {
		return persisted;
	}

	const browserMatch = getBrowserLanguage();
	if (browserMatch) {
		return browserMatch;
	}

	return DEFAULT_LANGUAGE;
};

export const persistLanguage = (code: SupportedLanguageCode): void => {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
	} catch {
		// Ignore storage write errors
	}
};
