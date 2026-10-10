import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import type { JSX } from 'react';
import { PUZZLES_BY_DIFFICULTY } from '../../engine/puzzles';
import type { DifficultyId, NonogramPuzzle, PuzzleRecord } from '../../engine/types';
import * as S from './PuzzleSelectDialog.styles';

export interface PuzzleSelectDialogProps {
	isOpen: boolean;
	activePuzzleId: string;
	solvedRecords: Record<string, PuzzleRecord>;
	onSelectPuzzle: (puzzle: NonogramPuzzle) => void;
	onClose: () => void;
}

const DIFFICULTIES: DifficultyId[] = ['easy', 'medium', 'hard'];

export function PuzzleSelectDialog({
	isOpen,
	activePuzzleId,
	solvedRecords,
	onSelectPuzzle,
	onClose,
}: PuzzleSelectDialogProps): JSX.Element {
	const { t } = useI18n('nonogram');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('controls.puzzleSelect')} showCloseButton={true}>
			<S.ContentRoot>
				{DIFFICULTIES.map((diff) => {
					const puzzles = PUZZLES_BY_DIFFICULTY[diff];
					return (
						<S.DifficultyGroup key={diff}>
							<h4>
								{t(`difficulty.${diff}` as TranslationKey)} ({puzzles[0].width}×{puzzles[0].height})
							</h4>
							<S.PuzzlesGrid>
								{puzzles.map((puzzle) => {
									const isCurrent = puzzle.id === activePuzzleId;
									const record = solvedRecords[puzzle.id];
									const isSolved = record?.solved;

									return (
										<S.PuzzleCard
											key={puzzle.id}
											type="button"
											data-active={isCurrent}
											onClick={() => {
												onSelectPuzzle(puzzle);
												onClose();
											}}
										>
											<span className="puzzle-title">{t(puzzle.titleKey as TranslationKey)}</span>
											<span className="puzzle-badge">
												{puzzle.width}×{puzzle.height}
											</span>
											{isSolved && (
												<span className="solved-indicator">
													✓ {formatTime(record.bestTime)}
												</span>
											)}
										</S.PuzzleCard>
									);
								})}
							</S.PuzzlesGrid>
						</S.DifficultyGroup>
					);
				})}
			</S.ContentRoot>
		</Dialog>
	);
}
