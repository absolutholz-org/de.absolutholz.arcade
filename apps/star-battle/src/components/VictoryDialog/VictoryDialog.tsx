import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { JSX } from 'react';
import type { VictoryDialogProps } from './VictoryDialog.types';

export function VictoryDialog({
	isOpen,
	elapsedSeconds,
	isNewBestTime,
	hasNextPuzzle = false,
	onNextPuzzle,
	onPlayAgain,
	onClose,
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('star-battle');

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
			hasNextPuzzle={hasNextPuzzle}
			onNextPuzzle={onNextPuzzle}
			nextPuzzleLabel={t('victory.nextLevel')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			statsHref={`/star-battle/${language}/stats`}
			medalsHref={`/star-battle/${language}/medals`}
			lobbyHref={`/star-battle/${language}/`}
			lobbyLabel={t('controls.backToLobby')}
		/>
	);
}
