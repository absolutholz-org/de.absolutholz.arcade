import type { PropsWithChildren, ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../config/i18n.js';
import type { SupportedLanguageCode } from '../types/i18n.types.js';

export interface I18nProviderProps extends PropsWithChildren {
	readonly instance?: typeof i18n;
	readonly language?: SupportedLanguageCode;
}

export const I18nProvider = ({ children, instance = i18n, language }: I18nProviderProps): ReactElement => {
	const prevLangRef = useRef<SupportedLanguageCode | undefined>(language);
	const initialSyncDoneRef = useRef(false);

	if (!initialSyncDoneRef.current) {
		initialSyncDoneRef.current = true;
		if (language && instance.language !== language) {
			instance.changeLanguage(language);
		}
	}

	useEffect(() => {
		if (language && prevLangRef.current !== language) {
			prevLangRef.current = language;
			if (instance.language !== language) {
				instance.changeLanguage(language);
			}
		}
	}, [instance, language]);

	return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};
