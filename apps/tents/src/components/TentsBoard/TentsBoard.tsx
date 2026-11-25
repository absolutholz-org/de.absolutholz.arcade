import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useThemeset } from '@arcade/lib-ui/hooks/useThemeset';
import { type JSX, type RefObject, useEffect, useRef } from 'react';
import { coordKey } from '../../engine/validator.ts';
import * as S from './TentsBoard.styles.js';
import type { TentsBoardProps } from './TentsBoard.types.js';

/**
 * Roving-tabindex fallback for `role="toolbar"` when native `focusgroup` is unsupported.
 * Ensures each clue toolbar is a single Tab stop navigated via arrow keys, Home, and End.
 */
function useToolbarRovingTabindex(ref: RefObject<HTMLDivElement | null>): void {
	useEffect(() => {
		const bar = ref.current;
		if (!bar || 'focusGroup' in HTMLElement.prototype) return;

		const getItems = () => Array.from(bar.querySelectorAll<HTMLButtonElement>('button'));
		const initialItems = getItems();
		if (initialItems.length === 0) return;

		const activeIndex = initialItems.findIndex((b) => b.tabIndex === 0);
		const initialIndex = activeIndex >= 0 ? activeIndex : 0;
		initialItems.forEach((b, i) => {
			b.tabIndex = i === initialIndex ? 0 : -1;
		});

		const handleFocusIn = (e: FocusEvent) => {
			const items = getItems();
			const target = e.target as HTMLButtonElement | null;
			if (!target || !items.includes(target)) return;
			for (const b of items) {
				b.tabIndex = b === target ? 0 : -1;
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			const items = getItems();
			if (items.length === 0) return;

			const vertical = bar.getAttribute('aria-orientation') === 'vertical';
			const rtl = getComputedStyle(bar).direction === 'rtl';
			const steps: Record<string, number> = vertical
				? { ArrowDown: 1, ArrowUp: -1 }
				: { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };

			const currentIdx = items.indexOf(document.activeElement as HTMLButtonElement);
			if (currentIdx < 0) return;

			let nextIdx: number | null = null;
			if (e.key in steps) {
				nextIdx = (currentIdx + steps[e.key] + items.length) % items.length;
			} else if (e.key === 'Home') {
				nextIdx = 0;
			} else if (e.key === 'End') {
				nextIdx = items.length - 1;
			}

			if (nextIdx === null) return;
			e.preventDefault();
			items.forEach((b, i) => {
				b.tabIndex = i === nextIdx ? 0 : -1;
			});
			items[nextIdx]?.focus();
		};

		bar.addEventListener('focusin', handleFocusIn);
		bar.addEventListener('keydown', handleKeyDown);
		return () => {
			bar.removeEventListener('focusin', handleFocusIn);
			bar.removeEventListener('keydown', handleKeyDown);
		};
	}, [ref]);
}

export function TentsBoard({
	board,
	evaluation,
	focusedCell,
	highlightViolations,
	highlightClues,
	isComplete,
	onCellClick,
	onCellContextMenu,
	onCellFocus,
	onClueClick,
	onKeyDown,
}: TentsBoardProps): JSX.Element {
	const { t } = useI18n('tents');
	const [activeThemeset] = useThemeset();
	const isChristmas = activeThemeset === 'christmas';
	const gridRef = useRef<HTMLDivElement>(null);
	const colToolbarRef = useRef<HTMLDivElement>(null);
	const rowToolbarRef = useRef<HTMLDivElement>(null);

	const size = board.size;
	const activeRow = focusedCell?.row ?? 0;
	const activeCol = focusedCell?.col ?? 0;

	useToolbarRovingTabindex(colToolbarRef);
	useToolbarRovingTabindex(rowToolbarRef);

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

	return (
		<S.BoardWrapper>
			<S.SrOnly id="tents-keyboard-instructions">{t('aria.instructions')}</S.SrOnly>

			<S.BoardMatrix>
				<S.CornerCell aria-hidden="true">⛺</S.CornerCell>

				{/* Top Column Clues */}
				<S.ColCluesRow
					ref={colToolbarRef}
					role="toolbar"
					aria-label={t('aria.colCluesToolbar')}
					aria-orientation="horizontal"
					data-size={String(size)}
					{...({ focusgroup: 'toolbar wrap' } as Record<string, string>)}
				>
					{Array.from({ length: size }).map((_, c) => {
						const colEval = evaluation.cols[c] ?? {
							current: 0,
							target: board.colClues[c] ?? 0,
							status: 'under',
						};
						const statusAttr = highlightClues ? colEval.status : undefined;

						return (
							<S.ClueButton
								// biome-ignore lint/suspicious/noArrayIndexKey: Column index is stable for fixed grid size
								key={`tents-col-clue-${c}`}
								type="button"
								data-status={statusAttr}
								onClick={() => onClueClick?.('col', c)}
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

				{/* Left Row Clues */}
				<S.RowCluesCol
					ref={rowToolbarRef}
					role="toolbar"
					aria-label={t('aria.rowCluesToolbar')}
					aria-orientation="vertical"
					data-size={String(size)}
					{...({ focusgroup: 'toolbar wrap block' } as Record<string, string>)}
				>
					{Array.from({ length: size }).map((_, r) => {
						const rowEval = evaluation.rows[r] ?? {
							current: 0,
							target: board.rowClues[r] ?? 0,
							status: 'under',
						};
						const statusAttr = highlightClues ? rowEval.status : undefined;

						return (
							<S.ClueButton
								// biome-ignore lint/suspicious/noArrayIndexKey: Row index is stable for fixed grid size
								key={`tents-row-clue-${r}`}
								type="button"
								data-status={statusAttr}
								onClick={() => onClueClick?.('row', r)}
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

				{/* Center Grid of Cells */}
				<S.GridContainer
					ref={gridRef}
					// biome-ignore lint/a11y/useSemanticElements: Tents is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
					role="grid"
					aria-label={t('aria.board', { size: String(size) })}
					aria-description={t('aria.instructions')}
					aria-describedby="tents-keyboard-instructions"
					aria-rowcount={size}
					aria-colcount={size}
					data-size={String(size)}
					onKeyDown={onKeyDown}
				>
					{Array.from({ length: size }).map((_, r) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid row coordinates serve as stable keys
						// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
						<S.GridRow key={`tents-row-${r}`} role="row" aria-rowindex={r + 1}>
							{Array.from({ length: size }).map((__, c) => {
								const cell = board.grid[r]?.[c] ?? { fixed: 'empty', mark: 'none' };
								const key = coordKey(r, c);
								const isFixedTree = cell.fixed === 'tree';

								let isError = false;
								if (highlightViolations) {
									if (cell.mark === 'tent') {
										isError =
											evaluation.touchingTents.has(key) || evaluation.unpairedTents.has(key);
									}
								}

								const isFocused = activeRow === r && activeCol === c;

								const stateDescription = isFixedTree
									? t('aria.cellTree')
									: cell.mark === 'tent'
										? t('aria.cellTent')
										: cell.mark === 'grass'
											? t('aria.cellGrass')
											: t('aria.cellEmpty');

								const labelParts = [
									t('aria.cell', { row: String(r + 1), col: String(c + 1) }),
									stateDescription,
								];

								return (
									<S.CellButton
										// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
										key={`tents-cell-${r}-${c}`}
										type="button"
										// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
										role="gridcell"
										tabIndex={isFocused ? 0 : -1}
										aria-selected={isFocused}
										aria-rowindex={r + 1}
										aria-colindex={c + 1}
										aria-readonly={isFixedTree ? true : undefined}
										aria-label={labelParts.join(', ')}
										data-row={r}
										data-col={c}
										data-fixed={cell.fixed}
										data-mark={cell.mark}
										data-error={isError ? 'true' : 'false'}
										data-focused={isFocused ? 'true' : 'false'}
										data-victory={isComplete ? 'true' : 'false'}
										onClick={() => onCellClick(r, c)}
										onContextMenu={(e) => onCellContextMenu(r, c, e)}
										onFocus={() => onCellFocus(r, c)}
									>
										{isFixedTree && (isChristmas ? '🎄' : (r * 7 + c * 13) % 2 === 0 ? '🌲' : '🌳')}
										{!isFixedTree && cell.mark === 'tent' && '⛺'}
										{!isFixedTree && cell.mark === 'grass' && '🌱'}
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
