import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { ComponentPropsWithoutRef } from 'react';
import type { ButtonSize } from '../Button/_Button.types';
import type { CollapsibleListboxOption, CollapsibleListboxVariant } from '../CollapsibleListbox';
import type { PopoverAlign } from '../Popover/_Popover.types';

export interface UseLanguageSwitcherOptions {
	/**
	 * Controlled active language code override.
	 */
	activeLanguage?: SupportedLanguageCode;
	/**
	 * Optional callback invoked whenever a language is selected.
	 */
	onLanguageChange?: (lang: SupportedLanguageCode) => void;
}

export interface LanguageSwitcherProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'style'> {
	/**
	 * Visual variant of the trigger button.
	 * @default 'secondary'
	 */
	variant?: CollapsibleListboxVariant;
	/**
	 * Sizing preset dictating padding, font size, and min target bounds.
	 * @default 'md'
	 */
	size?: ButtonSize;
	/**
	 * Alignment position of the popover relative to the trigger button.
	 * @default 'bottom'
	 */
	align?: PopoverAlign;
	/**
	 * Whether to show the text label in the trigger button or render as icon-only.
	 * @default false
	 */
	showLabel?: boolean;
	/**
	 * Whether the switcher trigger is disabled.
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Accessible label for the language switcher.
	 */
	'aria-label'?: string;
	/**
	 * Optional ID of an element that labels the switcher.
	 */
	'aria-labelledby'?: string;
	/**
	 * Optional CSS class name for the trigger button.
	 */
	className?: string;
	/**
	 * Optional custom HTML ID for the trigger element.
	 */
	id?: string;
	/**
	 * Controlled active language code override.
	 */
	activeLanguage?: SupportedLanguageCode;
	/**
	 * Callback fired when a language is selected.
	 */
	onLanguageChange?: (lang: SupportedLanguageCode) => void;
	/**
	 * Selectable language options.
	 * Defaults to supported languages.
	 */
	options?: readonly CollapsibleListboxOption<SupportedLanguageCode>[];
}
