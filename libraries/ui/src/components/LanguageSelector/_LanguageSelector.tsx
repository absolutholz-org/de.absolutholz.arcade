import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { Icon } from '../Icon';
import { LANGUAGE_OPTIONS } from '../LanguageSwitcher/_LanguageSwitcher.constants';
import { useLanguageSwitcher } from '../LanguageSwitcher/_LanguageSwitcher.hooks';
import * as S from './_LanguageSelector.styles';
import type { LanguageSelectorProps } from './_LanguageSelector.types';

function LanguageSelectorInner({
	className,
	lang,
	onLanguageChange,
}: {
	className?: string;
	lang?: SupportedLanguageCode;
	onLanguageChange?: (lang: SupportedLanguageCode) => void;
}) {
	const { activeLanguage, handleLanguageChange, t } = useLanguageSwitcher({
		activeLanguage: lang,
		onLanguageChange,
	});

	return (
		<S.Container className={className}>
			<S.Header>
				<S.Title>{t('settings.languageSectionTitle')}</S.Title>
				<S.Description>{t('settings.languageSectionDescription')}</S.Description>
			</S.Header>

			<S.Grid aria-label={t('settings.languageSectionTitle')}>
				{LANGUAGE_OPTIONS.map((item) => {
					const isSelected = activeLanguage === item.id;
					return (
						<S.Card
							key={item.id}
							type="button"
							aria-pressed={isSelected}
							data-selected={isSelected ? 'true' : undefined}
							onClick={() => handleLanguageChange(item.id)}
						>
							<S.CardHeader>
								<S.LanguageLabelGroup>
									{item.icon && <S.LanguageFlag aria-hidden="true">{item.icon}</S.LanguageFlag>}
									<S.LanguageName>{item.label}</S.LanguageName>
								</S.LanguageLabelGroup>
								<S.CheckIndicator data-active={isSelected ? 'true' : undefined}>
									<Icon name="check" size="xs" />
								</S.CheckIndicator>
							</S.CardHeader>
						</S.Card>
					);
				})}
			</S.Grid>
		</S.Container>
	);
}

/**
 * LanguageSelector component renders an accessible card grid displaying
 * all available supported languages in their native names with persistent selection.
 */
export function LanguageSelector({ lang, className, onLanguageChange }: LanguageSelectorProps = {}) {
	return (
		<I18nProvider language={lang}>
			<LanguageSelectorInner className={className} lang={lang} onLanguageChange={onLanguageChange} />
		</I18nProvider>
	);
}
