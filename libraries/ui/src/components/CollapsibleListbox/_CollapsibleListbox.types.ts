import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ButtonSize } from '../Button/_Button.types';
import type { IconName } from '../Icon/_Icon.types';
import type { PopoverAlign } from '../Popover/_Popover.types';
import type { COLLAPSIBLE_LISTBOX_VARIANTS } from './_CollapsibleListbox.constants';

export type CollapsibleListboxVariant = (typeof COLLAPSIBLE_LISTBOX_VARIANTS)[number];

/**
 * Represents a single selectable option in the CollapsibleListbox component.
 */
export interface CollapsibleListboxOption<T extends string = string> {
	/**
	 * Unique identifier for the option.
	 */
	id: T;
	/**
	 * Display label for the option.
	 */
	label: ReactNode;
	/**
	 * Accessible title or tooltip for the option.
	 */
	title?: string;
	/**
	 * Optional icon name from the design system Icon catalog or custom emoji/string.
	 */
	icon?: IconName | (string & {});
}

/**
 * Props for the CollapsibleListbox component.
 */
export interface CollapsibleListboxProps<T extends string = string>
	extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'style'> {
	/**
	 * The current active (selected) option ID.
	 */
	activeId?: T;
	/**
	 * Initial active option ID for uncontrolled usage.
	 */
	defaultActiveId?: T;
	/**
	 * Callback fired when an option is selected.
	 */
	onSelect?: (id: T) => void;
	/**
	 * Array of available options.
	 */
	options: CollapsibleListboxOption<T>[];
	/**
	 * Accessible label for the listbox component.
	 */
	'aria-label'?: string;
	/**
	 * Optional ID of an element that labels the listbox component.
	 */
	'aria-labelledby'?: string;
	/**
	 * Optional CSS class name for the trigger button.
	 */
	className?: string;
	/**
	 * The visual variant of the trigger button.
	 */
	variant?: CollapsibleListboxVariant;
	/**
	 * Whether to show the text label in the trigger button.
	 * If false, renders an icon-only button layout.
	 */
	showLabel?: boolean;
	/**
	 * Sizing preset dictating padding, font size, and min target bounds.
	 */
	size?: ButtonSize;
	/**
	 * Alignment position of the popover relative to the trigger button.
	 */
	align?: PopoverAlign;
	/**
	 * Whether the listbox trigger is disabled.
	 */
	disabled?: boolean;
	/**
	 * Optional custom HTML ID for the listbox element.
	 */
	id?: string;
}

/**
 * Compatibility alias for option interface matching the prompt contract.
 */
export type ICollapsibleListboxOption<T extends string = string> = CollapsibleListboxOption<T>;

/**
 * Compatibility alias for props interface matching the prompt contract.
 */
export type ICollapsibleListbox<T extends string = string> = CollapsibleListboxProps<T>;
