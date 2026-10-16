import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface SegmentedControlItem {
	/** Unique identifier of the segment */
	id: string;
	/** Primary label for the segment */
	label: ReactNode;
	/** Optional secondary subline */
	sublabel?: ReactNode;
	/** Whether the segment is disabled */
	disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'style'> {
	/** Array of selectable segments */
	items: readonly SegmentedControlItem[];
	/** Currently selected segment id */
	value: string;
	/** Callback invoked when a segment is selected */
	onChange: (id: string) => void;
	/** Optional accessible name for the radiogroup */
	ariaLabel?: string;
	/** Optional name for form grouping */
	name?: string;
}
