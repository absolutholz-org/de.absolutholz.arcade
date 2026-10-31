import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface SegmentedControlOption<T extends string = string> {
	/** Unique value/identifier of the segment */
	value: T;
	/** Primary label for the segment */
	label?: ReactNode;
	/** Optional leading icon */
	icon?: ReactNode;
	/** Optional secondary subline */
	sublabel?: ReactNode;
	/** Whether the segment is disabled */
	disabled?: boolean;
	/** Optional accessible label for assistive tech */
	ariaLabel?: string;
	/** Optional controlled element ID for tablist pattern */
	ariaControls?: string;
}

/** Legacy backwards-compatible interface */
export interface SegmentedControlItem {
	/** Unique identifier of the segment */
	id: string;
	/** Primary label for the segment */
	label: ReactNode;
	/** Optional leading icon */
	icon?: ReactNode;
	/** Optional secondary subline */
	sublabel?: ReactNode;
	/** Whether the segment is disabled */
	disabled?: boolean;
	/** Optional accessible label for assistive tech */
	ariaLabel?: string;
	/** Optional controlled element ID for tablist pattern */
	ariaControls?: string;
}

export type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlProps<T extends string = string>
	extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'style'> {
	/** Modern generic array of selectable segments */
	options?: readonly SegmentedControlOption<T>[];
	/** Legacy backwards-compatible array of selectable segments */
	items?: readonly (SegmentedControlItem | SegmentedControlOption<T>)[];
	/** Currently selected segment value */
	value: T;
	/** Callback invoked when a segment is selected */
	onChange: (value: T) => void;
	/** Sizing variant ('sm' for compact toolbars, 'md' for standard pickers) */
	size?: SegmentedControlSize;
	/** Optional accessible name for the radiogroup/tablist */
	ariaLabel?: string;
	/** Optional name for form grouping */
	name?: string;
	/** ARIA grouping role: 'radiogroup' (default) or 'tablist' */
	role?: 'radiogroup' | 'tablist';
}
