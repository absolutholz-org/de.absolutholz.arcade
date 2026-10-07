import { type ForwardedRef, forwardRef } from 'react';
import { useSwitch } from './_Switch.hooks';
import * as S from './_Switch.styles';
import type { SwitchProps } from './_Switch.types';

function SwitchInner(
	{
		id: propId,
		label,
		checked,
		defaultChecked,
		onChange,
		disabled = false,
		size = 'md',
		fullWidth = false,
		className,
		name,
		value,
		required,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		'aria-describedby': ariaDescribedBy,
	}: SwitchProps,
	ref: ForwardedRef<HTMLInputElement>,
) {
	const { id, isChecked, handleChange } = useSwitch({
		id: propId,
		checked,
		defaultChecked,
		disabled,
		onChange,
	});

	return (
		<S.Switch
			htmlFor={id}
			className={className}
			data-disabled={disabled ? 'true' : undefined}
			data-full-width={fullWidth ? 'true' : undefined}
			data-size={size}
		>
			{label && <span data-slot="label">{label}</span>}
			<input
				ref={ref}
				id={id}
				name={name}
				value={value}
				type="checkbox"
				role="switch"
				checked={isChecked}
				onChange={handleChange}
				disabled={disabled}
				required={required}
				aria-checked={isChecked}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
			/>
			<div data-slot="track" data-checked={isChecked ? 'true' : undefined}>
				<span data-slot="thumb" />
			</div>
		</S.Switch>
	);
}

/**
 * Switch component provides an accessible toggle control adhering to WCAG 2.2 AA.
 * Supports controlled and uncontrolled states, sizing variants, full-width layouts,
 * and high-contrast Forced Colors Mode.
 */
export const Switch = forwardRef(SwitchInner);
