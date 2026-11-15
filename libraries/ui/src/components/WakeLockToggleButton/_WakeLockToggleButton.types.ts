export type WakeLockToggleButtonSize = 'sm' | 'md';

export interface WakeLockToggleButtonProps {
	/**
	 * Whether the user has enabled keeping the screen awake.
	 */
	enabled: boolean;
	/**
	 * Whether the Screen Wake Lock sentinel is currently active (not blocked by OS/browser).
	 */
	isActive: boolean;
	/**
	 * Whether the Screen Wake Lock API is supported by the current browser.
	 */
	isSupported: boolean;
	/**
	 * Callback invoked when the user toggles the button.
	 */
	onToggle: (nextEnabled: boolean) => void;
	/**
	 * Visual size preset.
	 * @default 'sm'
	 */
	size?: WakeLockToggleButtonSize;
	/**
	 * Optional CSS class name.
	 */
	className?: string;
}
