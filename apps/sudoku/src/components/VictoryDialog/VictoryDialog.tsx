import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { VictoryDialogProps } from './VictoryDialog.types';

export function VictoryDialog({ isOpen, elapsedSeconds, isNewBestTime, onPlayAgain, onClose }: VictoryDialogProps) {
	const { t, language } = useI18n('sudoku');
	const { t: tCommon } = useI18n('common');

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
			lobbyHref={`/sudoku/${language}/`}
			lobbyLabel={t('controls.backToLobby')}
			secondaryActions={
				<>
					<a href={`/sudoku/${language}/stats`}>{t('stats.title')}</a>
					<a href={`/sudoku/${language}/medals`}>🏅 {tCommon('navigation.medals')}</a>
				</>
			}
		/>
	);
}
