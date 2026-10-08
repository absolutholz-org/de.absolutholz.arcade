import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { Timer } from '@arcade/lib-ui/components/Timer';
import * as S from './VictoryDialog.styles';
import type { VictoryDialogProps } from './VictoryDialog.types';

export function VictoryDialog({
	isOpen,
	elapsedSeconds,
	difficulty,
	isNewBestTime,
	onPlayAgain,
	onClose,
}: VictoryDialogProps) {
	const { t, language } = useI18n('sudoku');

	return (
		<Dialog
			isOpen={isOpen}
			onCancel={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			showCloseButton={true}
		>
			<S.VictoryContent>
				<S.TimeCard>
					<span data-slot="label">{t('status.time')}</span>
					<Timer seconds={elapsedSeconds} size="lg" showIcon={false} />
				</S.TimeCard>

				{isNewBestTime && <S.BestTimeBadge>{t('status.newBestTime')}</S.BestTimeBadge>}

				<S.Actions>
					<Button onClick={onPlayAgain} variant="primary" size="md">
						{t('victory.playAgain')}
					</Button>
					<a href={`/sudoku/${language}/stats`}>{t('stats.title')}</a>
					<a href={`/sudoku/${language}/`}>{t('controls.backToLobby')}</a>
				</S.Actions>
			</S.VictoryContent>
		</Dialog>
	);
}
