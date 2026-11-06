import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { LANGUAGE_OPTIONS } from '../LanguageSwitcher/_LanguageSwitcher.constants';
import { useLanguageSwitcher, useRestoreFocusAfterNavigation } from '../LanguageSwitcher/_LanguageSwitcher.hooks';
import { RadioCardGroup, RadioCardOption } from '../RadioCardGroup';
import type { LanguageSelectorProps } from './_LanguageSelector.types';

function LanguageSelectorInner({
	className,
	hideHeader = false,
	lang,
	onLanguageChange,
}: {
	className?: string;
	hideHeader?: boolean;
	lang?: SupportedLanguageCode;
	onLanguageChange?: (lang: SupportedLanguageCode) => void;
}) {
	const { activeLanguage, handleLanguageChange, t } = useLanguageSwitcher({
		activeLanguage: lang,
		onLanguageChange,
	});
	useRestoreFocusAfterNavigation();

	return (
		<RadioCardGroup
			className={className}
			lang={activeLanguage}
			legend={t('settings.languageSectionTitle')}
			description={t('settings.languageSectionDescription')}
			hideHeader={hideHeader}
		>
			{LANGUAGE_OPTIONS.map((item) => (
				<RadioCardOption
					key={item.id}
					name="arcade-language"
					value={item.id}
					checked={activeLanguage === item.id}
					onChange={() => handleLanguageChange(item.id)}
				>
					{item.icon && <span aria-hidden="true">{item.icon}</span>}
					{item.label}
				</RadioCardOption>
			))}
		</RadioCardGroup>
	);
}

/**
 * LanguageSelector component renders an accessible native radio group displaying
 * all available supported languages in their native names with persistent selection.
 */
export function LanguageSelector({
	lang,
	hideHeader = false,
	className,
	onLanguageChange,
}: LanguageSelectorProps = {}) {
	return (
		<I18nProvider language={lang}>
			<LanguageSelectorInner
				className={className}
				hideHeader={hideHeader}
				lang={lang}
				onLanguageChange={onLanguageChange}
			/>
		</I18nProvider>
	);
}
