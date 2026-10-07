import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { i18n as defaultI18n } from '../config/i18n.js';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants/languages.js';
import type { SupportedLanguageCode, TranslationKey, UseI18nReturn } from '../types/i18n.types.js';
import { isSupportedLanguage, persistLanguage } from '../utils/detection.js';

export const useI18n = (ns?: string): UseI18nReturn => {
	const { t: translateRaw, i18n: contextI18n, ready } = useTranslation(ns);
	const activeI18n = contextI18n || defaultI18n;

	const activeLanguage: SupportedLanguageCode = useMemo(() => {
		const current = activeI18n.resolvedLanguage || activeI18n.language || DEFAULT_LANGUAGE;
		const baseCode = current.split('-')[0];
		return isSupportedLanguage(baseCode) ? baseCode : DEFAULT_LANGUAGE;
	}, [activeI18n.resolvedLanguage, activeI18n.language]);

	const changeLanguage = useCallback(
		async (code: SupportedLanguageCode): Promise<void> => {
			persistLanguage(code);
			await activeI18n.changeLanguage(code);
		},
		[activeI18n],
	);

	const t = useCallback(
		(key: TranslationKey, options?: Record<string, unknown>): string => {
			return translateRaw ? translateRaw(key, options) : activeI18n.t(key, options);
		},
		[translateRaw, activeI18n],
	);

	return {
		t,
		language: activeLanguage,
		changeLanguage,
		supportedLanguages: SUPPORTED_LANGUAGES,
		isReady: ready,
	};
};
