import { type ChangeEvent, type ForwardedRef, forwardRef, useCallback } from 'react';
import { Button } from '../Button';
import * as S from './_NumberInput.styles';
import type { NumberInputProps } from './_NumberInput.types';

function clampValue(val: number, min?: number, max?: number): number {
	let next = val;
	if (min !== undefined && next < min) next = min;
	if (max !== undefined && next > max) next = max;
	return next;
}

function NumberInputInner(
	{
		value,
		onChange,
		min,
		max,
		step = 1,
		size = 'md',
		disabled = false,
		ariaLabel = 'Number input',
		decrementAriaLabel = 'Decrease',
		incrementAriaLabel = 'Increase',
		className,
		...rest
	}: NumberInputProps,
	ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
	const handleDecrement = useCallback(() => {
		if (disabled) return;
		onChange(clampValue(value - step, min, max));
	}, [disabled, max, min, onChange, step, value]);

	const handleIncrement = useCallback(() => {
		if (disabled) return;
		onChange(clampValue(value + step, min, max));
	}, [disabled, max, min, onChange, step, value]);

	const handleInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const parsed = Number(event.target.value);
			if (Number.isNaN(parsed)) return;
			onChange(clampValue(Math.round(parsed), min, max));
		},
		[max, min, onChange],
	);

	const isAtMin = min !== undefined && value <= min;
	const isAtMax = max !== undefined && value >= max;

	return (
		<div
			ref={ref}
			className={className ? `${S.Container} ${className}` : S.Container}
			data-size={size}
			data-disabled={disabled ? 'true' : 'false'}
			{...rest}
		>
			<Button
				size="sm"
				variant="ghost"
				onClick={handleDecrement}
				disabled={disabled || isAtMin}
				aria-label={decrementAriaLabel}
			>
				−
			</Button>
			<input
				type="number"
				className={S.Input}
				data-size={size}
				value={value}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				aria-label={ariaLabel}
				onChange={handleInputChange}
			/>
			<Button
				size="sm"
				variant="ghost"
				onClick={handleIncrement}
				disabled={disabled || isAtMax}
				aria-label={incrementAriaLabel}
			>
				+
			</Button>
		</div>
	);
}

export const NumberInput = forwardRef(NumberInputInner);
NumberInput.displayName = 'NumberInput';
