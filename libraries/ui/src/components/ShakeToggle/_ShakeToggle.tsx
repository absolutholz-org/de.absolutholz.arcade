import { useState } from 'react';
import { useShake } from '../../hooks/useShake';
import { Button } from '../Button';
import type { ShakeToggleProps } from './_ShakeToggle.types';

/**
 * Shared toggle button for shake-to-trigger gestures on motion-capable mobile/tablet devices.
 */
export function ShakeToggle({
	onShake,
	enableLabel,
	enabledLabel,
	disabledLabel,
	threshold = 16,
	cooldownMs = 800,
	enableHaptics = true,
	defaultEnabled = true,
}: ShakeToggleProps): JSX.Element | null {
	const [isShakeActive, setIsShakeActive] = useState<boolean>(defaultEnabled);

	const { isSupported, needsPermission, isPermissionGranted, requestPermission } = useShake({
		onShake,
		threshold,
		cooldownMs,
		enableHaptics,
		enabled: isShakeActive,
	});

	if (!isSupported) {
		return null;
	}

	if (needsPermission && !isPermissionGranted) {
		return (
			<Button size="sm" variant="secondary" onClick={() => void requestPermission()}>
				📱 {enableLabel}
			</Button>
		);
	}

	return (
		<Button
			size="sm"
			variant={isShakeActive ? 'secondary' : 'outline'}
			onClick={() => setIsShakeActive((prev) => !prev)}
			aria-pressed={isShakeActive}
			title={isShakeActive ? enabledLabel : disabledLabel}
		>
			📱 {isShakeActive ? enabledLabel : disabledLabel}
		</Button>
	);
}
