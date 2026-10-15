import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { VictoryDialog as SharedVictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import type { CSSProperties, JSX } from 'react';
import type { NonogramPuzzle } from '../../engine/types';
import * as S from './VictoryDialog.styles';

export interface VictoryDialogProps {
	isOpen: boolean;
	puzzle: NonogramPuzzle;
	elapsedSeconds: number;
	moves: number;
	isNewBestTime: boolean;
	hasNextPuzzle: boolean;
	onPlayAgain: () => void;
	onNextPuzzle: () => void;
	onOpenPuzzleSelect: () => void;
	onClose: () => void;
}

export function VictoryDialog({
	isOpen,
	puzzle,
	elapsedSeconds,
	moves,
	isNewBestTime,
	hasNextPuzzle,
	onPlayAgain,
	onNextPuzzle,
	onOpenPuzzleSelect,
	onClose,
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('nonogram');

	const title = t(puzzle.titleKey as TranslationKey);

	const previewVars: CSSProperties = {
		'--preview-cols': puzzle.width,
		'--preview-rows': puzzle.height,
		'--art-color': puzzle.color,
	} as CSSProperties;

	return (
		<SharedVictoryDialog
			isOpen={isOpen}
			onClose={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			elapsedSeconds={elapsedSeconds}
			timeLabel={t('status.time')}
			movesCount={moves}
			movesLabel={t('status.moves')}
			isNewBestTime={isNewBestTime}
			bestTimeText={t('status.newBestTime')}
			hasNextPuzzle={hasNextPuzzle}
			onNextPuzzle={onNextPuzzle}
			nextPuzzleLabel={t('victory.nextPuzzle')}
			onPlayAgain={onPlayAgain}
			playAgainLabel={t('victory.playAgain')}
			lobbyHref={`/nonogram/${language}/`}
			lobbyLabel={t('victory.viewLobby')}
			secondaryActions={
				<button type="button" onClick={onOpenPuzzleSelect}>
					{t('victory.puzzleSelect')}
				</button>
			}
		>
			<S.PixelArtPreview style={previewVars} aria-hidden="true">
				{puzzle.grid.map((val, idx) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Static victory pixel art preview grid
					<div key={`pixel-preview-${idx}`} data-filled={val === 1} />
				))}
			</S.PixelArtPreview>

			<S.PuzzleTitle>{title}</S.PuzzleTitle>
		</SharedVictoryDialog>
	);
}
