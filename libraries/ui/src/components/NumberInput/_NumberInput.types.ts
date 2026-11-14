import type { ComponentPropsWithoutRef } from 'react';

export type NumberInputSize = 'sm' | 'md';

export interface NumberInputProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'style'> {
	/** Current numeric value */
	value: number;
	/** Callback invoked with the clamped next value */
	onChange: (value: number) => void;
	/** Minimum allowed value */
	min?: number;
	/** Maximum allowed value */
	max?: number;
	/** Step increment/decrement amount */
	step?: number;
	/** Sizing variant */
	size?: NumberInputSize;
	/** Disables the input and stepper buttons */
	disabled?: boolean;
	/** Accessible label for the numeric input */
	ariaLabel?: string;
	/** Accessible label for the decrement button */
	decrementAriaLabel?: string;
	/** Accessible label for the increment button */
	incrementAriaLabel?: string;
}
