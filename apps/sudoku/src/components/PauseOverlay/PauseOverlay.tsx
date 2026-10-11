import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { PauseOverlay as BasePauseOverlay } from '@arcade/lib-ui/components/PauseOverlay';
import type { PauseOverlayProps } from './PauseOverlay.types';

export function PauseOverlay({ isOpen, onResume, onRestart }: PauseOverlayProps) {
	const { t } = useI18n('sudoku');

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
