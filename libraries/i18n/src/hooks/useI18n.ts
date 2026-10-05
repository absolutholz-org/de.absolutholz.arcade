import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants/languages.js';
import type { SupportedLanguageCode, TranslationKey, UseI18nReturn } from '../types/i18n.types.js';
import { isSupportedLanguage, persistLanguage } from '../utils/detection.js';

export const useI18n = (ns?: string): UseI18nReturn => {
	const { t: translateRaw, i18n, ready } = useTranslation(ns);

	const activeLanguage: SupportedLanguageCode = useMemo(() => {
		const current = i18n.resolvedLanguage || i18n.language || DEFAULT_LANGUAGE;
		const baseCode = current.split('-')[0];
		return isSupportedLanguage(baseCode) ? baseCode : DEFAULT_LANGUAGE;
	}, [i18n.resolvedLanguage, i18n.language]);

	const changeLanguage = useCallback(
		async (code: SupportedLanguageCode): Promise<void> => {
			persistLanguage(code);
			await i18n.changeLanguage(code);
		},
		[i18n],
	);

	const t = useCallback(
		(key: TranslationKey, options?: Record<string, unknown>): string => {
			return translateRaw(key, options);
		},
		[translateRaw],
	);

	return {
		t,
		language: activeLanguage,
		changeLanguage,
		supportedLanguages: SUPPORTED_LANGUAGES,
		isReady: ready,
	};
};
