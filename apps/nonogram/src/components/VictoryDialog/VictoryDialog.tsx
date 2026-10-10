import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { formatTime } from '@arcade/lib-ui/components/Timer';
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
		<Dialog
			isOpen={isOpen}
			onCancel={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			showCloseButton={true}
		>
			<S.VictoryContent>
				{/* Pixel Art Reveal */}
				<S.PixelArtPreview style={previewVars} aria-hidden="true">
					{puzzle.grid.map((val, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static victory pixel art preview grid
						<div key={`pixel-preview-${idx}`} data-filled={val === 1} />
					))}
				</S.PixelArtPreview>

				<S.PuzzleTitle>{title}</S.PuzzleTitle>

				{isNewBestTime && <S.BestNotice>{t('status.newBestTime')}</S.BestNotice>}

				<S.StatsGrid>
					<S.StatCard>
						<span>{t('status.time')}</span>
						<span>{formatTime(elapsedSeconds)}</span>
					</S.StatCard>
					<S.StatCard>
						<span>{t('status.moves')}</span>
						<span>{moves}</span>
					</S.StatCard>
				</S.StatsGrid>

				<S.Actions>
					{hasNextPuzzle && (
						<Button onClick={onNextPuzzle} variant="primary" size="md">
							{t('victory.nextPuzzle')}
						</Button>
					)}
					<Button onClick={onPlayAgain} variant={hasNextPuzzle ? 'secondary' : 'primary'} size="md">
						{t('victory.playAgain')}
					</Button>
					<Button onClick={onOpenPuzzleSelect} variant="ghost" size="sm">
						{t('victory.puzzleSelect')}
					</Button>
					<a href={`/nonogram/${language}/`}>{t('victory.viewLobby')}</a>
				</S.Actions>
			</S.VictoryContent>
		</Dialog>
	);
}
