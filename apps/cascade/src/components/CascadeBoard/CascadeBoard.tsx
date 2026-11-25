import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, type KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
	type Board,
	type CellCoord,
	MEGA_CLUSTER_THRESHOLD,
	type RemovedTileInfo,
	type TileColor,
} from '../../engine/types';
import * as S from './CascadeBoard.styles';

export interface ParticleBurstEvent {
	readonly id: number;
	readonly tiles: readonly RemovedTileInfo[];
	readonly points: number;
	readonly isMega: boolean;
}

export interface CascadeBoardProps {
	readonly board: Board;
	readonly selectedCluster: readonly CellCoord[];
	readonly hoveredCluster: readonly CellCoord[];
	readonly orphanTiles: readonly CellCoord[];
	readonly previewPoints: number;
	readonly showTileSymbols: boolean;
	readonly showHoverPreview: boolean;
	readonly isPaused: boolean;
	readonly isGameOver: boolean;
	readonly focusedCoord: CellCoord;
	readonly lastBurst: ParticleBurstEvent | null;
	readonly onFocusCoord: (coord: CellCoord) => void;
	readonly onHoverCell: (coord: CellCoord | null) => void;
	readonly onActivateCell: (coord: CellCoord) => void;
	readonly onClearSelection: () => void;
	readonly onUndo: () => void;
	readonly onRedo: () => void;
	readonly onTogglePause: () => void;
}

const PARTICLE_CSS_VARS: Readonly<Record<TileColor, string>> = {
	0: '--color-rainbow-1',
	1: '--color-rainbow-2',
	2: '--color-rainbow-3',
	3: '--color-rainbow-4',
	4: '--color-rainbow-5',
};

function resolveParticleColor(color: TileColor): string {
	const styles = getComputedStyle(document.documentElement);
	return styles.getPropertyValue(PARTICLE_CSS_VARS[color]).trim() || styles.getPropertyValue('--color-accent').trim();
}

function renderTileShape(color: TileColor, shapeName: string): JSX.Element {
	return (
		<S.TileSymbol viewBox="0 0 24 24" aria-hidden="true">
			<title>{shapeName}</title>
			{color === 0 && <circle cx="12" cy="12" r="6.5" />}
			{color === 1 && <polygon points="12,4.5 19.5,18.5 4.5,18.5" />}
			{color === 2 && <rect x="6" y="6" width="12" height="12" rx="1.5" />}
			{color === 3 && <polygon points="12,4 20,12 12,20 4,12" />}
			{color === 4 && (
				<polygon points="12,3.5 14.5,9 20.5,9.5 16,13.5 17.5,19.5 12,16.2 6.5,19.5 8,13.5 3.5,9.5 9.5,9" />
			)}
		</S.TileSymbol>
	);
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	alpha: number;
	color: string;
	rotation: number;
	vRot: number;
}

export function CascadeBoard({
	board,
	selectedCluster,
	hoveredCluster,
	orphanTiles,
	previewPoints,
	showTileSymbols,
	showHoverPreview,
	isPaused,
	isGameOver,
	focusedCoord,
	lastBurst,
	onFocusCoord,
	onHoverCell,
	onActivateCell,
	onClearSelection,
	onUndo,
	onRedo,
	onTogglePause,
}: CascadeBoardProps): JSX.Element {
	const { t } = useI18n('cascade');
	const gridRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
	const prevPositionsRef = useRef<Map<number, { row: number; col: number }>>(new Map());
	const prevBurstIdRef = useRef<number>(0);

	const rows = board.length;
	const cols = board[0]?.length ?? 0;
	const gridKey = `${cols}x${rows}`;

	const selectedSet = useMemo(() => {
		const set = new Set<string>();
		for (const c of selectedCluster) set.add(`${c.row},${c.col}`);
		return set;
	}, [selectedCluster]);

	const hoveredSet = useMemo(() => {
		const set = new Set<string>();
		if (!showHoverPreview) return set;
		for (const c of hoveredCluster) set.add(`${c.row},${c.col}`);
		return set;
	}, [hoveredCluster, showHoverPreview]);

	const orphanSet = useMemo(() => {
		const set = new Set<string>();
		for (const c of orphanTiles) set.add(`${c.row},${c.col}`);
		return set;
	}, [orphanTiles]);

	// Compute floating preview badge anchor from active (selected or hovered) cluster
	const activePreviewCluster =
		selectedCluster.length >= 2
			? selectedCluster
			: showHoverPreview && hoveredCluster.length >= 2
				? hoveredCluster
				: [];

	const badgeAnchor = useMemo(() => {
		if (activePreviewCluster.length < 2 || rows === 0 || cols === 0) return null;
		let minRow = rows;
		let sumCol = 0;
		for (const coord of activePreviewCluster) {
			if (coord.row < minRow) minRow = coord.row;
			sumCol += coord.col;
		}
		const avgCol = sumCol / activePreviewCluster.length;
		const leftPct = Math.min(90, Math.max(10, ((avgCol + 0.5) / cols) * 100));
		const topPct = Math.max(12, ((minRow + 0.2) / rows) * 100);
		return { leftPct, topPct, size: activePreviewCluster.length };
	}, [activePreviewCluster, rows, cols]);

	// Smooth 180-220ms ease-out FLIP animation for vertical gravity drops & horizontal column shifts
	useLayoutEffect(() => {
		const nextPositions = new Map<number, { row: number; col: number }>();
		for (let r = 0; r < board.length; r += 1) {
			const rowArr = board[r];
			if (!rowArr) continue;
			for (let c = 0; c < rowArr.length; c += 1) {
				const tile = rowArr[c];
				if (tile) {
					nextPositions.set(tile.id, { row: r, col: c });
				}
			}
		}

		const prefersReducedMotion =
			typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!prefersReducedMotion && prevPositionsRef.current.size > 0 && cols > 0 && rows > 0) {
			const gridEl = gridRef.current;
			const cellWidth = gridEl ? gridEl.clientWidth / cols : 32;
			const cellHeight = gridEl ? gridEl.clientHeight / rows : 32;

			for (const [tileId, nextPos] of nextPositions.entries()) {
				const prevPos = prevPositionsRef.current.get(tileId);
				if (!prevPos) continue;
				const dRow = prevPos.row - nextPos.row;
				const dCol = prevPos.col - nextPos.col;
				if (dRow === 0 && dCol === 0) continue;

				const el = cellRefs.current.get(`${nextPos.row},${nextPos.col}`);
				if (el && typeof el.animate === 'function') {
					const dx = dCol * cellWidth;
					const dy = dRow * cellHeight;
					// Slightly longer duration when shifting horizontally too
					const duration = dCol !== 0 ? 230 : 185;
					el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0px, 0px)' }], {
						duration,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
					});
				}
			}
		}

		prevPositionsRef.current = nextPositions;
	}, [board, cols, rows]);

	// Lightweight canvas particle burst animation on tile removal
	useEffect(() => {
		if (!lastBurst || lastBurst.id === prevBurstIdRef.current) return;
		prevBurstIdRef.current = lastBurst.id;

		const prefersReducedMotion =
			typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.max(1, Math.floor(rect.width * dpr));
		canvas.height = Math.max(1, Math.floor(rect.height * dpr));
		ctx.scale(dpr, dpr);

		const cellW = cols > 0 ? rect.width / cols : 32;
		const cellH = rows > 0 ? rect.height / rows : 32;
		const particlesPerTile = lastBurst.isMega ? 6 : 4;
		const particles: Particle[] = [];

		for (const tile of lastBurst.tiles) {
			const cx = (tile.col + 0.5) * cellW;
			const cy = (tile.row + 0.5) * cellH;
			const color = resolveParticleColor(tile.color);

			for (let i = 0; i < particlesPerTile; i += 1) {
				const angle = (Math.PI * 2 * i) / particlesPerTile + Math.random() * 0.6;
				const speed = (lastBurst.isMega ? 2.4 : 1.6) + Math.random() * 2.2;
				particles.push({
					x: cx,
					y: cy,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed - 1.2,
					size: (lastBurst.isMega ? 5.5 : 4) + Math.random() * 2.5,
					alpha: 1,
					color,
					rotation: Math.random() * Math.PI,
					vRot: (Math.random() - 0.5) * 0.25,
				});
			}
		}

		let frameId = 0;
		const render = () => {
			ctx.clearRect(0, 0, rect.width, rect.height);
			let alive = false;
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.14;
				p.alpha -= 0.032;
				p.rotation += p.vRot;
				if (p.alpha > 0) {
					alive = true;
					ctx.save();
					ctx.globalAlpha = Math.max(0, p.alpha);
					ctx.translate(p.x, p.y);
					ctx.rotate(p.rotation);
					ctx.fillStyle = p.color;
					ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
					ctx.restore();
				}
			}
			if (alive) {
				frameId = window.requestAnimationFrame(render);
			} else {
				ctx.clearRect(0, 0, rect.width, rect.height);
			}
		};

		frameId = window.requestAnimationFrame(render);
		return () => {
			window.cancelAnimationFrame(frameId);
			ctx.clearRect(0, 0, rect.width, rect.height);
		};
	}, [lastBurst, cols, rows]);

	const moveFocus = (nextRow: number, nextCol: number) => {
		const clampedRow = Math.max(0, Math.min(rows - 1, nextRow));
		const clampedCol = Math.max(0, Math.min(cols - 1, nextCol));
		onFocusCoord({ row: clampedRow, col: clampedCol });
		const target = cellRefs.current.get(`${clampedRow},${clampedCol}`);
		target?.focus();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
			event.preventDefault();
			if (event.shiftKey) {
				onRedo();
			} else {
				onUndo();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				moveFocus(row - 1, col);
				break;
			case 'ArrowDown':
				event.preventDefault();
				moveFocus(row + 1, col);
				break;
			case 'ArrowLeft':
				event.preventDefault();
				moveFocus(row, col - 1);
				break;
			case 'ArrowRight':
				event.preventDefault();
				moveFocus(row, col + 1);
				break;
			case 'Escape':
				event.preventDefault();
				onClearSelection();
				break;
			case 'p':
			case 'P':
				event.preventDefault();
				onTogglePause();
				break;
			default:
				break;
		}
	};

	return (
		<S.BoardFrame data-grid={gridKey} data-mega-pulse={lastBurst?.isMega ? 'true' : 'false'}>
			<S.BoardViewport data-paused={isPaused ? 'true' : 'false'} onMouseLeave={() => onHoverCell(null)}>
				<S.GridContainer
					ref={gridRef}
					data-rows={String(rows)}
					// biome-ignore lint/a11y/useSemanticElements: Cascade is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
					role="grid"
					aria-label={t('aria.boardLabel', { cols, rows })}
					aria-rowcount={rows}
					aria-colcount={cols}
				>
					{board.map((rowCells, r) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
						// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
						// biome-ignore lint/a11y/useFocusableInteractive: Row element in ARIA grid delegates focus to cell children via roving tabIndex
						<S.GridRow key={`cascade-row-${r}`} data-cols={String(cols)} role="row" aria-rowindex={r + 1}>
							{rowCells.map((tile, c) => {
								const coordKey = `${r},${c}`;
								const isSelected = selectedSet.has(coordKey);
								const isHovered = hoveredSet.has(coordKey) && !isSelected;
								const isOrphan = isGameOver && orphanSet.has(coordKey);
								const isFocused = focusedCoord.row === r && focusedCoord.col === c;

								const colorName = tile ? t(`colors.c${tile.color}` as 'colors.c0') : '';
								const shapeName = tile ? t(`shapes.s${tile.color}` as 'shapes.s0') : '';
								let ariaLabel = tile
									? t('aria.tileLabel', {
											row: r + 1,
											col: c + 1,
											color: colorName,
											shape: shapeName,
										})
									: t('aria.emptyCell', { row: r + 1, col: c + 1 });

								if (isSelected) {
									ariaLabel = `${ariaLabel}, ${t('aria.selectedState', {
										count: selectedCluster.length,
										points: previewPoints,
									})}`;
								} else if (isOrphan) {
									ariaLabel = `${ariaLabel}, ${t('aria.orphanState')}`;
								}

								return (
									<S.CellButton
										// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
										key={`cascade-cell-${r}-${c}`}
										ref={(node) => {
											if (node) {
												cellRefs.current.set(coordKey, node);
											} else {
												cellRefs.current.delete(coordKey);
											}
										}}
										type="button"
										// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
										role="gridcell"
										aria-colindex={c + 1}
										aria-label={ariaLabel}
										aria-pressed={tile ? isSelected : undefined}
										tabIndex={isFocused ? 0 : -1}
										data-empty={tile ? 'false' : 'true'}
										data-color={tile ? String(tile.color) : undefined}
										data-selected={isSelected ? 'true' : 'false'}
										data-hovered={isHovered ? 'true' : 'false'}
										data-orphan={isOrphan ? 'true' : 'false'}
										disabled={isPaused}
										onFocus={() => onFocusCoord({ row: r, col: c })}
										onMouseEnter={() => {
											if (!isPaused && !isGameOver && tile) {
												onHoverCell({ row: r, col: c });
											} else {
												onHoverCell(null);
											}
										}}
										onClick={() => {
											if (!isPaused && !isGameOver) {
												onFocusCoord({ row: r, col: c });
												onActivateCell({ row: r, col: c });
											}
										}}
										onKeyDown={(e) => handleKeyDown(e, r, c)}
									>
										{tile && showTileSymbols && renderTileShape(tile.color, shapeName)}
									</S.CellButton>
								);
							})}
						</S.GridRow>
					))}
				</S.GridContainer>

				<S.ParticleCanvas ref={canvasRef} aria-hidden="true" />

				{badgeAnchor && !isPaused && !isGameOver && (
					<S.FloatingPreviewBadge
						data-mega={badgeAnchor.size >= MEGA_CLUSTER_THRESHOLD ? 'true' : 'false'}
						style={{
							left: `${badgeAnchor.leftPct}%`,
							top: `${badgeAnchor.topPct}%`,
						}}
						aria-hidden="true"
					>
						{t('hud.potentialValue', { points: previewPoints.toLocaleString() })}
					</S.FloatingPreviewBadge>
				)}

				{lastBurst?.isMega && !isPaused && (
					<S.MegaToastBanner key={lastBurst.id} aria-hidden="true">
						{t('hud.megaChain', { points: lastBurst.points.toLocaleString() })}
					</S.MegaToastBanner>
				)}
			</S.BoardViewport>
		</S.BoardFrame>
	);
}
