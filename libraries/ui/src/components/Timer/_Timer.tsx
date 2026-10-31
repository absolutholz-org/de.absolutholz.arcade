import { Icon } from '../Icon';
import { formatDurationIso, formatTime } from './_Timer.functions';
import * as S from './_Timer.styles';
import type { TimerProps } from './_Timer.types';

/**
 * Interactive Timer component rendering a semantic `<button type="button">` pill
 * that displays elapsed time and doubles as a pause/resume toggle control.
 */
export function Timer({
	seconds,
	isPaused = false,
	onTogglePause,
	variant = 'pill',
	size = 'md',
	format = 'auto',
	showIcon = true,
	disabled = false,
	announceOnToggle = false,
	className,
	'aria-label': customAriaLabel,
	id,
	...buttonProps
}: TimerProps) {
	const formattedTime = formatTime(seconds, format);
	const durationIso = formatDurationIso(seconds);
	const iconSize = size === 'lg' ? 'md' : 'sm';
	const isInteractive = Boolean(onTogglePause);

	const dynamicAriaLabel = isInteractive
		? isPaused
			? `Resume. Paused at ${formattedTime}`
			: `Pause. Elapsed time: ${formattedTime}`
		: `Elapsed time: ${formattedTime}`;

	return (
		<S.TimerButton
			id={id}
			type="button"
			onClick={onTogglePause}
			disabled={disabled}
			className={className}
			data-variant={variant}
			data-size={size}
			data-interactive={isInteractive ? 'true' : 'false'}
			data-paused={isPaused ? 'true' : undefined}
			aria-label={customAriaLabel ?? dynamicAriaLabel}
			{...buttonProps}
		>
			{showIcon && (
				<span data-slot="leading-icon" aria-hidden="true">
					<Icon name="timer" size={iconSize} />
				</span>
			)}

			<span data-slot="digits">
				<time dateTime={durationIso}>{formattedTime}</time>
			</span>

			{isInteractive && (
				<span data-slot="action-icon" aria-hidden="true">
					<Icon name={isPaused ? 'play' : 'pause'} size={iconSize} />
				</span>
			)}

			{announceOnToggle && (
				<span data-slot="announcement" aria-live="polite" className="visually-hidden">
					{isPaused ? `Timer paused at ${formattedTime}` : 'Timer resumed'}
				</span>
			)}
		</S.TimerButton>
	);
}
