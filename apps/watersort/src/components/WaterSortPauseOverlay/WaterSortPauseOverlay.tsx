import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { PauseOverlay as BasePauseOverlay } from '@arcade/lib-ui/components/PauseOverlay';
import type { JSX } from 'react';

export interface WaterSortPauseOverlayProps {
	isOpen: boolean;
	onResume: () => void;
	onRestart: () => void;
}

export function WaterSortPauseOverlay({ isOpen, onResume, onRestart }: WaterSortPauseOverlayProps): JSX.Element | null {
	const { t } = useI18n('watersort');

	return (
		<BasePauseOverlay
			isOpen={isOpen}
			title={t('status.paused')}
			description={t('status.pausedDescription')}
			resumeLabel={t('controls.resume')}
			restartLabel={t('controls.restart')}
			onResume={onResume}
			onRestart={onRestart}
		/>
	);
}
