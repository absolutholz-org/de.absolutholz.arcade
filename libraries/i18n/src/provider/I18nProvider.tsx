import type { PropsWithChildren, ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../config/i18n.js';

export interface I18nProviderProps extends PropsWithChildren {
	readonly instance?: typeof i18n;
}

export const I18nProvider = ({ children, instance = i18n }: I18nProviderProps): ReactElement => {
	return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};
