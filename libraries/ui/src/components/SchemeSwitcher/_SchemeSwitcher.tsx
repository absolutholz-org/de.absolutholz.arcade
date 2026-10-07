import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { CollapsibleListbox } from '../CollapsibleListbox';
import { useScheme, useSchemeOptions } from './_SchemeSwitcher.hooks';
import type { SchemeSwitcherProps } from './_SchemeSwitcher.types';

/**
 * SchemeSwitcher provides an accessible dropdown allowing users
 * to select between light, dark, and system color schemes.
 */
export function SchemeSwitcher({
	variant = 'outline',
	size = 'md',
	align = 'bottom',
	showLabel = false,
	'aria-label': ariaLabelProp,
	legend,
	className,
	disabled = false,
}: SchemeSwitcherProps = {}) {
	const { t } = useI18n();
	const [scheme, setScheme] = useScheme();
	const options = useSchemeOptions();

	const ariaLabel = ariaLabelProp || legend || t('switchers.scheme.ariaLabel');

	return (
		<CollapsibleListbox
			activeId={scheme}
			options={options}
			onSelect={setScheme}
			showLabel={showLabel}
			variant={variant}
			size={size}
			align={align}
			className={className}
			disabled={disabled}
			aria-label={ariaLabel}
		/>
	);
}
