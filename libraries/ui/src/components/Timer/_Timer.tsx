import { Icon } from '../Icon';
import { formatDurationIso, formatTime } from './_Timer.functions';
import * as S from './_Timer.styles';
import type { TimerProps } from './_Timer.types';

/**
 * Timer component renders a semantic `<time>` element with tabular numeric
 * formatting, size presets, optional icon, and pause indicator styling.
 */
export function Timer({
	seconds,
	size = 'md',
	format = 'auto',
	showIcon = true,
	isPaused = false,
	className,
	'aria-label': ariaLabel,
	id,
}: TimerProps) {
	const formattedTime = formatTime(seconds, format);
	const durationIso = formatDurationIso(seconds);
	const iconSize = size === 'lg' ? 'md' : 'sm';

	return (
		<S.Timer
			id={id}
			dateTime={durationIso}
			className={className}
			data-size={size}
			data-paused={isPaused ? 'true' : undefined}
			aria-label={ariaLabel}
		>
			{showIcon && (
				<span data-slot="icon">
					<Icon name="timer" size={iconSize} />
				</span>
			)}
			<span data-slot="digits">{formattedTime}</span>
		</S.Timer>
	);
}
