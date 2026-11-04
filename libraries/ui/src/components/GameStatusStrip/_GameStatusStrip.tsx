import { Timer } from '../Timer';
import * as S from './_GameStatusStrip.styles';
import type { GameStatusStripProps } from './_GameStatusStrip.types';

/**
 * Standardized status bar organism rendered above the gameboard inside `GameLayout`'s `status` slot.
 * Combines board-level status metrics with the inline game timer and respects light/dark color schemes.
 */
export function GameStatusStrip({
	statusText,
	statusState = 'default',
	statusAriaLabel,
	elapsedSeconds,
	isPaused = false,
	onTogglePause,
	timerAriaLabel,
	hideTimer = false,
	timer,
	children,
	className,
}: GameStatusStripProps) {
	const shouldRenderTimer = !hideTimer && (timer !== undefined || elapsedSeconds !== undefined);

	return (
		<S.GameStatusStrip className={className}>
			{statusText !== undefined && statusText !== null && (
				<span className="game-status-metric" data-state={statusState} aria-label={statusAriaLabel}>
					<span>{statusText}</span>
				</span>
			)}

			{children}

			{shouldRenderTimer &&
				(timer ?? (
					<Timer
						variant="inline"
						seconds={elapsedSeconds ?? 0}
						isPaused={isPaused}
						onTogglePause={onTogglePause}
						size="sm"
						showIcon={true}
						aria-label={timerAriaLabel}
					/>
				))}
		</S.GameStatusStrip>
	);
}
