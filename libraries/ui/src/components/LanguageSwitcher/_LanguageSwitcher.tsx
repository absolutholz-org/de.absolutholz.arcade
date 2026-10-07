import { CollapsibleListbox } from '../CollapsibleListbox';
import { LANGUAGE_OPTIONS } from './_LanguageSwitcher.constants';
import { useLanguageSwitcher } from './_LanguageSwitcher.hooks';
import type { LanguageSwitcherProps } from './_LanguageSwitcher.types';

/**
 * LanguageSwitcher provides an accessible select-like dropdown menu allowing users
 * to switch the active application language across all supported locales.
 */
export function LanguageSwitcher({
	variant = 'outline',
	showLabel = false,
	size = 'md',
	align = 'bottom',
	disabled = false,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	className,
	id,
	activeLanguage: controlledActiveLanguage,
	onLanguageChange,
	options = LANGUAGE_OPTIONS,
}: LanguageSwitcherProps = {}) {
	const { activeLanguage, handleLanguageChange, t } = useLanguageSwitcher({
		activeLanguage: controlledActiveLanguage,
		onLanguageChange,
	});

	const resolvedAriaLabel = ariaLabel || (ariaLabelledBy ? undefined : t('switchers.language.ariaLabel'));

	return (
		<CollapsibleListbox
			id={id}
			className={className}
			variant={variant}
			size={size}
			align={align}
			disabled={disabled}
			activeId={activeLanguage}
			options={[...options]}
			onSelect={handleLanguageChange}
			showLabel={showLabel}
			aria-label={resolvedAriaLabel}
			aria-labelledby={ariaLabelledBy}
		/>
	);
}
