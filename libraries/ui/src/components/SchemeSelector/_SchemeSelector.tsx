import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/_Icon.types';
import { RadioCardGroup, RadioCardOption } from '../RadioCardGroup';
import { useScheme, useSchemeOptions } from '../SchemeSwitcher/_SchemeSwitcher.hooks';
import type { Scheme } from '../SchemeSwitcher/_SchemeSwitcher.types';
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
	const { t, language } = useI18n('common');
	const [activeScheme, setActiveScheme] = useScheme();
	const options = useSchemeOptions();

	const handleSelect = (schemeId: Scheme) => {
		setActiveScheme(schemeId);
		onSchemeChange?.(schemeId);
	};

	return (
		<RadioCardGroup
			className={className}
			lang={language}
			legend={t('settings.schemeSectionTitle')}
			description={t('settings.schemeSectionDescription')}
			hideHeader={hideHeader}
		>
			{options.map((item) => (
				<RadioCardOption
					key={item.id}
					name="arcade-color-scheme"
					value={item.id}
					checked={activeScheme === item.id}
					onChange={() => handleSelect(item.id)}
				>
					{item.icon && <Icon name={item.icon as IconName} size="sm" />}
					{item.label}
				</RadioCardOption>
			))}
		</RadioCardGroup>
	);
}

/**
 * SchemeSelector component renders an accessible native radio group displaying
 * light, dark, and system color scheme options with persistent selection.
 */
export function SchemeSelector({ lang, hideHeader = false, className, onSchemeChange }: SchemeSelectorProps = {}) {
	return (
		<I18nProvider language={lang}>
			<SchemeSelectorInner className={className} hideHeader={hideHeader} onSchemeChange={onSchemeChange} />
		</I18nProvider>
	);
}
