import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Stack } from '@arcade/lib-ui/components/Stack';
import * as S from './PauseOverlay.styles';
import type { PauseOverlayProps } from './PauseOverlay.types';

export function PauseOverlay({ isOpen, onResume, onRestart }: PauseOverlayProps) {
	const { t } = useI18n('sudoku');

	if (!isOpen) return null;

	return (
		// biome-ignore lint/a11y/useSemanticElements: In-game modal overlay obscuring canvas during pause
		<S.OverlayBackdrop role="dialog" aria-modal="true" aria-label={t('status.paused')}>
			<S.OverlayCard>
				<Stack direction="column" spacing="xl" align="center" fullWidth>
					<Stack direction="column" spacing="xs" align="center">
						<h2>{t('status.paused')}</h2>
						<p>{t('status.pausedDescription')}</p>
					</Stack>

					<Stack direction="column" spacing="md" fullWidth>
						<Button onClick={onResume} variant="primary" size="md">
							{t('controls.resume')}
						</Button>
						<Button onClick={onRestart} variant="secondary" size="md">
							{t('controls.restart')}
						</Button>
					</Stack>
				</Stack>
			</S.OverlayCard>
		</S.OverlayBackdrop>
	);
}
