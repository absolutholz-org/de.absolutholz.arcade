import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseTimerOptions, UseTimerReturn } from './_Timer.types';

/**
 * Hook to manage ticking timer state with start, pause, resume, and reset controls.
 */
export function useTimer({
	initialSeconds = 0,
	isRunning: initialIsRunning = false,
	onTick,
}: UseTimerOptions = {}): UseTimerReturn {
	const [seconds, setSeconds] = useState(initialSeconds);
	const [isRunning, setIsRunning] = useState(initialIsRunning);
	const onTickRef = useRef(onTick);

	useEffect(() => {
		onTickRef.current = onTick;
	}, [onTick]);

	useEffect(() => {
		if (!isRunning) return;

		const intervalId = setInterval(() => {
			setSeconds((prev) => {
				const next = prev + 1;
				onTickRef.current?.(next);
				return next;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [isRunning]);

	const start = useCallback(() => setIsRunning(true), []);
	const pause = useCallback(() => setIsRunning(false), []);
	const reset = useCallback((newSeconds = 0) => {
		setSeconds(newSeconds);
	}, []);

	return {
		seconds,
		isRunning,
		start,
		pause,
		reset,
		setSeconds,
	};
}
