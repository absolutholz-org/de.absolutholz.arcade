import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { Icon } from '../Icon';
import * as S from './_WakeLockToggleButton.styles';
import type { WakeLockToggleButtonProps } from './_WakeLockToggleButton.types';

/**
 * Compact, accessible toggle button (`aria-pressed`) for controlling Screen Wake Lock in tools.
 * Renders only when `isSupported` is true and visually distinguishes active, OS-blocked, and off states.
 */
export function WakeLockToggleButton({
	enabled,
	isActive,
	isSupported,
	onToggle,
	size = 'sm',
	className,
}: WakeLockToggleButtonProps): JSX.Element | null {
	const { t } = useI18n('common');

	if (!isSupported) {
		return null;
	}

	const visualState = enabled ? (isActive ? 'active' : 'blocked') : 'off';
	const statusText = enabled && isActive ? t('wakeLock.wakeLockActive') : t('wakeLock.wakeLockInactive');
	const label = `${t('wakeLock.keepScreenOn')} (${statusText})`;
	const iconName = enabled && isActive ? 'lightbulb-filled' : 'lightbulb';

	return (
		<S.WakeLockToggleButton
			type="button"
			aria-pressed={enabled}
			aria-label={label}
			title={label}
			data-size={size}
			data-state={visualState}
			className={className}
			onClick={() => onToggle(!enabled)}
		>
			<Icon name={iconName} size="sm" />
			<span>{enabled && !isActive ? t('wakeLock.wakeLockInactive') : t('wakeLock.keepScreenOn')}</span>
		</S.WakeLockToggleButton>
	);
}
