import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { useThemeset } from '../../hooks/useThemeset';
import { THEMESET_IDS, type ThemesetId } from '../../styles/theme/theme.constants';
import { RadioCardGroup, RadioCardOption } from '../RadioCardGroup';
import * as S from './_ThemeSelector.styles';
import type { ThemeSelectorProps } from './_ThemeSelector.types';

function ThemeSelectorInner({
	className,
	hideHeader = false,
}: {
	className?: string;
	hideHeader?: boolean;
}) {
	const { t, language } = useI18n('common');
	const [activeThemeset, setActiveThemeset] = useThemeset();

	return (
		<RadioCardGroup
			className={className}
			lang={language}
			layout="swatch"
			legend={t('settings.themeSectionTitle')}
			description={t('settings.themeSectionDescription')}
			hideHeader={hideHeader}
		>
			{THEMESET_IDS.map((id: ThemesetId) => (
				<RadioCardOption
					key={id}
					name="arcade-theme"
					value={id}
					checked={activeThemeset === id}
					onChange={() => setActiveThemeset(id)}
					preview={
						<S.SwatchRow data-themeset={id} aria-hidden="true">
							<S.Swatch data-type="surface" />
							<S.Swatch data-type="container" />
							<S.Swatch data-type="accent" />
							<S.Swatch data-type="accent-secondary" />
						</S.SwatchRow>
					}
				>
					{t(`settings.themes.${id}`)}
				</RadioCardOption>
			))}
		</RadioCardGroup>
	);
}

/**
 * ThemeSelector component renders an accessible native radio group displaying
 * all available themesets with preview swatches and persistent selection.
 */
export function ThemeSelector({ lang, hideHeader = false, className }: ThemeSelectorProps = {}) {
	return (
		<I18nProvider language={lang}>
			<ThemeSelectorInner className={className} hideHeader={hideHeader} />
		</I18nProvider>
	);
}
