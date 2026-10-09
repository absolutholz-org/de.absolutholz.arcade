import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { useThemeset } from '../../hooks/useThemeset';
import { THEMESET_IDS, type ThemesetId } from '../../styles/theme/theme.constants';
import { Icon } from '../Icon';
import * as S from './_ThemeSelector.styles';
import type { ThemeSelectorProps } from './_ThemeSelector.types';

function ThemeSelectorInner({ className }: { className?: string }) {
	const { t } = useI18n('common');
	const [activeThemeset, setActiveThemeset] = useThemeset();

	return (
		<S.Container className={className}>
			<S.Header>
				<S.Title>{t('settings.themeSectionTitle')}</S.Title>
				<S.Description>{t('settings.themeSectionDescription')}</S.Description>
			</S.Header>

			<S.Grid aria-label={t('settings.themeSectionTitle')}>
				{THEMESET_IDS.map((id: ThemesetId) => {
					const isSelected = activeThemeset === id;
					const themeLabel = t(`settings.themes.${id}`);

					return (
						<S.Card
							key={id}
							type="button"
							aria-pressed={isSelected}
							data-selected={isSelected ? 'true' : undefined}
							onClick={() => setActiveThemeset(id)}
						>
							<S.CardHeader>
								<S.ThemeName>{themeLabel}</S.ThemeName>
								<S.CheckIndicator data-active={isSelected ? 'true' : undefined}>
									<Icon name="check" size="xs" />
								</S.CheckIndicator>
							</S.CardHeader>

							<S.SwatchRow data-themeset={id} aria-hidden="true">
								<S.Swatch data-type="surface" />
								<S.Swatch data-type="container" />
								<S.Swatch data-type="accent" />
								<S.Swatch data-type="accent-secondary" />
							</S.SwatchRow>
						</S.Card>
					);
				})}
			</S.Grid>
		</S.Container>
	);
}

/**
 * ThemeSelector component renders an accessible card grid displaying
 * all available themesets with preview swatches and persistent selection.
 */
export function ThemeSelector({ lang, className }: ThemeSelectorProps = {}) {
	return (
		<I18nProvider language={lang}>
			<ThemeSelectorInner className={className} />
		</I18nProvider>
	);
}
