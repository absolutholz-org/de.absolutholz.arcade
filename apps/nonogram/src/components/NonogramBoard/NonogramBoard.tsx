import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { CSSProperties, JSX, KeyboardEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isLineCompleted } from '../../engine/clues';
import type { CellState, InteractionMode, MoveAction, NonogramPuzzle } from '../../engine/types';
import { NonogramCell } from '../NonogramCell';
import { PuzzleIcon } from '../NonogramIcons';
import * as S from './NonogramBoard.styles';

export interface NonogramBoardProps {
	puzzle: NonogramPuzzle;
	cells: CellState[];
	focusedCell: { col: number; row: number } | null;
	isGameOver: boolean;
	isWon: boolean;
	interactionMode: InteractionMode;
	onApplyStroke: (actions: MoveAction[]) => void;
	onSetFocus: (col: number, row: number) => void;
	onToggleCell: (col: number, row: number, mode: InteractionMode) => void;
	onUndo?: () => void;
	onRedo?: () => void;
}

interface DragState {
	active: boolean;
	startCol: number;
	startRow: number;
	lockedAxis: 'horizontal' | 'vertical' | null;
	targetState: CellState;
	pointerId: number;
}

export function NonogramBoard({
	puzzle,
	cells,
	focusedCell,
	isGameOver,
	isWon,
	interactionMode,
	onApplyStroke,
	onSetFocus,
	onToggleCell,
	onUndo,
	onRedo,
}: NonogramBoardProps): JSX.Element {
	const { t } = useI18n('nonogram');
	const boardRef = useRef<HTMLElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const [previewMap, setPreviewMap] = useState<Record<number, CellState>>({});
	const previewMapRef = useRef<Record<number, CellState>>({});
	const dragStateRef = useRef<DragState | null>(null);

	const { width, height, rowClues, colClues } = puzzle;

	// Line completion status for clues auto-dimming with boundary safety
	const completedRows = (rowClues ?? []).map((clue, r) => {
		if (!clue) return false;
		const rowCells = cells.slice(r * width, (r + 1) * width);
		return isLineCompleted(rowCells, clue);
	});

	const completedCols = (colClues ?? []).map((clue, c) => {
		if (!clue) return false;
		const colCells: CellState[] = [];
		for (let r = 0; r < height; r++) {
			colCells.push(cells[r * width + c]);
		}
		return isLineCompleted(colCells, clue);
	});

	const handlePointerEnd = useCallback(
		(_e?: PointerEvent<HTMLElement> | globalThis.PointerEvent) => {
			const drag = dragStateRef.current;
			if (!drag || !drag.active) return;

			if (boardRef.current && typeof boardRef.current.hasPointerCapture === 'function') {
				try {
					if (boardRef.current.hasPointerCapture(drag.pointerId)) {
						boardRef.current.releasePointerCapture(drag.pointerId);
					}
				} catch {
					// Ignore pointer capture release errors
				}
			}

			dragStateRef.current = null;

			// Synchronously retrieve preview changes (immune to async state render lag on fast taps)
			let currentPreview = previewMapRef.current;
			if (Object.keys(currentPreview).length === 0) {
				currentPreview = { [drag.startRow * width + drag.startCol]: drag.targetState };
			}

			previewMapRef.current = {};
			setPreviewMap({});

			const actions: MoveAction[] = [];
			for (const [idxStr, nextState] of Object.entries(currentPreview)) {
				const idx = Number(idxStr);
				if (idx < 0 || idx >= cells.length) continue;
				const col = idx % width;
				const row = Math.floor(idx / width);
				const previousState = cells[idx];
				if (previousState !== nextState) {
					actions.push({ col, row, previousState, nextState });
				}
			}

			if (actions.length > 0) {
				onApplyStroke(actions);
			}
		},
		[cells, width, onApplyStroke],
	);

	const handlePointerDown = useCallback(
		(e: PointerEvent<HTMLElement>) => {
			if (isGameOver || isWon) return;

			const targetBtn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-col]');
			if (!targetBtn || !targetBtn.dataset.col || !targetBtn.dataset.row) return;

			const startCol = Number(targetBtn.dataset.col);
			const startRow = Number(targetBtn.dataset.row);
			if (startCol < 0 || startCol >= width || startRow < 0 || startRow >= height) return;
			const startIndex = startRow * width + startCol;

			// Right click or Shift+click triggers cross action
			const isCrossAction = e.button === 2 || e.shiftKey || interactionMode === 'cross';
			const effectiveAction: InteractionMode = isCrossAction ? 'cross' : 'fill';

			const currentState = cells[startIndex];
			let targetState: CellState = 'filled';

			if (effectiveAction === 'fill') {
				targetState = currentState === 'filled' ? 'empty' : 'filled';
			} else {
				targetState = currentState === 'crossed' ? 'empty' : 'crossed';
			}

			dragStateRef.current = {
				active: true,
				startCol,
				startRow,
				lockedAxis: null,
				targetState,
				pointerId: e.pointerId,
			};

			const initialPreview: Record<number, CellState> = { [startIndex]: targetState };
			previewMapRef.current = initialPreview;
			setPreviewMap(initialPreview);
			onSetFocus(startCol, startRow);

			if (boardRef.current && typeof boardRef.current.setPointerCapture === 'function') {
				try {
					boardRef.current.setPointerCapture(e.pointerId);
				} catch {
					// Ignore pointer capture errors on unsupported platforms
				}
			}

			e.preventDefault();
		},
		[isGameOver, isWon, interactionMode, cells, width, height, onSetFocus],
	);

	const handlePointerMove = useCallback(
		(e: PointerEvent<HTMLElement>) => {
			const drag = dragStateRef.current;
			if (!drag || !drag.active) return;

			e.preventDefault();

			// Resolve cell by target element or fallback to clamped grid coordinates
			let curCol: number | null = null;
			let curRow: number | null = null;

			const el = document.elementFromPoint(e.clientX, e.clientY);
			const targetBtn = el?.closest<HTMLButtonElement>('button[data-col]');
			if (targetBtn?.dataset.col && targetBtn.dataset.row) {
				curCol = Number(targetBtn.dataset.col);
				curRow = Number(targetBtn.dataset.row);
			} else if (gridRef.current) {
				const rect = gridRef.current.getBoundingClientRect();
				if (rect.width > 0 && rect.height > 0) {
					const clampedX = Math.max(0, Math.min(rect.width - 1, e.clientX - rect.left));
					const clampedY = Math.max(0, Math.min(rect.height - 1, e.clientY - rect.top));
					curCol = Math.min(width - 1, Math.max(0, Math.floor((clampedX / rect.width) * width)));
					curRow = Math.min(height - 1, Math.max(0, Math.floor((clampedY / rect.height) * height)));
				}
			}

			if (curCol === null || curRow === null) return;
			curCol = Math.max(0, Math.min(width - 1, curCol));
			curRow = Math.max(0, Math.min(height - 1, curRow));

			// Lock axis once moved away from start cell
			let lockedAxis = drag.lockedAxis;
			if (!lockedAxis) {
				if (curCol !== drag.startCol && curRow === drag.startRow) {
					lockedAxis = 'horizontal';
					drag.lockedAxis = 'horizontal';
				} else if (curRow !== drag.startRow && curCol === drag.startCol) {
					lockedAxis = 'vertical';
					drag.lockedAxis = 'vertical';
				} else if (curCol !== drag.startCol || curRow !== drag.startRow) {
					lockedAxis =
						Math.abs(curCol - drag.startCol) >= Math.abs(curRow - drag.startRow)
							? 'horizontal'
							: 'vertical';
					drag.lockedAxis = lockedAxis;
				}
			}

			const nextPreview: Record<number, CellState> = {};

			if (lockedAxis === 'horizontal') {
				const minC = Math.max(0, Math.min(drag.startCol, curCol));
				const maxC = Math.min(width - 1, Math.max(drag.startCol, curCol));
				for (let c = minC; c <= maxC; c++) {
					nextPreview[drag.startRow * width + c] = drag.targetState;
				}
			} else if (lockedAxis === 'vertical') {
				const minR = Math.max(0, Math.min(drag.startRow, curRow));
				const maxR = Math.min(height - 1, Math.max(drag.startRow, curRow));
				for (let r = minR; r <= maxR; r++) {
					nextPreview[r * width + drag.startCol] = drag.targetState;
				}
			} else {
				nextPreview[drag.startRow * width + drag.startCol] = drag.targetState;
			}

			previewMapRef.current = nextPreview;
			setPreviewMap(nextPreview);
		},
		[width, height],
	);

	// Global pointerup/cancel safety listener so drag is never trapped when releasing outside
	useEffect(() => {
		const handleGlobalPointerEnd = (e: globalThis.PointerEvent) => {
			if (dragStateRef.current?.active) {
				handlePointerEnd(e);
			}
		};

		window.addEventListener('pointerup', handleGlobalPointerEnd);
		window.addEventListener('pointercancel', handleGlobalPointerEnd);
		return () => {
			window.removeEventListener('pointerup', handleGlobalPointerEnd);
			window.removeEventListener('pointercancel', handleGlobalPointerEnd);
		};
	}, [handlePointerEnd]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			if (isGameOver || isWon) return;

			const current = focusedCell ?? { col: 0, row: 0 };
			let nextCol = current.col;
			let nextRow = current.row;

			switch (e.key) {
				case 'ArrowUp':
					nextRow = Math.max(0, current.row - 1);
					e.preventDefault();
					break;
				case 'ArrowDown':
					nextRow = Math.min(height - 1, current.row + 1);
					e.preventDefault();
					break;
				case 'ArrowLeft':
					nextCol = Math.max(0, current.col - 1);
					e.preventDefault();
					break;
				case 'ArrowRight':
					nextCol = Math.min(width - 1, current.col + 1);
					e.preventDefault();
					break;
				case ' ':
				case 'Enter':
					e.preventDefault();
					onToggleCell(current.col, current.row, 'fill');
					return;
				case 'x':
				case 'X':
					e.preventDefault();
					onToggleCell(current.col, current.row, 'cross');
					return;
				case 'Backspace':
				case 'Delete':
				case 'e':
				case 'E': {
					e.preventDefault();
					const idx = current.row * width + current.col;
					if (cells[idx] !== 'empty') {
						onApplyStroke([
							{
								col: current.col,
								row: current.row,
								previousState: cells[idx],
								nextState: 'empty',
							},
						]);
					}
					return;
				}
				case 'z':
				case 'Z':
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						if (e.shiftKey) {
							onRedo?.();
						} else {
							onUndo?.();
						}
					}
					return;
				case 'y':
				case 'Y':
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						onRedo?.();
					}
					return;
				default:
					return;
			}

			if (nextCol !== current.col || nextRow !== current.row || focusedCell === null) {
				onSetFocus(nextCol, nextRow);
				const cellBtn = boardRef.current?.querySelector<HTMLButtonElement>(
					`button[data-col="${nextCol}"][data-row="${nextRow}"]`,
				);
				cellBtn?.focus();
			}
		},
		[focusedCell, height, width, cells, isGameOver, isWon, onSetFocus, onToggleCell, onApplyStroke, onUndo, onRedo],
	);

	const cssVars: CSSProperties = {
		'--cols': width,
		'--rows': height,
		'--art-color': puzzle.color,
	} as CSSProperties;

	return (
		<S.BoardRoot onContextMenu={(e) => e.preventDefault()}>
			<S.BoardContainer
				ref={boardRef}
				data-size={puzzle.difficulty}
				style={cssVars}
				aria-label={t('aria.boardGrid', { cols: width, rows: height })}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				onContextMenu={(e) => e.preventDefault()}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
				onLostPointerCapture={handlePointerEnd}
			>
				{/* Top-Left Corner Spacer */}
				<S.CornerCell aria-hidden="true">
					<PuzzleIcon />
				</S.CornerCell>

				{/* Top Column Clues */}
				{/* biome-ignore lint/a11y/useSemanticElements: ARIA row required for CSS Grid Nonogram column clues */}
				<S.TopCluesContainer role="row" aria-hidden="false">
					{colClues.map((clue, c) => {
						const isCompleted = completedCols[c];
						const isThick = (c + 1) % 5 === 0 && c < width - 1;
						const clueStr = clue.join(' ');
						return (
							<S.TopClueColumn
								// biome-ignore lint/suspicious/noArrayIndexKey: Fixed puzzle column position
								key={`col-clue-${c}`}
								data-completed={isCompleted}
								data-thick-right={isThick}
								aria-label={t('aria.colClue', { col: c + 1, clues: clueStr })}
							>
								{clue.map((num, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Fixed clue number sequence
									<span key={`col-${c}-num-${i}`}>{num}</span>
								))}
							</S.TopClueColumn>
						);
					})}
				</S.TopCluesContainer>

				{/* Left Row Clues */}
				{/* biome-ignore lint/a11y/useSemanticElements: ARIA rowgroup required for CSS Grid Nonogram row clues */}
				<S.LeftCluesContainer role="rowgroup" aria-hidden="false">
					{rowClues.map((clue, r) => {
						const isCompleted = completedRows[r];
						const isThick = (r + 1) % 5 === 0 && r < height - 1;
						const clueStr = clue.join(' ');
						return (
							<S.LeftClueRow
								// biome-ignore lint/suspicious/noArrayIndexKey: Fixed puzzle row position
								key={`row-clue-${r}`}
								data-completed={isCompleted}
								data-thick-bottom={isThick}
								aria-label={t('aria.rowClue', { row: r + 1, clues: clueStr })}
							>
								{clue.map((num, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: Fixed clue number sequence
									<span key={`row-${r}-num-${i}`}>{num}</span>
								))}
							</S.LeftClueRow>
						);
					})}
				</S.LeftCluesContainer>

				{/* Main Grid of Cells */}
				{/* biome-ignore lint/a11y/useSemanticElements: Nonogram is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
				<S.GridContainer
					role="grid"
					ref={gridRef}
					aria-label={t('aria.boardGrid', { cols: width, rows: height })}
				>
					{Array.from({ length: height }).map((_, r) =>
						Array.from({ length: width }).map((__, c) => {
							const index = r * width + c;
							const cellState = cells[index];
							const previewState = previewMap[index];
							const isFocused = focusedCell !== null && focusedCell.col === c && focusedCell.row === r;
							const isThickRight = (c + 1) % 5 === 0 && c < width - 1;
							const isThickBottom = (r + 1) % 5 === 0 && r < height - 1;

							return (
								<NonogramCell
									// biome-ignore lint/suspicious/noArrayIndexKey: 2D coordinate grid keys
									key={`cell-${c}-${r}`}
									col={c}
									row={r}
									state={cellState}
									previewState={previewState}
									isFocused={isFocused}
									isThickRight={isThickRight}
									isThickBottom={isThickBottom}
									isVictory={isWon}
									onFocus={onSetFocus}
								/>
							);
						}),
					)}
				</S.GridContainer>
			</S.BoardContainer>
		</S.BoardRoot>
	);
}
