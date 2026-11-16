import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { VictoryDialogProps } from './VictoryDialog.types';

export function VictoryDialog({ isOpen, elapsedSeconds, isNewBestTime, onPlayAgain, onClose }: VictoryDialogProps) {
	const { t, language } = useI18n('sudoku');

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			elapsedSeconds={elapsedSeconds}
			timeLabel={t('status.time')}
			isNewBestTime={isNewBestTime}
			bestTimeText={t('status.newBestTime')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			statsHref={`/sudoku/${language}/stats`}
			medalsHref={`/sudoku/${language}/medals`}
			lobbyHref={`/sudoku/${language}/`}
			lobbyLabel={t('controls.backToLobby')}
		/>
	);
}
