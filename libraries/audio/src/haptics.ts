import { isHapticsEnabled } from './settings-bridge';

export type HapticType = 'light' | 'medium' | 'success' | 'warning';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
	light: 12,
	medium: 22,
	success: [30, 40, 50, 40, 80],
	warning: [40, 60, 40],
};

/**
 * Triggers haptic vibration if supported by device and enabled in user settings.
 * Returns true if vibration pattern was dispatched to navigator.vibrate, false otherwise.
 */
export function triggerHaptic(type: HapticType = 'light'): boolean {
	if (!isHapticsEnabled()) {
		return false;
	}

	if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
		return false;
	}

	try {
		const pattern = HAPTIC_PATTERNS[type] ?? 12;
		return navigator.vibrate(pattern);
	} catch {
		return false;
	}
}
