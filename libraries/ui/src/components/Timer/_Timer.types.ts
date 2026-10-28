import type { ComponentPropsWithoutRef } from 'react';
import type { TIMER_FORMATS, TIMER_SIZES, TIMER_VARIANTS } from './_Timer.constants';

export type TimerSize = (typeof TIMER_SIZES)[number];
export type TimerFormat = (typeof TIMER_FORMATS)[number];
export type TimerVariant = (typeof TIMER_VARIANTS)[number];

export interface TimerProps extends Omit<ComponentPropsWithoutRef<'button'>, 'style' | 'children' | 'type'> {
	/**
	 * Visual style variant of the timer.
	 * - "pill": Rounded container button with border and background.
	 * - "inline": Unbordered inline metric matching plain text sub-bar displays.
	 * @default "pill"
	 */
	variant?: TimerVariant;

	/**
	 * Elapsed time in seconds to display.
	 */
	seconds: number;

	/**
	 * Indicates whether the timer is currently paused.
	 * Controls whether the toggle displays a pause or play action icon.
	 * @default false
	 */
	isPaused?: boolean;

	/**
	 * Callback triggered when the interactive timer button is activated (click/Enter/Space).
	 * When omitted, the timer acts as a non-interactive display.
	 */
	onTogglePause?: () => void;

	/**
	 * Visual sizing preset.
	 * @default "md"
	 */
	size?: TimerSize;

	/**
	 * Time formatting structure.
	 * - "auto": Renders mm:ss unless hours >= 1, then hh:mm:ss.
	 * - "mm:ss": Always renders minutes and seconds (e.g. 75:12).
	 * - "hh:mm:ss": Always renders hours, minutes, and seconds.
	 * @default "auto"
	 */
	format?: TimerFormat;

	/**
	 * Whether to render the leading timer/stopwatch icon.
	 * @default true
	 */
	showIcon?: boolean;

	/**
	 * Whether state toggle changes should trigger a polite live region announcement.
	 * @default false
	 */
	announceOnToggle?: boolean;

	/**
	 * Optional custom accessible label override.
	 * If omitted, dynamic labels are automatically generated based on running/paused state.
	 */
	'aria-label'?: string;
}

export interface UseTimerOptions {
	/**
	 * Initial elapsed time in seconds.
	 * @default 0
	 */
	initialSeconds?: number;

	/**
	 * Whether the timer starts running immediately.
	 * @default false
	 */
	isRunning?: boolean;

	/**
	 * Optional callback invoked on each second tick.
	 */
	onTick?: (seconds: number) => void;
}

export interface UseTimerReturn {
	/**
	 * Current elapsed seconds.
	 */
	seconds: number;

	/**
	 * Whether the timer is currently running.
	 */
	isRunning: boolean;

	/**
	 * Starts or resumes the timer.
	 */
	start: () => void;

	/**
	 * Pauses the timer without resetting elapsed seconds.
	 */
	pause: () => void;

	/**
	 * Resets the timer back to the specified value (default 0).
	 */
	reset: (newSeconds?: number) => void;

	/**
	 * Directly set elapsed seconds.
	 */
	setSeconds: (value: number | ((prev: number) => number)) => void;
}
