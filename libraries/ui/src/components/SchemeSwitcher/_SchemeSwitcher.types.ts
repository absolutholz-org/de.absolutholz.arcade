import type { ComponentPropsWithoutRef } from 'react';
import type { ButtonSize } from '../Button/_Button.types';
import type { CollapsibleListboxVariant } from '../CollapsibleListbox/_CollapsibleListbox.types';
import type { PopoverAlign } from '../Popover/_Popover.types';
import type { SCHEME_OPTIONS } from './_SchemeSwitcher.constants';

export type Scheme = (typeof SCHEME_OPTIONS)[number];

export interface SchemeSwitcherProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'style'> {
	/**
	 * Visual variant of the trigger button.
	 */
	variant?: CollapsibleListboxVariant;
	/**
	 * Sizing preset dictating padding, font size, and min target bounds.
	 */
	size?: ButtonSize;
	/**
	 * Alignment position of the popover relative to the trigger button.
	 */
	align?: PopoverAlign;
	/**
	 * Whether to show the text label in the trigger button.
	 * If false, renders an icon-only button layout.
	 */
	showLabel?: boolean;
	/**
	 * Accessible label for the listbox component.
	 */
	'aria-label'?: string;
	/**
	 * Optional CSS class name for styling.
	 */
	className?: string;
	/**
	 * Whether the listbox trigger is disabled.
	 */
	disabled?: boolean;
	/**
	 * Backward compatibility legend prop.
	 */
	legend?: string;
	/**
	 * Backward compatibility hideLegend prop.
	 */
	hideLegend?: boolean;
	/**
	 * Backward compatibility orientation prop.
	 */
	orientation?: 'horizontal' | 'vertical';
}
