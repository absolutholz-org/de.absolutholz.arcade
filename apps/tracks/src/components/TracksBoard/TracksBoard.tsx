import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, type PointerEvent, useEffect, useRef, useState } from 'react';
import type { TrackType } from '../../engine/types.js';
import { getFixedCell, inferCellTrackType, isTrackType } from '../../engine/validator.js';
import {
	CellCandidate,
	CellCross,
	GhostTrack,
	TrackCurveNE,
	TrackCurveNW,
	TrackCurveSE,
	TrackCurveSW,
	TrackGate,
	TrackStraightHorizontal,
	TrackStraightVertical,
	TrainLocomotive,
} from '../TracksSvg/index.js';
import * as S from './TracksBoard.styles.js';
import type { TracksBoardProps } from './TracksBoard.types.js';

function renderTrackTile(track: TrackType, isFixed: boolean, isError: boolean, isVictory: boolean): JSX.Element {
	const props = { isFixed, isError, isVictory };
	switch (track) {
		case 'straight-h':
			return <TrackStraightHorizontal {...props} />;
		case 'straight-v':
			return <TrackStraightVertical {...props} />;
		case 'curve-ne':
			return <TrackCurveNE {...props} />;
		case 'curve-nw':
			return <TrackCurveNW {...props} />;
		case 'curve-se':
			return <TrackCurveSE {...props} />;
		case 'curve-sw':
			return <TrackCurveSW {...props} />;
	}
}

export function TracksBoard({
	board,
	evaluation,
	focusedCell,
	highlightClues,
	isComplete,
	onCellClick,
	onCellContextMenu,
	onCellFocus,
	onDragStart,
	onDragEnter,
	onDragEnd,
	onClueClick,
	onKeyDown,
}: TracksBoardProps): JSX.Element {
	const { t } = useI18n('tracks');
	const gridRef = useRef<HTMLDivElement>(null);
	const [trainStepIndex, setTrainStepIndex] = useState(0);

	const size = board.size;
	const activeRow = focusedCell?.row ?? 0;
	const activeCol = focusedCell?.col ?? 0;
	const orderedPath = evaluation.orderedPath;

	// Synchronize DOM focus when active cell changes while focus is inside the grid
	useEffect(() => {
		if (!gridRef.current) return;
		if (gridRef.current.contains(document.activeElement)) {
			const activeBtn = document.activeElement as HTMLButtonElement | null;
			const isAlreadyFocused =
				activeBtn?.dataset?.row === String(activeRow) && activeBtn?.dataset?.col === String(activeCol);

			if (!isAlreadyFocused) {
				const cellBtn = gridRef.current.querySelector<HTMLButtonElement>(
					`button[data-row="${activeRow}"][data-col="${activeCol}"]`,
				);
				cellBtn?.focus();
			}
		}
	}, [activeRow, activeCol]);

	// Step the locomotive along orderedPath every 180ms upon victory
	useEffect(() => {
		if (!isComplete || orderedPath.length === 0) {
			setTrainStepIndex(0);
			return;
		}

		const timer = window.setInterval(() => {
			setTrainStepIndex((prev) => (prev + 1) % orderedPath.length);
		}, 180);

		return () => window.clearInterval(timer);
	}, [isComplete, orderedPath.length]);

	const activeTrainStep =
		isComplete && orderedPath.length > 0 ? orderedPath[trainStepIndex % orderedPath.length] : undefined;

	const handlePointerDown = (r: number, c: number, e: PointerEvent<HTMLButtonElement>) => {
		onDragStart(r, c, e);
		if (e.button === 0 && gridRef.current) {
			try {
				gridRef.current.setPointerCapture(e.pointerId);
			} catch {
				// Ignore if pointer capture is not supported
			}
		}
	};

	const handleGridPointerMove = (e: PointerEvent<HTMLDivElement>) => {
		// On touch devices or when pointer is captured, pointerenter on cells doesn't fire.
		// Use document.elementFromPoint to resolve the cell under the pointer touch coordinate.
		const el = document.elementFromPoint(e.clientX, e.clientY);
		const cellBtn = el?.closest<HTMLButtonElement>('button[data-row][data-col]');
		if (!cellBtn || !cellBtn.dataset.row || !cellBtn.dataset.col) return;
		const r = Number(cellBtn.dataset.row);
		const c = Number(cellBtn.dataset.col);
		onDragEnter(r, c, e as unknown as PointerEvent<HTMLButtonElement>);
	};

	const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
		if (gridRef.current && e.pointerId !== undefined) {
			try {
				if (gridRef.current.hasPointerCapture(e.pointerId)) {
					gridRef.current.releasePointerCapture(e.pointerId);
				}
			} catch {
				// Ignore
			}
		}
		onDragEnd(e);
	};

	return (
		<S.BoardWrapper onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
			<S.SrOnly id="tracks-keyboard-instructions">{t('aria.instructions')}</S.SrOnly>

			<S.BoardMatrix data-size={String(size)}>
				<S.CornerCell aria-hidden="true" />

				<S.ColCluesRow data-size={String(size)}>
					{board.colClues.map((target, c) => {
						const colEval = evaluation.cols[c] ?? {
							current: 0,
							target,
							status: 'under' as const,
						};
						const statusAttr = highlightClues ? colEval.status : 'neutral';

						return (
							<S.ClueButton
								// biome-ignore lint/suspicious/noArrayIndexKey: Column index is stable for fixed grid size
								key={`tracks-col-clue-${c}`}
								type="button"
								data-status={statusAttr}
								onClick={() => onClueClick('col', c)}
								aria-label={t('aria.colClue', {
									index: String(c + 1),
									target: String(colEval.target),
									current: String(colEval.current),
								})}
							>
								<span className="clue-target">{colEval.target}</span>
								<span className="clue-current">
									{colEval.current}/{colEval.target}
								</span>
							</S.ClueButton>
						);
					})}
				</S.ColCluesRow>

				<S.RowCluesCol data-size={String(size)}>
					{board.rowClues.map((target, r) => {
						const rowEval = evaluation.rows[r] ?? {
							current: 0,
							target,
							status: 'under' as const,
						};
						const statusAttr = highlightClues ? rowEval.status : 'neutral';

						return (
							<S.ClueButton
								// biome-ignore lint/suspicious/noArrayIndexKey: Row index is stable for fixed grid size
								key={`tracks-row-clue-${r}`}
								type="button"
								data-status={statusAttr}
								onClick={() => onClueClick('row', r)}
								aria-label={t('aria.rowClue', {
									index: String(r + 1),
									target: String(rowEval.target),
									current: String(rowEval.current),
								})}
							>
								<span className="clue-target">{rowEval.target}</span>
								<span className="clue-current">
									{rowEval.current}/{rowEval.target}
								</span>
							</S.ClueButton>
						);
					})}
				</S.RowCluesCol>

				<S.GridContainer
					ref={gridRef}
					// biome-ignore lint/a11y/useSemanticElements: Tracks is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
					role="grid"
					aria-label={t('aria.board', { size: String(size) })}
					aria-description={t('aria.instructions')}
					aria-describedby="tracks-keyboard-instructions"
					aria-rowcount={size}
					aria-colcount={size}
					data-size={String(size)}
					onKeyDown={onKeyDown}
					onPointerMove={handleGridPointerMove}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerUp}
				>
					{Array.from({ length: size }).map((_, r) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid row coordinates serve as stable keys
						// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
						<S.GridRow key={`tracks-row-${r}`} role="row" aria-rowindex={r + 1}>
							{Array.from({ length: size }).map((__, c) => {
								const state = board.grid[r]?.[c] ?? 'empty';
								const isFixed = getFixedCell(board, r, c) !== undefined;
								const isError = evaluation.errorCells.has(`${r},${c}`);
								const isFocused = activeRow === r && activeCol === c;
								const isStart = board.start.row === r && board.start.col === c;
								const isEnd = board.end.row === r && board.end.col === c;
								const isTrainHere = activeTrainStep?.row === r && activeTrainStep?.col === c;

								const stateDescription = isTrackType(state)
									? t('aria.cellTrack')
									: state === 'cross'
										? t('aria.cellCross')
										: state === 'candidate'
											? t('aria.cellCandidate')
											: t('aria.cellEmpty');

								const labelParts = [
									t('aria.cell', { row: String(r + 1), col: String(c + 1) }),
									stateDescription,
								];
								if (isFixed) labelParts.push(t('aria.cellFixed'));
								if (isStart) labelParts.push(t('aria.cellStart'));
								if (isEnd) labelParts.push(t('aria.cellEnd'));

								return (
									<S.CellButton
										// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
										key={`tracks-cell-${r}-${c}`}
										type="button"
										// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
										role="gridcell"
										tabIndex={isFocused ? 0 : -1}
										aria-selected={isFocused}
										aria-rowindex={r + 1}
										aria-colindex={c + 1}
										aria-readonly={isFixed ? true : undefined}
										aria-label={labelParts.join(', ')}
										data-row={r}
										data-col={c}
										data-state={state}
										data-fixed={isFixed ? 'true' : 'false'}
										data-error={isError ? 'true' : 'false'}
										data-focused={isFocused ? 'true' : undefined}
										data-gate={isStart ? 'start' : isEnd ? 'end' : undefined}
										data-gate-side={isStart ? board.start.side : isEnd ? board.end.side : undefined}
										data-train-here={isTrainHere ? 'true' : undefined}
										onClick={() => onCellClick(r, c)}
										onContextMenu={(e) => onCellContextMenu(r, c, e)}
										onFocus={() => onCellFocus(r, c)}
										onPointerDown={(e) => handlePointerDown(r, c, e)}
										onPointerEnter={(e) => onDragEnter(r, c, e)}
										onPointerUp={handlePointerUp}
									>
										{isStart && (
											<S.GateOverlay>
												<TrackGate variant="start" side={board.start.side} />
											</S.GateOverlay>
										)}

										{isEnd && (
											<S.GateOverlay>
												<TrackGate variant="end" side={board.end.side} />
											</S.GateOverlay>
										)}

										{isTrackType(state) && renderTrackTile(state, isFixed, isError, isComplete)}

										{state === 'candidate' && (
											<>
												<CellCandidate />
												<GhostTrack track={inferCellTrackType(board, r, c) ?? undefined} />
											</>
										)}

										{state === 'cross' && <CellCross isError={isError} />}

										{isTrainHere && (
											<S.LocomotiveOverlay aria-label={t('aria.trainAnimation')}>
												<TrainLocomotive exitTo={activeTrainStep?.exitTo} />
											</S.LocomotiveOverlay>
										)}
									</S.CellButton>
								);
							})}
						</S.GridRow>
					))}
				</S.GridContainer>
			</S.BoardMatrix>
		</S.BoardWrapper>
	);
}
