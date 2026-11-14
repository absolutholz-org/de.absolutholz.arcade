import {
	type ChangeEvent,
	type ForwardedRef,
	type KeyboardEvent,
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useState,
} from 'react';
import { Button } from '../Button';
import * as S from './_NumberStepper.styles';
import type { NumberStepperProps } from './_NumberStepper.types';

function clampValue(val: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, val));
}

function NumberStepperInner(
	{
		value,
		onChange,
		min = 1,
		max = 50,
		step = 1,
		disabled = false,
		label,
		decrementLabel,
		incrementLabel,
		unitFormatter,
	}: NumberStepperProps,
	ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
	const inputId = useId();
	const [draft, setDraft] = useState<string>(() => String(value));
	const [announcement, setAnnouncement] = useState<string>('');

	useEffect(() => {
		setDraft(String(value));
	}, [value]);

	const stepBy = useCallback(
		(delta: number) => {
			if (disabled) return;
			const next = clampValue(value + delta, min, max);
			setDraft(String(next));
			onChange(next);
			setAnnouncement(unitFormatter ? unitFormatter(next) : String(next));
		},
		[disabled, max, min, onChange, unitFormatter, value],
	);

	const handleDecrement = useCallback(() => {
		stepBy(-step);
	}, [step, stepBy]);

	const handleIncrement = useCallback(() => {
		stepBy(step);
	}, [step, stepBy]);

	const commitDraft = useCallback(
		(raw: string) => {
			const parsed = Number.parseInt(raw, 10);
			const clamped = clampValue(Number.isNaN(parsed) ? min : parsed, min, max);
			setDraft(String(clamped));
			onChange(clamped);
		},
		[max, min, onChange],
	);

	const handleInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const sanitized = event.target.value.replace(/\D/g, '');
			setDraft(sanitized);
			const parsed = Number.parseInt(sanitized, 10);
			if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
				onChange(parsed);
			}
		},
		[max, min, onChange],
	);

	const handleBlur = useCallback(() => {
		commitDraft(draft);
	}, [commitDraft, draft]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				commitDraft(draft);
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				stepBy(step);
			} else if (event.key === 'ArrowDown') {
				event.preventDefault();
				stepBy(-step);
			}
		},
		[commitDraft, draft, step, stepBy],
	);

	const isAtMin = value <= min;
	const isAtMax = value >= max;

	return (
		<div ref={ref} className={S.Container} data-disabled={disabled ? 'true' : 'false'}>
			<label htmlFor={inputId} className={S.VisuallyHidden}>
				{label}
			</label>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				onClick={handleDecrement}
				disabled={disabled || isAtMin}
				aria-label={decrementLabel}
			>
				−
			</Button>
			<input
				id={inputId}
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				className={S.Input}
				value={draft}
				disabled={disabled}
				onChange={handleInputChange}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				onClick={handleIncrement}
				disabled={disabled || isAtMax}
				aria-label={incrementLabel}
			>
				+
			</Button>
			<output aria-live="polite" aria-atomic="true" className={S.VisuallyHidden}>
				{announcement}
			</output>
		</div>
	);
}

export const NumberStepper = forwardRef(NumberStepperInner);
NumberStepper.displayName = 'NumberStepper';
