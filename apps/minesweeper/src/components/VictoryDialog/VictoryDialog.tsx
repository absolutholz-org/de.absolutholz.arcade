import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { JSX } from 'react';
import type { BoardSizeId, DifficultyId } from '../../engine/types';

export interface VictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	size: BoardSizeId;
	difficulty: DifficultyId;
	rankPosition: number;
	onPlayAgain: () => void;
	onClose: () => void;
}

export function VictoryDialog({
	isOpen,
	elapsedSeconds,
	size,
	difficulty,
	rankPosition,
	onPlayAgain,
	onClose,
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('minesweeper');

	let rankText = '';
	if (rankPosition === 0) {
		rankText = t('victory.rankFirst');
	} else if (rankPosition > 0 && rankPosition < 10) {
		rankText = t('victory.rankOrdinal', { rank: rankPosition + 1 });
	} else if (rankPosition >= 10) {
		rankText = t('victory.notTopTen');
	}

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			elapsedSeconds={elapsedSeconds}
			timeLabel={t('status.time')}
			isNewBestTime={Boolean(rankText)}
			bestTimeText={rankText}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			lobbyHref={`/minesweeper/${language}/`}
			lobbyLabel={t('controls.newGame')}
			secondaryActions={
				<a
					href={`/minesweeper/${language}/high-scores?size=${size}&difficulty=${difficulty}&highlight=${rankPosition}`}
				>
					{t('victory.viewHighScores')}
				</a>
			}
		/>
	);
}
