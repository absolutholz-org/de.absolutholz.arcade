import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { persistLanguage } from '@arcade/lib-i18n/utils/detection';
import { Button } from '../Button';
import { HeaderUserMenu } from '../HeaderUserMenu';
import { Icon } from '../Icon';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { SchemeSwitcher } from '../SchemeSwitcher';
import { Toolbar } from '../Toolbar';
import type { HeaderActionsProps } from './_HeaderActions.types';

function HeaderActionsContent({
	currentSlug,
	handleLanguageChange,
	lang,
}: {
	currentSlug?: string;
	handleLanguageChange: (nextLang: SupportedLanguageCode) => void;
	lang?: SupportedLanguageCode;
}) {
	const { t } = useI18n('common');
	const isSettingsActive = currentSlug === 'settings';

	return (
		<Toolbar variant="ghost" size="sm" aria-label={t('switchers.toolbarLabel')}>
			<LanguageSwitcher activeLanguage={lang} onLanguageChange={handleLanguageChange} />
			<SchemeSwitcher />
			<Button
				as="a"
				href={`/${lang ?? 'en'}/settings`}
				variant="outline"
				size="md"
				isIconOnly
				aria-label={t('navigation.settings')}
				aria-current={isSettingsActive ? 'page' : undefined}
				title={t('navigation.settings')}
				leadingIcon={<Icon name="settings" size="sm" />}
			/>
			<HeaderUserMenu lang={lang} />
		</Toolbar>
	);
}

/**
 * Interactive header actions cluster containing language, color scheme switchers,
 * settings shortcut, and user profile authentication menu.
 * Handles client-side navigation between localized routes with path preservation.
 */
export function HeaderActions({ lang, currentSlug }: HeaderActionsProps = {}) {
	const derivedSlug =
		typeof window !== 'undefined'
			? window.location.pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '').replace(/\/$/, '')
			: '';
	const resolvedSlug = currentSlug !== undefined ? currentSlug : derivedSlug;

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
					: resolvedSlug
						? `/${nextLang}/${resolvedSlug}`
						: `/${nextLang}/`;
			window.location.assign(targetPath + window.location.search);
		}
	};

	return (
		<I18nProvider language={lang}>
			<HeaderActionsContent currentSlug={resolvedSlug} handleLanguageChange={handleLanguageChange} lang={lang} />
		</I18nProvider>
	);
}
