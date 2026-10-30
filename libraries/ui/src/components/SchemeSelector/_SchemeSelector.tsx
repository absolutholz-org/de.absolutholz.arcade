import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/_Icon.types';
import { useScheme, useSchemeOptions } from '../SchemeSwitcher/_SchemeSwitcher.hooks';
import type { Scheme } from '../SchemeSwitcher/_SchemeSwitcher.types';
import * as S from './_SchemeSelector.styles';
import type { SchemeSelectorProps } from './_SchemeSelector.types';

function SchemeSelectorInner({
	className,
	hideHeader = false,
	onSchemeChange,
}: {
	className?: string;
	hideHeader?: boolean;
	onSchemeChange?: (scheme: Scheme) => void;
}) {
	const { t } = useI18n('common');
	const [activeScheme, setActiveScheme] = useScheme();
	const options = useSchemeOptions();

	const handleSelect = (schemeId: Scheme) => {
		setActiveScheme(schemeId);
		onSchemeChange?.(schemeId);
	};

	return (
		<S.Container className={className}>
			{!hideHeader && (
				<S.Header>
					<S.Title>{t('settings.schemeSectionTitle')}</S.Title>
					<S.Description>{t('settings.schemeSectionDescription')}</S.Description>
				</S.Header>
			)}

			<S.Grid aria-label={t('settings.schemeSectionTitle')}>
				{options.map((item) => {
					const isSelected = activeScheme === item.id;
					return (
						<S.Card
							key={item.id}
							type="button"
							aria-pressed={isSelected}
							data-selected={isSelected ? 'true' : undefined}
							onClick={() => handleSelect(item.id)}
						>
							<S.CardHeader>
								<S.SchemeLabelGroup>
									{item.icon && <Icon name={item.icon as IconName} size="sm" />}
									<S.SchemeName>{item.label}</S.SchemeName>
								</S.SchemeLabelGroup>
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
 * SchemeSelector component renders an accessible card grid displaying
 * light, dark, and system color scheme options with preview swatches and persistent selection.
 */
export function SchemeSelector({ lang, hideHeader = false, className, onSchemeChange }: SchemeSelectorProps = {}) {
	return (
		<I18nProvider language={lang}>
			<SchemeSelectorInner className={className} hideHeader={hideHeader} onSchemeChange={onSchemeChange} />
		</I18nProvider>
	);
}
