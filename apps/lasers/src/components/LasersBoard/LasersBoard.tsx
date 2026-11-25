import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, type KeyboardEvent, useEffect, useRef } from 'react';
import {
	type BeamColor,
	COLOR_SYMBOLS,
	type CellCoord,
	type Direction,
	type LaserCell,
	type LaserGrid,
	type RaytraceResult,
	type TargetStatus,
	isRotatableCell,
} from '../../engine/types';
import * as S from './LasersBoard.styles';

export interface LasersBoardProps {
	readonly grid: LaserGrid;
	readonly trace: RaytraceResult;
	readonly showColorSymbols: boolean;
	readonly isPaused: boolean;
	readonly isSolved: boolean;
	readonly focusedCoord: CellCoord;
	readonly hintedCoord: CellCoord | null;
	readonly onFocusCoord: (coord: CellCoord) => void;
	readonly onRotateCell: (coord: CellCoord) => void;
	readonly onUndo: () => void;
	readonly onRedo: () => void;
	readonly onHint: () => void;
	readonly onTogglePause: () => void;
}

const EMITTER_ANGLE: Readonly<Record<Direction, number>> = {
	E: 0,
	S: 90,
	W: 180,
	N: 270,
};

function renderCellGraphic(
	cell: LaserCell,
	targetStatus: TargetStatus | undefined,
	showColorSymbols: boolean,
): JSX.Element | null {
	if (cell.kind === 'empty') return null;

	if (cell.kind === 'wall') {
		return (
			<S.CellGraphic viewBox="0 0 100 100" aria-hidden="true">
				<title>Wall</title>
				<rect
					x="10"
					y="10"
					width="80"
					height="80"
					rx="10"
					fill="currentColor"
					fillOpacity="0.22"
					stroke="currentColor"
					strokeWidth="5"
				/>
				<line x1="22" y1="22" x2="78" y2="78" stroke="currentColor" strokeWidth="4" strokeOpacity="0.45" />
				<line x1="78" y1="22" x2="22" y2="78" stroke="currentColor" strokeWidth="4" strokeOpacity="0.45" />
			</S.CellGraphic>
		);
	}

	if (cell.kind === 'emitter' && cell.color && cell.direction) {
		const angle = EMITTER_ANGLE[cell.direction];
		const symbol = COLOR_SYMBOLS[cell.color];
		return (
			<S.CellGraphic viewBox="0 0 100 100" aria-hidden="true">
				<title>Emitter</title>
				<S.ChannelFill data-color={cell.color}>
					<g transform={`rotate(${angle} 50 50)`}>
						<rect
							x="16"
							y="22"
							width="52"
							height="56"
							rx="12"
							fill="currentColor"
							stroke="CanvasText"
							strokeOpacity="0.4"
							strokeWidth="4"
						/>
						<polygon points="66,30 94,50 66,70" fill="currentColor" />
					</g>
				</S.ChannelFill>
			</S.CellGraphic>
		);
	}

	if (cell.kind === 'target' && cell.color) {
		const isLit = Boolean(targetStatus?.isLit);
		const symbol = COLOR_SYMBOLS[cell.color];
		return (
			<S.CellGraphic viewBox="0 0 100 100" aria-hidden="true">
				<title>Target</title>
				<S.ChannelFill data-color={cell.color}>
					{isLit && <circle cx="50" cy="50" r="44" fill="currentColor" fillOpacity="0.26" />}
					<circle
						cx="50"
						cy="50"
						r="34"
						fill={isLit ? 'currentColor' : 'transparent'}
						fillOpacity={isLit ? '0.92' : '0'}
						stroke="currentColor"
						strokeWidth={isLit ? '7' : '6'}
						strokeDasharray={isLit ? undefined : '10 5'}
					/>
					<circle
						cx="50"
						cy="50"
						r="20"
						fill={isLit ? 'currentColor' : 'transparent'}
						stroke="currentColor"
						strokeWidth="3"
						strokeOpacity="0.65"
					/>
					{showColorSymbols && (
						<S.SymbolText x="50" y="50" data-unlit={!isLit}>
							{symbol}
						</S.SymbolText>
					)}
				</S.ChannelFill>
			</S.CellGraphic>
		);
	}

	if ((cell.kind === 'mirror' || cell.kind === 'fixed-mirror') && cell.orientation) {
		const isFixed = cell.kind === 'fixed-mirror';
		const isSlash = cell.orientation === '/';
		const x1 = isSlash ? 20 : 20;
		const y1 = isSlash ? 80 : 20;
		const x2 = isSlash ? 80 : 80;
		const y2 = isSlash ? 20 : 80;

		return (
			<S.CellGraphic viewBox="0 0 100 100" aria-hidden="true">
				<title>{isFixed ? 'Fixed mirror' : 'Mirror'}</title>
				{isFixed ? (
					<rect
						x="10"
						y="10"
						width="80"
						height="80"
						rx="12"
						fill="none"
						stroke="currentColor"
						strokeOpacity="0.35"
						strokeWidth="3"
						strokeDasharray="6 5"
					/>
				) : (
					<circle
						cx="50"
						cy="50"
						r="36"
						fill="currentColor"
						fillOpacity="0.06"
						stroke="currentColor"
						strokeOpacity="0.22"
						strokeWidth="2.5"
					/>
				)}
				<line
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					stroke="currentColor"
					strokeWidth="12"
					strokeLinecap="round"
					strokeOpacity="0.25"
				/>
				<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
				{isFixed ? (
					<>
						<circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.6" />
						<circle cx="80" cy="80" r="4" fill="currentColor" fillOpacity="0.6" />
					</>
				) : (
					<circle cx="50" cy="50" r="6" fill="currentColor" />
				)}
			</S.CellGraphic>
		);
	}

	if ((cell.kind === 'splitter' || cell.kind === 'fixed-splitter') && cell.orientation) {
		const isFixed = cell.kind === 'fixed-splitter';
		const isSlash = cell.orientation === '/';
		const x1 = 18;
		const y1 = isSlash ? 82 : 18;
		const x2 = 82;
		const y2 = isSlash ? 18 : 82;

		return (
			<S.CellGraphic viewBox="0 0 100 100" aria-hidden="true">
				<title>{isFixed ? 'Fixed beam splitter' : 'Beam splitter'}</title>
				<polygon
					points="50,12 88,50 50,88 12,50"
					fill="currentColor"
					fillOpacity="0.08"
					stroke="currentColor"
					strokeOpacity="0.4"
					strokeWidth="3"
				/>
				<line
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					stroke="currentColor"
					strokeWidth="7"
					strokeLinecap="round"
					strokeDasharray="12 8"
				/>
				<circle cx="50" cy="50" r="7" fill="none" stroke="currentColor" strokeWidth="3.5" />
			</S.CellGraphic>
		);
	}

	return null;
}

export function LasersBoard({
	grid,
	trace,
	showColorSymbols,
	isPaused,
	isSolved,
	focusedCoord,
	hintedCoord,
	onFocusCoord,
	onRotateCell,
	onUndo,
	onRedo,
	onHint,
	onTogglePause,
}: LasersBoardProps): JSX.Element {
	const { t } = useI18n('lasers');
	const rows = grid.length;
	const cols = rows > 0 ? grid[0].length : 0;
	const cellRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
	const hasKeyboardFocusedRef = useRef(false);

	const targetMap = new Map<string, TargetStatus>();
	for (const target of trace.targets) {
		targetMap.set(`${target.row},${target.col}`, target);
	}

	useEffect(() => {
		if (!hasKeyboardFocusedRef.current) return;
		const el = cellRefs.current.get(`${focusedCoord.row},${focusedCoord.col}`);
		if (el && document.activeElement !== el) {
			el.focus();
		}
	}, [focusedCoord]);

	const getColorName = (color: BeamColor | undefined): string => {
		if (!color) return '';
		return t(`colors.${color}` as 'colors.cyan');
	};

	const getOrientationName = (orientation: '/' | '\\' | undefined): string => {
		return orientation === '/' ? t('orientations.forwardSlash') : t('orientations.backslash');
	};

	const getCellAriaLabel = (cell: LaserCell): string => {
		const rowNum = cell.row + 1;
		const colNum = cell.col + 1;

		switch (cell.kind) {
			case 'empty':
				return t('aria.emptyCell', { row: rowNum, col: colNum });
			case 'wall':
				return t('aria.wallCell', { row: rowNum, col: colNum });
			case 'emitter':
				return t('aria.emitterCell', {
					row: rowNum,
					col: colNum,
					color: getColorName(cell.color),
					direction: cell.direction ?? 'E',
				});
			case 'target': {
				const status = targetMap.get(`${cell.row},${cell.col}`);
				return t(status?.isLit ? 'aria.targetLitCell' : 'aria.targetUnlitCell', {
					row: rowNum,
					col: colNum,
					color: getColorName(cell.color),
				});
			}
			case 'mirror':
				return t('aria.mirrorCell', {
					row: rowNum,
					col: colNum,
					orientation: getOrientationName(cell.orientation),
				});
			case 'fixed-mirror':
				return t('aria.fixedMirrorCell', {
					row: rowNum,
					col: colNum,
					orientation: getOrientationName(cell.orientation),
				});
			case 'splitter':
				return t('aria.splitterCell', {
					row: rowNum,
					col: colNum,
					orientation: getOrientationName(cell.orientation),
				});
			case 'fixed-splitter':
				return t('aria.fixedSplitterCell', {
					row: rowNum,
					col: colNum,
					orientation: getOrientationName(cell.orientation),
				});
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (isPaused) {
			if (event.key === 'p' || event.key === 'P') {
				event.preventDefault();
				onTogglePause();
			}
			return;
		}

		const isMod = event.ctrlKey || event.metaKey;
		if (isMod && event.key.toLowerCase() === 'z') {
			event.preventDefault();
			if (event.shiftKey) {
				onRedo();
			} else {
				onUndo();
			}
			return;
		}
		if (isMod && event.key.toLowerCase() === 'y') {
			event.preventDefault();
			onRedo();
			return;
		}

		if (event.key === 'p' || event.key === 'P') {
			event.preventDefault();
			onTogglePause();
			return;
		}

		if (event.key === 'h' || event.key === 'H') {
			event.preventDefault();
			onHint();
			return;
		}

		let nextRow = focusedCoord.row;
		let nextCol = focusedCoord.col;

		switch (event.key) {
			case 'ArrowUp':
				nextRow = Math.max(0, focusedCoord.row - 1);
				break;
			case 'ArrowDown':
				nextRow = Math.min(rows - 1, focusedCoord.row + 1);
				break;
			case 'ArrowLeft':
				nextCol = Math.max(0, focusedCoord.col - 1);
				break;
			case 'ArrowRight':
				nextCol = Math.min(cols - 1, focusedCoord.col + 1);
				break;
			case 'Home':
				nextCol = 0;
				break;
			case 'End':
				nextCol = cols - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		hasKeyboardFocusedRef.current = true;
		onFocusCoord({ row: nextRow, col: nextCol });
	};

	return (
		<S.BoardFrame>
			<S.BoardViewport data-paused={isPaused}>
				{/* Crisp SVG Laser Beam Overlay */}
				<S.BeamOverlay
					viewBox={`0 0 ${cols * 100} ${rows * 100}`}
					role="img"
					aria-label={t('aria.beamOverlayTitle')}
				>
					<title>{t('aria.beamOverlayTitle')}</title>
					{trace.segments.map((seg, idx) => {
						const x1 = seg.fromCol * 100 + 50;
						const y1 = seg.fromRow * 100 + 50;
						const x2 = seg.toCol * 100 + 50;
						const y2 = seg.toRow * 100 + 50;
						const key = `beam-${seg.fromRow}-${seg.fromCol}-${seg.toRow}-${seg.toCol}-${idx}`;
						return (
							<g key={key}>
								<S.BeamGlowLine x1={x1} y1={y1} x2={x2} y2={y2} data-color={seg.color} />
								<S.BeamCoreLine x1={x1} y1={y1} x2={x2} y2={y2} data-color={seg.color} />
							</g>
						);
					})}
					{showColorSymbols &&
						grid.flatMap((row, r) =>
							row.map((cell, c) => {
								if (cell.kind !== 'emitter' || !cell.color || !cell.direction) return null;
								const offset =
									cell.direction === 'E'
										? { dx: -8, dy: 0 }
										: cell.direction === 'W'
											? { dx: 8, dy: 0 }
											: cell.direction === 'S'
												? { dx: 0, dy: -8 }
												: { dx: 0, dy: 8 };
								const cx = c * 100 + 50 + offset.dx;
								const cy = r * 100 + 50 + offset.dy;
								return (
									<g key={`emitter-symbol-${cx}-${cy}`}>
										<circle
											cx={cx}
											cy={cy}
											r="17"
											fill="var(--color-surface)"
											stroke="CanvasText"
											strokeWidth="2"
											strokeOpacity="0.35"
										/>
										<S.SymbolText x={cx} y={cy} data-unlit="true">
											{COLOR_SYMBOLS[cell.color]}
										</S.SymbolText>
									</g>
								);
							}),
						)}
				</S.BeamOverlay>

				{/* biome-ignore lint/a11y/useSemanticElements: Laser & Mirrors is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
				<S.GridContainer
					role="grid"
					aria-label={t('aria.boardLabel')}
					aria-rowcount={rows}
					aria-colcount={cols}
					data-rows={rows}
					onKeyDown={handleKeyDown}
				>
					{grid.map((rowCells, r) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
						// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
						// biome-ignore lint/a11y/useFocusableInteractive: Row element in ARIA grid delegates focus to cell children via roving tabIndex
						<S.GridRow key={`lasers-row-${r}`} role="row" aria-rowindex={r + 1} data-cols={cols}>
							{rowCells.map((cell, c) => {
								const rotatable = isRotatableCell(cell) && !isSolved && !isPaused;
								const isFocused = focusedCoord.row === r && focusedCoord.col === c;
								const isHinted = hintedCoord?.row === r && hintedCoord?.col === c;
								const targetStatus = targetMap.get(`${r},${c}`);

								return (
									<S.CellButton
										key={`lasers-cell-${cell.row}-${cell.col}`}
										ref={(el) => {
											cellRefs.current.set(`${r},${c}`, el);
										}}
										type="button"
										// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
										role="gridcell"
										aria-colindex={c + 1}
										tabIndex={isFocused ? 0 : -1}
										aria-label={getCellAriaLabel(cell)}
										data-kind={cell.kind}
										data-rotatable={rotatable}
										data-hinted={isHinted}
										onFocus={() => {
											if (focusedCoord.row !== r || focusedCoord.col !== c) {
												onFocusCoord({ row: r, col: c });
											}
										}}
										onClick={() => {
											hasKeyboardFocusedRef.current = false;
											onFocusCoord({ row: r, col: c });
											if (rotatable) {
												onRotateCell({ row: r, col: c });
											}
										}}
									>
										{renderCellGraphic(cell, targetStatus, showColorSymbols)}
									</S.CellButton>
								);
							})}
						</S.GridRow>
					))}
				</S.GridContainer>
			</S.BoardViewport>
		</S.BoardFrame>
	);
}
