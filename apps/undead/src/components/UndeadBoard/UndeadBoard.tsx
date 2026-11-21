import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, type KeyboardEvent, type MouseEvent, useMemo, useRef, useState } from 'react';
import {
	type Direction,
	type EdgeSide,
	MONSTER_TYPES,
	type MonsterType,
	type RayPath,
	type UndeadBoard as UndeadBoardModel,
	type UndeadSettings,
	type ValidationResult,
	getClueId,
} from '../../engine/types';
import { MirrorIcon, MonsterIcon } from '../MonsterIcon/MonsterIcon';
import * as S from './UndeadBoard.styles';

export interface UndeadBoardProps {
	readonly board: UndeadBoardModel;
	readonly rays: Readonly<Record<string, RayPath>>;
	readonly validation: ValidationResult;
	readonly activeCell: { readonly row: number; readonly col: number };
	readonly completedClues: ReadonlySet<string>;
	readonly settings: UndeadSettings;
	readonly isPaused: boolean;
	readonly onSelectCell: (row: number, col: number) => void;
	readonly onMonsterInput: (monster: MonsterType, forceNote?: boolean) => void;
	readonly onRightClickCell: (row: number, col: number) => void;
	readonly onErase: () => void;
	readonly onToggleNotes: () => void;
	readonly onToggleClueDone: (clueId: string) => void;
	readonly onUndo: () => void;
	readonly onRedo: () => void;
	readonly onTogglePause: () => void;
}

function getEdgePoint(
	row: number,
	col: number,
	dir: Direction,
	isEntry: boolean,
): { readonly x: number; readonly y: number } {
	const cx = col * 100 + 50;
	const cy = row * 100 + 50;

	// If entering moving S, we enter from the N edge (y = cy - 50).
	// If exiting moving S, we exit through the S edge (y = cy + 50).
	if (isEntry) {
		switch (dir) {
			case 'S':
				return { x: cx, y: cy - 50 };
			case 'N':
				return { x: cx, y: cy + 50 };
			case 'E':
				return { x: cx - 50, y: cy };
			case 'W':
				return { x: cx + 50, y: cy };
		}
	}

	switch (dir) {
		case 'S':
			return { x: cx, y: cy + 50 };
		case 'N':
			return { x: cx, y: cy - 50 };
		case 'E':
			return { x: cx + 50, y: cy };
		case 'W':
			return { x: cx - 50, y: cy };
	}
}

export function UndeadBoard({
	board,
	rays,
	validation,
	activeCell,
	completedClues,
	settings,
	isPaused,
	onSelectCell,
	onMonsterInput,
	onRightClickCell,
	onErase,
	onToggleNotes,
	onToggleClueDone,
	onUndo,
	onRedo,
	onTogglePause,
}: UndeadBoardProps): JSX.Element {
	const { t } = useI18n('undead');
	const [previewClueId, setPreviewClueId] = useState<string | null>(null);
	const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

	const activeRay = settings.showRayPreview && previewClueId ? (rays[previewClueId] ?? null) : null;

	// Map each cell coordinate to its ray highlight state ('direct' | 'reflected' | 'both')
	const cellRayHighlight = useMemo(() => {
		const map = new Map<string, 'direct' | 'reflected' | 'both'>();
		if (!activeRay) return map;

		for (const step of activeRay.steps) {
			const key = `${step.row}-${step.col}`;
			const kind = step.hasReflected ? 'reflected' : 'direct';
			const prev = map.get(key);
			if (!prev) {
				map.set(key, kind);
			} else if (prev !== kind) {
				map.set(key, 'both');
			}
		}
		return map;
	}, [activeRay]);

	// Build SVG path strings separating direct vs reflected segments
	const rayGeometry = useMemo(() => {
		if (!activeRay || activeRay.steps.length === 0) return null;

		const directSegments: string[] = [];
		const reflectedSegments: string[] = [];
		const bouncePoints: { readonly x: number; readonly y: number }[] = [];

		for (const step of activeRay.steps) {
			const start = getEdgePoint(step.row, step.col, step.enterDir, true);
			const cx = step.col * 100 + 50;
			const cy = step.row * 100 + 50;
			const end = getEdgePoint(step.row, step.col, step.exitDir, false);

			if (step.isMirror) {
				const enterSeg = `M ${start.x} ${start.y} L ${cx} ${cy}`;
				if (step.hasReflected) {
					reflectedSegments.push(enterSeg);
				} else {
					directSegments.push(enterSeg);
				}
				reflectedSegments.push(`M ${cx} ${cy} L ${end.x} ${end.y}`);
				bouncePoints.push({ x: cx, y: cy });
			} else {
				const seg = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
				if (step.hasReflected) {
					reflectedSegments.push(seg);
				} else {
					directSegments.push(seg);
				}
			}
		}

		const firstStep = activeRay.steps[0];
		const entryPoint = firstStep ? getEdgePoint(firstStep.row, firstStep.col, firstStep.enterDir, true) : null;

		return {
			directD: directSegments.join(' '),
			reflectedD: reflectedSegments.join(' '),
			bouncePoints,
			entryPoint,
		};
	}, [activeRay]);

	const focusCell = (row: number, col: number) => {
		onSelectCell(row, col);
		const btn = cellRefs.current.get(`${row}-${col}`);
		btn?.focus();
	};

	const handleCellKeyDown = (event: KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
		const { key, shiftKey, ctrlKey, metaKey } = event;
		const size = board.size;

		if ((ctrlKey || metaKey) && key.toLowerCase() === 'z') {
			event.preventDefault();
			if (shiftKey) {
				onRedo();
			} else {
				onUndo();
			}
			return;
		}

		switch (key) {
			case 'ArrowUp':
				event.preventDefault();
				focusCell((row - 1 + size) % size, col);
				return;
			case 'ArrowDown':
				event.preventDefault();
				focusCell((row + 1) % size, col);
				return;
			case 'ArrowLeft':
				event.preventDefault();
				focusCell(row, (col - 1 + size) % size);
				return;
			case 'ArrowRight':
				event.preventDefault();
				focusCell(row, (col + 1) % size);
				return;
			case 'Backspace':
			case 'Delete':
			case '0':
				event.preventDefault();
				onErase();
				return;
			case 'Escape':
				event.preventDefault();
				onTogglePause();
				return;
		}

		if (ctrlKey || metaKey || event.altKey) return;

		const lower = key.toLowerCase();
		if (lower === 'g') {
			event.preventDefault();
			onMonsterInput('ghost', shiftKey);
		} else if (lower === 'v') {
			event.preventDefault();
			onMonsterInput('vampire', shiftKey);
		} else if (lower === 'z') {
			event.preventDefault();
			onMonsterInput('zombie', shiftKey);
		} else if (lower === 'n') {
			event.preventDefault();
			onToggleNotes();
		} else if (lower === 'u') {
			event.preventDefault();
			onUndo();
		} else if (lower === 'r' || lower === 'y') {
			event.preventDefault();
			onRedo();
		} else if (lower === 'p') {
			event.preventDefault();
			onTogglePause();
		}
	};

	const renderClueButton = (side: EdgeSide, index: number, gridRow: number, gridCol: number) => {
		const clueId = getClueId(side, index);
		const evalInfo = validation.clues[clueId];
		const target = board.clues[side][index] ?? 0;
		const isManualDone = completedClues.has(clueId);
		const isAutoDone = settings.autoMarkCompletedClues && evalInfo?.status === 'satisfied';
		const isDone = isManualDone || isAutoDone;
		const displayStatus =
			settings.highlightErrors && evalInfo?.status === 'error'
				? 'error'
				: evalInfo?.status === 'satisfied'
					? 'satisfied'
					: 'incomplete';

		const sideLabelKey =
			side === 'top'
				? 'aria.sideTop'
				: side === 'right'
					? 'aria.sideRight'
					: side === 'bottom'
						? 'aria.sideBottom'
						: 'aria.sideLeft';

		const ariaParts = [
			t('aria.clueButton', {
				side: t(sideLabelKey),
				index: index + 1,
				target,
			}),
		];
		if (displayStatus === 'error') ariaParts.push(t('aria.clueError'));
		else if (displayStatus === 'satisfied') ariaParts.push(t('aria.clueSatisfied'));
		if (isDone) ariaParts.push(t('aria.clueDone'));

		return (
			<S.ClueButton
				key={clueId}
				type="button"
				style={{ gridRow, gridColumn: gridCol }}
				data-active-ray={previewClueId === clueId}
				data-done={isDone}
				data-clue-status={displayStatus}
				aria-pressed={isManualDone}
				aria-label={ariaParts.join(', ')}
				onMouseEnter={() => setPreviewClueId(clueId)}
				onMouseLeave={() => setPreviewClueId((prev) => (prev === clueId ? null : prev))}
				onFocus={() => setPreviewClueId(clueId)}
				onBlur={() => setPreviewClueId((prev) => (prev === clueId ? null : prev))}
				onClick={() => onToggleClueDone(clueId)}
			>
				<span>{target}</span>
				{settings.showClueProgress && evalInfo && (
					<S.ClueSubCount aria-hidden="true">({evalInfo.visibleCount})</S.ClueSubCount>
				)}
			</S.ClueButton>
		);
	};

	const size = board.size;

	return (
		<>
			<S.BoardFrame>
				<S.OuterGrid data-size={size} data-paused={isPaused}>
					{/* Top edge clues */}
					{board.clues.top.map((_, idx) => renderClueButton('top', idx, 1, idx + 2))}

					{/* Left edge clues */}
					{board.clues.left.map((_, idx) => renderClueButton('left', idx, idx + 2, 1))}

					{/* Right edge clues */}
					{board.clues.right.map((_, idx) => renderClueButton('right', idx, idx + 2, size + 2))}

					{/* Bottom edge clues */}
					{board.clues.bottom.map((_, idx) => renderClueButton('bottom', idx, size + 2, idx + 2))}

					{/* Inner N × N WAI-ARIA Grid */}
					{/* biome-ignore lint/a11y/useSemanticElements: Undead is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
					<S.InnerGrid
						role="grid"
						aria-label={t('aria.boardGrid', { size })}
						aria-rowcount={size}
						aria-colcount={size}
					>
						{board.cells.map((rowCells, r) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
							// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
							// biome-ignore lint/a11y/useFocusableInteractive: Row element in ARIA grid delegates focus to cell children via roving tabIndex
							<S.SemanticRow key={`undead-row-${r}`} role="row" aria-rowindex={r + 1}>
								{rowCells.map((cell, c) => {
									const isSelected = activeCell.row === r && activeCell.col === c;
									const isMirror = cell.mirror !== null;
									const rayState = cellRayHighlight.get(`${r}-${c}`);

									const labelParts = [t('aria.cellCoords', { row: r + 1, col: c + 1 })];
									if (cell.mirror === '/') {
										labelParts.push(t('aria.mirrorForward'));
									} else if (cell.mirror === '\\') {
										labelParts.push(t('aria.mirrorBackward'));
									} else if (cell.monster !== null) {
										labelParts.push(
											t('aria.cellMonster', { monster: t(`monsters.${cell.monster}`) }),
										);
									} else if (cell.notes.length > 0) {
										const noteNames = cell.notes.map((m) => t(`monsters.${m}`)).join(', ');
										labelParts.push(t('aria.emptyCell'));
										labelParts.push(t('aria.cellNotes', { notes: noteNames }));
									} else {
										labelParts.push(t('aria.emptyCell'));
									}

									return (
										<S.CellButton
											key={`undead-cell-${cell.row}-${cell.col}`}
											ref={(el) => {
												const k = `${r}-${c}`;
												if (el) cellRefs.current.set(k, el);
												else cellRefs.current.delete(k);
											}}
											type="button"
											// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
											role="gridcell"
											aria-colindex={c + 1}
											aria-readonly={isMirror ? true : undefined}
											aria-selected={isSelected}
											aria-label={labelParts.join(', ')}
											tabIndex={isSelected ? 0 : -1}
											data-selected={isSelected}
											data-mirror={isMirror}
											data-ray={rayState ?? 'none'}
											onClick={() => onSelectCell(r, c)}
											onContextMenu={(e: MouseEvent<HTMLButtonElement>) => {
												e.preventDefault();
												if (!isMirror) {
													onRightClickCell(r, c);
												}
											}}
											onKeyDown={(e) => handleCellKeyDown(e, r, c)}
										>
											{cell.mirror !== null ? (
												<S.CellMirrorWrap>
													<MirrorIcon mirror={cell.mirror} />
												</S.CellMirrorWrap>
											) : cell.monster !== null ? (
												<S.CellMonsterWrap data-monster={cell.monster}>
													<MonsterIcon monster={cell.monster} />
												</S.CellMonsterWrap>
											) : cell.notes.length > 0 ? (
												<S.NotesStrip aria-hidden="true">
													{MONSTER_TYPES.map((m) => (
														<S.NotePip key={m} data-monster={m}>
															{cell.notes.includes(m) ? (
																<MonsterIcon monster={m} />
															) : null}
														</S.NotePip>
													))}
												</S.NotesStrip>
											) : null}
										</S.CellButton>
									);
								})}
							</S.SemanticRow>
						))}

						{/* Interactive Ray Preview SVG Overlay */}
						{rayGeometry && (
							<S.RayOverlaySvg viewBox={`0 0 ${size * 100} ${size * 100}`} aria-hidden="true">
								{rayGeometry.directD && <path className="ray-direct" d={rayGeometry.directD} />}
								{rayGeometry.reflectedD && (
									<path className="ray-reflected" d={rayGeometry.reflectedD} />
								)}
								{rayGeometry.entryPoint && (
									<circle
										className="ray-node-direct"
										cx={rayGeometry.entryPoint.x}
										cy={rayGeometry.entryPoint.y}
										r="9"
									/>
								)}
								{rayGeometry.bouncePoints.map((pt, idx) => (
									<circle
										key={`bounce-${pt.x}-${pt.y}-${idx}`}
										className="ray-node-reflected"
										cx={pt.x}
										cy={pt.y}
										r="8"
									/>
								))}
							</S.RayOverlaySvg>
						)}
					</S.InnerGrid>
				</S.OuterGrid>
			</S.BoardFrame>

			{settings.showRayPreview && (
				<S.RayLegend aria-label={t('aria.rayLegend')}>
					<S.LegendItem>
						<S.LegendSwatch data-kind="direct" aria-hidden="true" />
						<span>{t('status.rayDirect')}</span>
					</S.LegendItem>
					<S.LegendItem>
						<S.LegendSwatch data-kind="reflected" aria-hidden="true" />
						<span>{t('status.rayReflected')}</span>
					</S.LegendItem>
				</S.RayLegend>
			)}
		</>
	);
}
