import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
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

	const variant = enabled ? (isActive ? 'subtle' : 'dashed') : 'outline';
	const tone = enabled && isActive ? 'accent' : 'neutral';
	const statusText = enabled && isActive ? t('wakeLock.wakeLockActive') : t('wakeLock.wakeLockInactive');
	const label = `${t('wakeLock.keepScreenOn')} (${statusText})`;
	const iconName = enabled && isActive ? 'lightbulb-filled' : 'lightbulb';

	return (
		<Badge
			as="button"
			pressed={enabled}
			variant={variant}
			tone={tone}
			size={size}
			className={className}
			aria-label={label}
			title={label}
			leadingIcon={<Icon name={iconName} size="sm" />}
			onClick={() => onToggle(!enabled)}
		>
			{enabled && !isActive ? t('wakeLock.wakeLockInactive') : t('wakeLock.keepScreenOn')}
		</Badge>
	);
}
