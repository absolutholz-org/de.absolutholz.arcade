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
	const { t, language } = useI18n('queens');
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
			hasNextPuzzle={hasNextPuzzle}
			onNextPuzzle={onNextPuzzle}
			nextPuzzleLabel={t('victory.nextLevel')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			lobbyHref={`/queens/${language}/`}
			lobbyLabel={t('controls.backToLobby')}
			secondaryActions={<a href={`/queens/${language}/medals`}>🏅 {tCommon('navigation.medals')}</a>}
		/>
	);
}
