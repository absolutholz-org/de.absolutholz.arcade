import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { persistLanguage } from '@arcade/lib-i18n/utils/detection';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { SchemeSwitcher } from '../SchemeSwitcher';
import { Toolbar } from '../Toolbar';
import type { HeaderActionsProps } from './_HeaderActions.types';

function HeaderActionsContent({
	handleLanguageChange,
	lang,
}: {
	handleLanguageChange: (nextLang: SupportedLanguageCode) => void;
	lang?: SupportedLanguageCode;
}) {
	const { t } = useI18n('common');

	return (
		<Toolbar variant="ghost" size="sm" aria-label={t('switchers.toolbarLabel')}>
			<LanguageSwitcher activeLanguage={lang} onLanguageChange={handleLanguageChange} />
			<SchemeSwitcher />
		</Toolbar>
	);
}

/**
 * Interactive header actions cluster containing language and color scheme switchers.
 * Handles client-side navigation between localized routes with path preservation.
 */
export function HeaderActions({ lang, currentSlug = '' }: HeaderActionsProps = {}) {
	const handleLanguageChange = (nextLang: SupportedLanguageCode) => {
		persistLanguage(nextLang);
		if (nextLang === lang) {
			return;
		}
		if (typeof window !== 'undefined') {
			const currentPath = window.location.pathname;
			const targetPath =
				lang && currentPath.includes(`/${lang}`)
					? currentPath.replace(new RegExp(`/${lang}(/|$)`), `/${nextLang}$1`)
					: currentSlug
						? `/${nextLang}/${currentSlug}`
						: `/${nextLang}/`;
			window.location.assign(targetPath + window.location.search);
		}
	};

	return (
		<I18nProvider language={lang}>
			<HeaderActionsContent handleLanguageChange={handleLanguageChange} lang={lang} />
		</I18nProvider>
	);
}
