import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { persistLanguage } from '@arcade/lib-i18n/utils/detection';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import { Stack } from '@arcade/lib-ui/components/Stack';
import type { HeaderActionsProps } from './_HeaderActions.types';

/**
 * Interactive header actions cluster containing language and color scheme switchers.
 * Handles client-side navigation between localized routes.
 */
export function HeaderActions({ lang, currentSlug = '' }: HeaderActionsProps) {
	const handleLanguageChange = (nextLang: SupportedLanguageCode) => {
		persistLanguage(nextLang);
		if (nextLang === lang) {
			return;
		}
		const targetPath = currentSlug ? `/${nextLang}/${currentSlug}` : `/${nextLang}/`;
		if (typeof window !== 'undefined') {
			window.location.assign(targetPath);
		}
	};

	return (
		<I18nProvider language={lang}>
			<Stack direction="row" align="center" spacing="xs" inline fullWidth={false}>
				<LanguageSwitcher activeLanguage={lang} onLanguageChange={handleLanguageChange} />
				<SchemeSwitcher />
			</Stack>
		</I18nProvider>
	);
}
