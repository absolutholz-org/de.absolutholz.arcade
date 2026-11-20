import { type JSX, useState } from 'react';
import { useShake } from '../../hooks/useShake';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import type { ShakeToggleProps } from './_ShakeToggle.types';

/**
 * Shared toggle button for shake-to-trigger gestures on motion-capable mobile/tablet devices.
 * Matches the pill toggle aesthetic and active/inactive icon states of WakeLockToggleButton.
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
			<Badge
				as="button"
				pressed={false}
				variant="outline"
				tone="neutral"
				size="sm"
				aria-label={enableLabel}
				title={enableLabel}
				leadingIcon={<Icon name="smartphone" size="sm" />}
				onClick={() => void requestPermission()}
			>
				{enableLabel}
			</Badge>
		);
	}

	const label = isShakeActive ? enabledLabel : disabledLabel;

	return (
		<Badge
			as="button"
			pressed={isShakeActive}
			variant={isShakeActive ? 'subtle' : 'outline'}
			tone={isShakeActive ? 'accent' : 'neutral'}
			size="sm"
			aria-label={label}
			title={label}
			leadingIcon={<Icon name={isShakeActive ? 'smartphone-filled' : 'smartphone'} size="sm" />}
			onClick={() => setIsShakeActive((prev) => !prev)}
		>
			{label}
		</Badge>
	);
}
