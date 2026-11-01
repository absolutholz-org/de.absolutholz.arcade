import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseShakeToRollOptions {
	/** Callback invoked when a shake gesture is detected. */
	onShake: () => void;
	/** Whether shake-to-roll detection is active. Defaults to true. */
	enabled?: boolean;
	/** Acceleration delta threshold in m/s² to trigger a roll. Defaults to 18. */
	threshold?: number;
	/** Minimum milliseconds between consecutive shake triggers. Defaults to 800ms. */
	cooldownMs?: number;
	/** Whether to trigger subtle haptic vibration on roll. Defaults to true. */
	enableHaptics?: boolean;
}

export interface UseShakeToRollResult {
	/** Whether device motion sensors are supported in this browser. */
	isSupported: boolean;
	/** Whether explicit iOS/Safari permission is required. */
	needsPermission: boolean;
	/** Whether motion permission has been granted. */
	isPermissionGranted: boolean;
	/** Requests device motion permission (required by iOS Safari on user interaction). */
	requestPermission: () => Promise<boolean>;
	/** Triggers subtle device haptic vibration if supported. */
	triggerHaptics: () => void;
}

const DEFAULT_THRESHOLD = 18;
const DEFAULT_COOLDOWN_MS = 800;
const HAPTIC_ROLL_PATTERN = [30, 20, 50];

/**
 * Hook detecting tabletop physical shake-to-roll gestures using the DeviceMotion API,
 * with iOS permission handling and haptic vibration feedback.
 */
export function useShakeToRoll({
	onShake,
	enabled = true,
	threshold = DEFAULT_THRESHOLD,
	cooldownMs = DEFAULT_COOLDOWN_MS,
	enableHaptics = true,
}: UseShakeToRollOptions): UseShakeToRollResult {
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const [needsPermission, setNeedsPermission] = useState<boolean>(false);
	const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

	const lastX = useRef<number | null>(null);
	const lastY = useRef<number | null>(null);
	const lastZ = useRef<number | null>(null);
	const lastTriggerTime = useRef<number>(0);
	const onShakeRef = useRef(onShake);
	onShakeRef.current = onShake;

	const triggerHaptics = useCallback(() => {
		if (!enableHaptics) {
			return;
		}
		try {
			if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
				navigator.vibrate(HAPTIC_ROLL_PATTERN);
			}
		} catch {
			// Ignore vibration errors on unsupported or battery-restricted devices
		}
	}, [enableHaptics]);

	// Detect sensor capability and iOS permission requirement
	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const hasMotionSupport = 'DeviceMotionEvent' in window;
		setIsSupported(hasMotionSupport);

		if (!hasMotionSupport) {
			return;
		}

		const motionClass = window.DeviceMotionEvent as unknown as {
			requestPermission?: () => Promise<'granted' | 'denied'>;
		};

		if (typeof motionClass.requestPermission === 'function') {
			setNeedsPermission(true);
			setIsPermissionGranted(false);
		} else {
			setNeedsPermission(false);
			setIsPermissionGranted(true);
		}
	}, []);

	const requestPermission = useCallback(async (): Promise<boolean> => {
		if (typeof window === 'undefined') {
			return false;
		}

		const motionClass = window.DeviceMotionEvent as unknown as {
			requestPermission?: () => Promise<'granted' | 'denied'>;
		};

		if (typeof motionClass.requestPermission === 'function') {
			try {
				const response = await motionClass.requestPermission();
				const granted = response === 'granted';
				setIsPermissionGranted(granted);
				return granted;
			} catch {
				setIsPermissionGranted(false);
				return false;
			}
		}

		setIsPermissionGranted(true);
		return true;
	}, []);

	// Attach devicemotion listener when active and granted
	useEffect(() => {
		if (!enabled || !isSupported || !isPermissionGranted || typeof window === 'undefined') {
			return;
		}

		const handleMotion = (event: DeviceMotionEvent) => {
			const currentAcc = event.acceleration ?? event.accelerationIncludingGravity;
			if (!currentAcc) {
				return;
			}

			const x = currentAcc.x ?? 0;
			const y = currentAcc.y ?? 0;
			const z = currentAcc.z ?? 0;

			if (lastX.current === null || lastY.current === null || lastZ.current === null) {
				lastX.current = x;
				lastY.current = y;
				lastZ.current = z;
				return;
			}

			const deltaX = Math.abs(x - lastX.current);
			const deltaY = Math.abs(y - lastY.current);
			const deltaZ = Math.abs(z - lastZ.current);
			const deltaTotal = deltaX + deltaY + deltaZ;

			lastX.current = x;
			lastY.current = y;
			lastZ.current = z;

			const now = Date.now();
			if (deltaTotal > threshold && now - lastTriggerTime.current > cooldownMs) {
				lastTriggerTime.current = now;
				triggerHaptics();
				onShakeRef.current();
			}
		};

		window.addEventListener('devicemotion', handleMotion, { passive: true });

		return () => {
			window.removeEventListener('devicemotion', handleMotion);
			lastX.current = null;
			lastY.current = null;
			lastZ.current = null;
		};
	}, [enabled, isSupported, isPermissionGranted, threshold, cooldownMs, triggerHaptics]);

	return {
		isSupported,
		needsPermission,
		isPermissionGranted,
		requestPermission,
		triggerHaptics,
	};
}
