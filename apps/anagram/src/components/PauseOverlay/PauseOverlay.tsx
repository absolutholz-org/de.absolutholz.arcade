import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { PauseOverlay as SharedPauseOverlay } from '@arcade/lib-ui/components/PauseOverlay';
import type { JSX } from 'react';
import type { PauseOverlayProps } from './PauseOverlay.types.js';

export function PauseOverlay({ isOpen, onResume, onRestart }: PauseOverlayProps): JSX.Element | null {
	const { t } = useI18n('anagram');

	return (
		<SharedPauseOverlay
			isOpen={isOpen}
			title={t('pause.title')}
			description={t('pause.description')}
			resumeLabel={t('controls.resume')}
			restartLabel={t('controls.newRound')}
			onResume={onResume}
			onRestart={onRestart}
		/>
	);
}
