import type { ReactNode } from 'react';
import type { GAME_STATUS_STATES } from './_GameStatusStrip.constants';

export type GameStatusState = (typeof GAME_STATUS_STATES)[number];

export interface GameStatusStripProps {
	/**
	 * Primary status text or metric summary displayed above the gameboard.
	 */
	statusText?: ReactNode;
	/**
	 * Visual semantic state applied to the status metric text.
	 */
	statusState?: GameStatusState;
	/**
	 * Accessible label for the status metric when it differs from visible text.
	 */
	statusAriaLabel?: string;
	/**
	 * Elapsed play time in seconds. When provided (and `hideTimer` is false), renders an inline Timer.
	 */
	elapsedSeconds?: number;
	/**
	 * Whether the active game timer is paused.
	 */
	isPaused?: boolean;
	/**
	 * Callback invoked when the user clicks the inline timer pause/resume button.
	 */
	onTogglePause?: () => void;
	/**
	 * Accessible label for the inline timer.
	 */
	timerAriaLabel?: string;
	/**
	 * Hides the timer (e.g. when casual/untimed mode is enabled).
	 */
	hideTimer?: boolean;
	/**
	 * Custom timer node override if a custom timer element is required.
	 */
	timer?: ReactNode;
	/**
	 * Additional status items rendered inside the strip.
	 */
	children?: ReactNode;
	/**
	 * Optional CSS class name.
	 */
	className?: string;
}
