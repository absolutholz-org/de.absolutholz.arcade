import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { Timer } from '@arcade/lib-ui/components/Timer';
import type { JSX } from 'react';
import type { BoardSizeId, DifficultyId } from '../../engine/types';
import * as S from './VictoryDialog.styles';

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

				{rankText ? <S.RankMessage>{rankText}</S.RankMessage> : null}

				<S.Actions>
					<Button onClick={onPlayAgain} variant="primary" size="md">
						{t('victory.playAgain')}
					</Button>
					<a
						href={`/minesweeper/${language}/high-scores?size=${size}&difficulty=${difficulty}&highlight=${rankPosition}`}
					>
						{t('victory.viewHighScores')}
					</a>
					<a href={`/minesweeper/${language}/`}>{t('controls.newGame')}</a>
				</S.Actions>
			</S.VictoryContent>
		</Dialog>
	);
}
