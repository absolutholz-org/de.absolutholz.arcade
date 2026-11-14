export interface NumberStepperProps {
	/** Current numeric value */
	value: number;
	/** Callback invoked with the clamped next value */
	onChange: (value: number) => void;
	/** Minimum allowed value (default: 1) */
	min?: number;
	/** Maximum allowed value (default: 50) */
	max?: number;
	/** Step increment/decrement amount (default: 1) */
	step?: number;
	/** Disables the input and stepper buttons */
	disabled?: boolean;
	/** Explicit accessible label linked to the input via htmlFor/id */
	label: string;
	/** Accessible label for the decrement button */
	decrementLabel: string;
	/** Accessible label for the increment button */
	incrementLabel: string;
	/** Optional formatter for screen reader live region announcements */
	unitFormatter?: (value: number) => string;
}
