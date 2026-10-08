import type { ComponentPropsWithoutRef } from 'react';
import type { TIMER_FORMATS, TIMER_SIZES } from './_Timer.constants';

export type TimerSize = (typeof TIMER_SIZES)[number];
export type TimerFormat = (typeof TIMER_FORMATS)[number];

export interface TimerProps extends Omit<ComponentPropsWithoutRef<'time'>, 'style' | 'children'> {
	/**
	 * Elapsed time in seconds to display.
	 */
	seconds: number;

	/**
	 * Visual sizing preset.
	 * @default 'md'
	 */
	size?: TimerSize;

	/**
	 * Time formatting structure.
	 * - 'auto': Renders mm:ss unless hours >= 1, then hh:mm:ss.
	 * - 'mm:ss': Always renders minutes and seconds (e.g. 75:12).
	 * - 'hh:mm:ss': Always renders hours, minutes, and seconds.
	 * @default 'auto'
	 */
	format?: TimerFormat;

	/**
	 * Whether to render the leading timer/clock icon.
	 * @default true
	 */
	showIcon?: boolean;

	/**
	 * Indicates whether the timer is currently paused.
	 * When true, applies a visual paused indicator.
	 * @default false
	 */
	isPaused?: boolean;
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
