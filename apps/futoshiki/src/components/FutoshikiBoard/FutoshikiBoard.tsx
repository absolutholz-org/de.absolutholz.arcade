import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Fragment, type JSX, type KeyboardEvent, useRef } from 'react';
import type {
	ConflictResult,
	FutoshikiBoard as FutoshikiBoardModel,
	FutoshikiSettings,
	InequalitySign,
} from '../../engine/types';
import { coordKey, getCellInequalityRelations } from '../../engine/validator';
import * as S from './FutoshikiBoard.styles';

export interface FutoshikiBoardProps {
	readonly board: FutoshikiBoardModel;
	readonly activeCell: { readonly row: number; readonly col: number };
	readonly conflicts: ConflictResult;
	readonly settings: FutoshikiSettings;
	readonly isPaused: boolean;
	readonly hintedCell: { readonly row: number; readonly col: number } | null;
	readonly onSelectCell: (row: number, col: number) => void;
	readonly onDigitInput: (digit: number) => void;
	readonly onErase: () => void;
	readonly onToggleNotes: () => void;
	readonly onHint: () => void;
	readonly onUndo: () => void;
	readonly onRedo: () => void;
	readonly onTogglePause: () => void;
}

function InequalityChevron({
	orientation,
	sign,
	violated,
}: {
	readonly orientation: 'horizontal' | 'vertical';
	readonly sign: Exclude<InequalitySign, null>;
	readonly violated: boolean;
}): JSX.Element {
	let points = '';
	if (orientation === 'horizontal') {
		// '<' points left, '>' points right
		points = sign === '<' ? '15,4 7,12 15,20' : '9,4 17,12 9,20';
	} else {
		// '<' means top < bottom (∧ points up), '>' means top > bottom (∨ points down)
		points = sign === '<' ? '4,15 12,7 20,15' : '4,9 12,17 20,9';
	}

	return (
		<S.InequalitySlot aria-hidden="true" data-violated={violated ? 'true' : 'false'}>
			<S.InequalitySvg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={violated ? 3.2 : 2.6}
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				data-violated={violated ? 'true' : 'false'}
			>
				<polyline points={points} />
			</S.InequalitySvg>
		</S.InequalitySlot>
	);
}

export function FutoshikiBoard({
	board,
	activeCell,
	conflicts,
	settings,
	isPaused,
	hintedCell,
	onSelectCell,
	onDigitInput,
	onErase,
	onToggleNotes,
	onHint,
	onUndo,
	onRedo,
	onTogglePause,
}: FutoshikiBoardProps): JSX.Element {
	const { t } = useI18n('futoshiki');
	const cellRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
	const activeValue = board.cells[activeCell.row]?.[activeCell.col]?.value ?? null;

	// Move DOM focus to the active cell when navigating within the grid via keyboard
	const focusCell = (row: number, col: number) => {
		onSelectCell(row, col);
		const el = cellRefs.current.get(coordKey(row, col));
		el?.focus();
	};

	const handleCellKeyDown = (event: KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
		const { key } = event;
		const size = board.size;

		if (key === 'ArrowUp') {
			event.preventDefault();
			focusCell((row - 1 + size) % size, col);
			return;
		}
		if (key === 'ArrowDown') {
			event.preventDefault();
			focusCell((row + 1) % size, col);
			return;
		}
		if (key === 'ArrowLeft') {
			event.preventDefault();
			focusCell(row, (col - 1 + size) % size);
			return;
		}
		if (key === 'ArrowRight') {
			event.preventDefault();
			focusCell(row, (col + 1) % size);
			return;
		}

		if (key >= '1' && key <= String(size)) {
			event.preventDefault();
			onDigitInput(Number(key));
			return;
		}

		if (key === 'Backspace' || key === 'Delete' || key === '0') {
			event.preventDefault();
			onErase();
			return;
		}

		const lower = key.toLowerCase();
		if (lower === 'n') {
			event.preventDefault();
			onToggleNotes();
			return;
		}
		if (lower === 'h') {
			event.preventDefault();
			onHint();
			return;
		}
		if (lower === 'u' || (lower === 'z' && !event.shiftKey)) {
			event.preventDefault();
			onUndo();
			return;
		}
		if (lower === 'r' || lower === 'y' || (lower === 'z' && event.shiftKey)) {
			event.preventDefault();
			onRedo();
			return;
		}
		if (lower === 'p' || key === 'Escape') {
			event.preventDefault();
			onTogglePause();
		}
	};

	const buildCellAriaLabel = (row: number, col: number): string => {
		const cell = board.cells[row][col];
		const parts: string[] = [t('aria.cellCoords', { row: row + 1, col: col + 1 })];

		if (cell.value !== null) {
			parts.push(t('aria.cellValue', { value: cell.value }));
			if (cell.given) {
				parts.push(t('aria.clueCell'));
			}
		} else {
			parts.push(t('aria.emptyCell'));
			if (cell.notes.length > 0) {
				parts.push(t('aria.cellNotes', { notes: cell.notes.join(', ') }));
			}
		}

		const isDuplicate = settings.highlightErrors && conflicts.duplicateCells.has(coordKey(row, col));
		if (isDuplicate) {
			parts.push(t('aria.cellConflict'));
		}

		const rel = getCellInequalityRelations(board, row, col);
		if (rel.left === 'greater') parts.push(t('aria.greaterThanLeft'));
		if (rel.left === 'less') parts.push(t('aria.lessThanLeft'));
		if (rel.right === 'greater') parts.push(t('aria.greaterThanRight'));
		if (rel.right === 'less') parts.push(t('aria.lessThanRight'));
		if (rel.above === 'greater') parts.push(t('aria.greaterThanAbove'));
		if (rel.above === 'less') parts.push(t('aria.lessThanAbove'));
		if (rel.below === 'greater') parts.push(t('aria.greaterThanBelow'));
		if (rel.below === 'less') parts.push(t('aria.lessThanBelow'));

		return parts.join(', ');
	};

	const digits = Array.from({ length: board.size }, (_, idx) => idx + 1);

	return (
		<S.BoardFrame>
			{/* biome-ignore lint/a11y/useSemanticElements: Futoshiki is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
			<S.GridRoot
				role="grid"
				aria-label={t('aria.boardGrid', { size: board.size })}
				aria-rowcount={board.size}
				aria-colcount={board.size}
				data-size={String(board.size)}
				data-paused={isPaused ? 'true' : 'false'}
			>
				{board.cells.map((rowCells) => {
					const r = rowCells[0]?.row ?? 0;
					return (
						<Fragment key={`futoshiki-band-${r}`}>
							{/* biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern */}
							{/* biome-ignore lint/a11y/useFocusableInteractive: Row element in ARIA grid delegates focus to cell children via roving tabIndex */}
							<S.SemanticRow key={`futoshiki-row-${r}`} role="row" aria-rowindex={r + 1}>
								{rowCells.map((cell) => {
									const c = cell.col;
									const key = coordKey(r, c);
									const isSelected = activeCell.row === r && activeCell.col === c;
									const isPeer =
										settings.highlightPeerCells &&
										!isSelected &&
										(activeCell.row === r || activeCell.col === c);
									const isMatching =
										settings.highlightPeerDigits &&
										!isSelected &&
										activeValue !== null &&
										cell.value === activeValue;
									const isError = settings.highlightErrors && conflicts.duplicateCells.has(key);
									const isHinted = hintedCell?.row === r && hintedCell?.col === c;
									const hSign = c < board.size - 1 ? board.hInequalities[r][c] : null;
									const hViolated = settings.highlightErrors && conflicts.violatedHorizontal.has(key);

									return (
										<Fragment key={`futoshiki-cell-wrap-${key}`}>
											<S.CellButton
												ref={(el) => {
													cellRefs.current.set(key, el);
												}}
												type="button"
												// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
												role="gridcell"
												aria-colindex={c + 1}
												aria-selected={isSelected}
												aria-invalid={isError ? 'true' : undefined}
												aria-label={buildCellAriaLabel(r, c)}
												tabIndex={isSelected ? 0 : -1}
												data-given={cell.given ? 'true' : 'false'}
												data-selected={isSelected ? 'true' : 'false'}
												data-peer={isPeer ? 'true' : 'false'}
												data-matching={isMatching ? 'true' : 'false'}
												data-error={isError ? 'true' : 'false'}
												data-hinted={isHinted ? 'true' : 'false'}
												onClick={() => onSelectCell(r, c)}
												onKeyDown={(e) => handleCellKeyDown(e, r, c)}
											>
												{cell.value !== null ? (
													<S.CellDigit>{cell.value}</S.CellDigit>
												) : cell.notes.length > 0 ? (
													<S.NotesGrid data-size={String(board.size)} aria-hidden="true">
														{digits.map((d) => (
															<S.NoteDigit
																key={`note-${key}-${d}`}
																data-visible={cell.notes.includes(d) ? 'true' : 'false'}
															>
																{d}
															</S.NoteDigit>
														))}
													</S.NotesGrid>
												) : null}
												{isError && <S.ConflictCornerDot aria-hidden="true" />}
											</S.CellButton>

											{c < board.size - 1 ? (
												hSign !== null ? (
													<InequalityChevron
														orientation="horizontal"
														sign={hSign}
														violated={hViolated}
													/>
												) : (
													<S.EmptyCornerSpacer aria-hidden="true" />
												)
											) : null}
										</Fragment>
									);
								})}
							</S.SemanticRow>

							{r < board.size - 1 ? (
								<S.VerticalGutterRow key={`futoshiki-vgutter-${r}`} aria-hidden="true">
									{rowCells.map((cell) => {
										const c = cell.col;
										const vSign = board.vInequalities[r][c];
										const vViolated =
											settings.highlightErrors && conflicts.violatedVertical.has(coordKey(r, c));
										return (
											<Fragment key={`futoshiki-vslot-${r}-${c}`}>
												{vSign !== null ? (
													<InequalityChevron
														orientation="vertical"
														sign={vSign}
														violated={vViolated}
													/>
												) : (
													<S.EmptyCornerSpacer aria-hidden="true" />
												)}
												{c < board.size - 1 ? <S.EmptyCornerSpacer aria-hidden="true" /> : null}
											</Fragment>
										);
									})}
								</S.VerticalGutterRow>
							) : null}
						</Fragment>
					);
				})}
			</S.GridRoot>
		</S.BoardFrame>
	);
}
