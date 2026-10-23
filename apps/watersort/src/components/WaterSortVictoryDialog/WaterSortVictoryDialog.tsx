import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { JSX } from 'react';

export interface WaterSortVictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	moves: number;
	isNewBestTime?: boolean;
	onPlayAgain: () => void;
	onNextPuzzle: () => void;
	onClose?: () => void;
	difficulty?: string;
}

export function WaterSortVictoryDialog({
	isOpen,
	elapsedSeconds,
	moves,
	isNewBestTime,
	onPlayAgain,
	onNextPuzzle,
	onClose,
	difficulty = 'easy',
}: WaterSortVictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('watersort');

	const lobbyHref = `/watersort/${language}/?difficulty=${difficulty}`;

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose ?? onPlayAgain}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			elapsedSeconds={elapsedSeconds}
			timeLabel={t('status.time')}
			movesCount={moves}
			movesLabel={t('status.moves', { count: '' }).replace(':', '').trim()}
			isNewBestTime={Boolean(isNewBestTime)}
			bestTimeText={t('status.newBestTime')}
			hasNextPuzzle={true}
			onNextPuzzle={onNextPuzzle}
			nextPuzzleLabel={t('victory.nextLevel')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			lobbyHref={lobbyHref}
			lobbyLabel={t('controls.backToLobby')}
		/>
	);
}
