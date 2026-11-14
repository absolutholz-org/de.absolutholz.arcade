import { useCallback, useEffect, useRef, useState } from 'react';

export function useWakeLock(enabled = true) {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const sentinelRef = useRef<WakeLockSentinel | null>(null);

	const requestLock = useCallback(async () => {
		if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
			return;
		}
		try {
			const lock = await navigator.wakeLock.request('screen');
			sentinelRef.current = lock;
			setIsActive(true);
			lock.addEventListener('release', () => {
				setIsActive(false);
				sentinelRef.current = null;
			});
		} catch {
			setIsActive(false);
		}
	}, []);

	const releaseLock = useCallback(async () => {
		if (sentinelRef.current) {
			try {
				await sentinelRef.current.release();
			} catch {}
			sentinelRef.current = null;
			setIsActive(false);
		}
	}, []);

	useEffect(() => {
		if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
			setIsSupported(true);
		}
	}, []);

	useEffect(() => {
		if (!enabled || !isSupported) return;

		void requestLock();

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && enabled) {
				void requestLock();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			void releaseLock();
		};
	}, [enabled, isSupported, requestLock, releaseLock]);

	return { isSupported, isActive };
}
