export interface ShakeToggleProps {
	/** Callback invoked when a shake gesture is detected. */
	onShake: () => void;
	/** Label shown when iOS/Safari permission is required. */
	enableLabel: string;
	/** Label shown when shake detection is active. */
	enabledLabel: string;
	/** Label shown when shake detection is paused. */
	disabledLabel: string;
	/** Acceleration delta threshold in m/s². Defaults to 16. */
	threshold?: number;
	/** Minimum milliseconds between consecutive triggers. Defaults to 800. */
	cooldownMs?: number;
	/** Whether to trigger haptic feedback on shake. Defaults to true. */
	enableHaptics?: boolean;
	/** Whether shake detection starts enabled. Defaults to true. */
	defaultEnabled?: boolean;
}
