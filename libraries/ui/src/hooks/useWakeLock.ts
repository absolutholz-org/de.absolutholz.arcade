import { useCallback, useEffect, useRef, useState } from 'react';

export const DEFAULT_WAKE_LOCK_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

export interface UseWakeLockOptions {
	/**
	 * Whether the screen wake lock should be held.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * Optional inactivity timeout in milliseconds after which the wake lock is released
	 * until the next `pointerdown` or `keydown` interaction. Set to `0` to disable.
	 * @default 900000 (15 minutes)
	 */
	inactivityTimeoutMs?: number;
}

export interface UseWakeLockReturn {
	isSupported: boolean;
	isActive: boolean;
}

/**
 * Acquires and manages a Screen Wake Lock (`navigator.wakeLock`) while `enabled` is true.
 * Handles tab visibility re-acquisition, inactivity release, and clean unmount teardown.
 */
export function useWakeLock(options: boolean | UseWakeLockOptions = true): UseWakeLockReturn {
	const enabled = typeof options === 'boolean' ? options : (options.enabled ?? true);
	const inactivityTimeoutMs =
		typeof options === 'boolean'
			? DEFAULT_WAKE_LOCK_INACTIVITY_TIMEOUT_MS
			: (options.inactivityTimeoutMs ?? DEFAULT_WAKE_LOCK_INACTIVITY_TIMEOUT_MS);

	const [isActive, setIsActive] = useState<boolean>(false);
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const sentinelRef = useRef<WakeLockSentinel | null>(null);
	const enabledRef = useRef<boolean>(enabled);
	const isTimedOutRef = useRef<boolean>(false);
	const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	enabledRef.current = enabled;

	const releaseLock = useCallback(async () => {
		const current = sentinelRef.current;
		sentinelRef.current = null;
		setIsActive(false);
		if (current) {
			try {
				await current.release();
			} catch {
				// Ignore errors if the sentinel was already released by the UA
			}
		}
	}, []);

	const requestLock = useCallback(async () => {
		if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
			return;
		}
		if (!enabledRef.current || isTimedOutRef.current) {
			return;
		}
		if (sentinelRef.current && !sentinelRef.current.released) {
			return;
		}

		try {
			const lock = await navigator.wakeLock.request('screen');
			// If disabled or timed out while the async request was in flight, release immediately
			if (!enabledRef.current || isTimedOutRef.current) {
				try {
					await lock.release();
				} catch {
					// Ignore release errors
				}
				return;
			}

			sentinelRef.current = lock;
			setIsActive(true);

			const handleRelease = () => {
				if (sentinelRef.current === lock) {
					sentinelRef.current = null;
				}
				setIsActive(false);
			};

			lock.addEventListener('release', handleRelease);
		} catch {
			setIsActive(false);
		}
	}, []);

	useEffect(() => {
		if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
			setIsSupported(true);
		}
	}, []);

	useEffect(() => {
		if (!enabled || !isSupported) {
			isTimedOutRef.current = false;
			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
				inactivityTimerRef.current = null;
			}
			void releaseLock();
			return;
		}

		isTimedOutRef.current = false;
		void requestLock();

		const resetInactivityTimer = () => {
			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
				inactivityTimerRef.current = null;
			}

			if (inactivityTimeoutMs > 0) {
				inactivityTimerRef.current = setTimeout(() => {
					isTimedOutRef.current = true;
					void releaseLock();
				}, inactivityTimeoutMs);
			}
		};

		const handleUserActivity = () => {
			const wasTimedOut = isTimedOutRef.current;
			isTimedOutRef.current = false;
			resetInactivityTimer();
			if (wasTimedOut && document.visibilityState === 'visible') {
				void requestLock();
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && enabledRef.current && !isTimedOutRef.current) {
				void requestLock();
			}
		};

		resetInactivityTimer();
		document.addEventListener('visibilitychange', handleVisibilityChange);
		if (inactivityTimeoutMs > 0 && typeof window !== 'undefined') {
			window.addEventListener('pointerdown', handleUserActivity, { passive: true });
			window.addEventListener('keydown', handleUserActivity, { passive: true });
		}

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			if (typeof window !== 'undefined') {
				window.removeEventListener('pointerdown', handleUserActivity);
				window.removeEventListener('keydown', handleUserActivity);
			}
			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
				inactivityTimerRef.current = null;
			}
			void releaseLock();
		};
	}, [enabled, isSupported, inactivityTimeoutMs, requestLock, releaseLock]);

	return { isSupported, isActive };
}
