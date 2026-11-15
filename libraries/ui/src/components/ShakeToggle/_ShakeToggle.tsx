import { type JSX, useState } from 'react';
import { useShake } from '../../hooks/useShake';
import { Icon } from '../Icon';
import * as S from './_ShakeToggle.styles';
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
			<S.ShakeToggle
				type="button"
				aria-pressed={false}
				aria-label={enableLabel}
				title={enableLabel}
				data-state="off"
				onClick={() => void requestPermission()}
			>
				<Icon name="smartphone" size="sm" />
				<span>{enableLabel}</span>
			</S.ShakeToggle>
		);
	}

	const label = isShakeActive ? enabledLabel : disabledLabel;

	return (
		<S.ShakeToggle
			type="button"
			aria-pressed={isShakeActive}
			aria-label={label}
			title={label}
			data-state={isShakeActive ? 'active' : 'off'}
			onClick={() => setIsShakeActive((prev) => !prev)}
		>
			<Icon name={isShakeActive ? 'smartphone-filled' : 'smartphone'} size="sm" />
			<span>{label}</span>
		</S.ShakeToggle>
	);
}
