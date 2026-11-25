import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, type KeyboardEvent, type PointerEvent, useMemo, useRef, useState } from 'react';
import { buildRegionBorders, buildRegionFillPaths } from '../../engine/adjacency';
import type { ColorIndex, ColorMapPuzzle, ColorMapSettings, ConflictSummary, RegionInfo } from '../../engine/types';
import * as S from './ColorMapBoard.styles';

export interface ColorMapBoardProps {
	readonly puzzle: ColorMapPuzzle;
	readonly colors: readonly (ColorIndex | null)[];
	readonly candidates: readonly (readonly ColorIndex[])[];
	readonly conflicts: ConflictSummary;
	readonly settings: ColorMapSettings;
	readonly focusedRegionId: number;
	readonly isPencilMode: boolean;
	readonly isPaused: boolean;
	readonly isComplete: boolean;
	readonly onFocusRegion: (regionId: number) => void;
	readonly onTapRegion: (regionId: number) => void;
	readonly onApplyColor: (regionId: number, color: ColorIndex) => void;
	readonly onToggleCandidate: (regionId: number, color: ColorIndex) => void;
	readonly onEraseRegion: (regionId: number) => void;
	readonly onTogglePencilMode: () => void;
	readonly onUndo: () => void;
	readonly onRedo: () => void;
	readonly onTogglePause: () => void;
}

interface DragState {
	readonly kind: 'region' | 'erase';
	readonly startRegionId: number | null;
	readonly startColor: ColorIndex | null;
	readonly isPencilDrag: boolean;
	readonly startClientX: number;
	readonly startClientY: number;
	readonly startSvgX: number;
	readonly startSvgY: number;
	readonly currentSvgX: number;
	readonly currentSvgY: number;
	readonly hoveredRegionId: number | null;
	readonly moved: boolean;
}

const CANDIDATE_OFFSETS: Readonly<Record<ColorIndex, readonly [number, number]>> = {
	0: [-0.26, -0.26],
	1: [0.26, -0.26],
	2: [-0.26, 0.26],
	3: [0.26, 0.26],
};

function findDirectionalRegion(regions: readonly RegionInfo[], currentId: number, dr: number, dc: number): number {
	const current = regions[currentId];
	if (!current) return currentId;

	const pickBest = (candidates: readonly number[]): number | null => {
		let bestId: number | null = null;
		let bestScore = Number.POSITIVE_INFINITY;

		for (const id of candidates) {
			if (id === currentId) continue;
			const target = regions[id];
			const dy = target.labelAnchor.row - current.labelAnchor.row;
			const dx = target.labelAnchor.col - current.labelAnchor.col;
			const forward = dy * dr + dx * dc;
			if (forward <= 0) continue;

			const perp = Math.abs(dy * dc - dx * dr);
			const score = forward + perp * 1.8;
			if (score < bestScore) {
				bestScore = score;
				bestId = id;
			}
		}

		return bestId;
	};

	// Prefer direct bordering neighbors first, then fall back to any region in that direction
	const neighborMatch = pickBest(current.neighbors);
	if (neighborMatch !== null) return neighborMatch;

	const allIds = regions.map((r) => r.id);
	return pickBest(allIds) ?? currentId;
}

export function ColorMapBoard({
	puzzle,
	colors,
	candidates,
	conflicts,
	settings,
	focusedRegionId,
	isPencilMode,
	isPaused,
	isComplete,
	onFocusRegion,
	onTapRegion,
	onApplyColor,
	onToggleCandidate,
	onEraseRegion,
	onTogglePencilMode,
	onUndo,
	onRedo,
	onTogglePause,
}: ColorMapBoardProps): JSX.Element {
	const { t } = useI18n('color-map');
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [dragState, setDragState] = useState<DragState | null>(null);

	const regionFillPaths = useMemo(
		() => buildRegionFillPaths(puzzle.regionGrid, puzzle.regions.length),
		[puzzle.regionGrid, puzzle.regions.length],
	);

	const borders = useMemo(() => buildRegionBorders(puzzle.regionGrid), [puzzle.regionGrid]);

	const gridSize = puzzle.gridSize;
	const strokeWidth = Math.max(0.06, gridSize * 0.0055);
	const conflictStrokeWidth = strokeWidth * 2.2;

	const mapPointToGrid = (clientX: number, clientY: number) => {
		const el = viewportRef.current;
		if (!el) return { svgX: 0, svgY: 0, regionId: null as number | null, inside: false };
		const rect = el.getBoundingClientRect();
		const relX = (clientX - rect.left) / rect.width;
		const relY = (clientY - rect.top) / rect.height;
		const svgX = relX * gridSize;
		const svgY = relY * gridSize;
		const inside = relX >= 0 && relX < 1 && relY >= 0 && relY < 1;
		if (!inside) {
			return { svgX, svgY, regionId: null as number | null, inside: false };
		}
		const col = Math.min(gridSize - 1, Math.max(0, Math.floor(svgX)));
		const row = Math.min(gridSize - 1, Math.max(0, Math.floor(svgY)));
		return { svgX, svgY, regionId: puzzle.regionGrid[row][col], inside: true };
	};

	const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
		if (isPaused || isComplete) return;
		if (e.button !== 0 && e.button !== 2) return;

		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);

		const hit = mapPointToGrid(e.clientX, e.clientY);
		if (!hit.inside || hit.regionId === null) {
			setDragState({
				kind: 'erase',
				startRegionId: null,
				startColor: null,
				isPencilDrag: false,
				startClientX: e.clientX,
				startClientY: e.clientY,
				startSvgX: hit.svgX,
				startSvgY: hit.svgY,
				currentSvgX: hit.svgX,
				currentSvgY: hit.svgY,
				hoveredRegionId: null,
				moved: true,
			});
			return;
		}

		onFocusRegion(hit.regionId);
		const startColor = colors[hit.regionId] ?? null;

		setDragState({
			kind: 'region',
			startRegionId: hit.regionId,
			startColor,
			isPencilDrag: e.button === 2 || isPencilMode,
			startClientX: e.clientX,
			startClientY: e.clientY,
			startSvgX: hit.svgX,
			startSvgY: hit.svgY,
			currentSvgX: hit.svgX,
			currentSvgY: hit.svgY,
			hoveredRegionId: hit.regionId,
			moved: false,
		});
	};

	const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
		if (!dragState) return;
		const hit = mapPointToGrid(e.clientX, e.clientY);
		const dist = Math.hypot(e.clientX - dragState.startClientX, e.clientY - dragState.startClientY);
		setDragState((prev) =>
			prev
				? {
						...prev,
						currentSvgX: hit.svgX,
						currentSvgY: hit.svgY,
						hoveredRegionId: hit.regionId,
						moved: prev.moved || dist > 6,
					}
				: null,
		);
	};

	const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
		if (!dragState) return;
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}

		const hit = mapPointToGrid(e.clientX, e.clientY);
		const targetRegionId = hit.regionId;

		if (dragState.kind === 'erase') {
			if (targetRegionId !== null) {
				onFocusRegion(targetRegionId);
				onEraseRegion(targetRegionId);
			}
		} else if (dragState.startRegionId !== null) {
			if (dragState.moved && targetRegionId !== null && targetRegionId !== dragState.startRegionId) {
				onFocusRegion(targetRegionId);
				if (dragState.startColor !== null) {
					if (dragState.isPencilDrag) {
						onToggleCandidate(targetRegionId, dragState.startColor);
					} else {
						onApplyColor(targetRegionId, dragState.startColor);
					}
				}
			} else if (!dragState.moved) {
				onTapRegion(dragState.startRegionId);
			}
		}

		setDragState(null);
	};

	const handlePointerCancel = () => {
		setDragState(null);
	};

	const moveFocusToRegion = (nextId: number) => {
		onFocusRegion(nextId);
		buttonRefs.current[nextId]?.focus();
	};

	const handleRegionKeyDown = (regionId: number, e: KeyboardEvent<HTMLButtonElement>) => {
		if (isPaused) {
			if (e.key === 'Escape') {
				e.preventDefault();
				onTogglePause();
			}
			return;
		}

		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				moveFocusToRegion(findDirectionalRegion(puzzle.regions, regionId, -1, 0));
				return;
			case 'ArrowDown':
				e.preventDefault();
				moveFocusToRegion(findDirectionalRegion(puzzle.regions, regionId, 1, 0));
				return;
			case 'ArrowLeft':
				e.preventDefault();
				moveFocusToRegion(findDirectionalRegion(puzzle.regions, regionId, 0, -1));
				return;
			case 'ArrowRight':
				e.preventDefault();
				moveFocusToRegion(findDirectionalRegion(puzzle.regions, regionId, 0, 1));
				return;
			case 'Backspace':
			case 'Delete':
			case '0':
				e.preventDefault();
				onEraseRegion(regionId);
				return;
			case 'p':
			case 'P':
				e.preventDefault();
				onTogglePencilMode();
				return;
			case 'z':
			case 'Z':
				e.preventDefault();
				onUndo();
				return;
			case 'y':
			case 'Y':
				e.preventDefault();
				onRedo();
				return;
			case 'Escape':
				e.preventDefault();
				onTogglePause();
				return;
			case 'Enter':
			case ' ':
				e.preventDefault();
				onTapRegion(regionId);
				return;
			default:
				break;
		}

		// Handle 1-4 and Shift+1-4 reliably across international keyboard layouts via e.code
		const digitMatch = /^Digit([1-4])$/.exec(e.code) ?? /^([1-4])$/.exec(e.key);
		if (digitMatch) {
			e.preventDefault();
			const colorIdx = (Number.parseInt(digitMatch[1], 10) - 1) as ColorIndex;
			if (e.shiftKey || isPencilMode) {
				onToggleCandidate(regionId, colorIdx);
			} else {
				onApplyColor(regionId, colorIdx);
			}
		}
	};

	const getRegionAriaLabel = (region: RegionInfo): string => {
		const parts: string[] = [t('aria.regionLabel', { id: region.id + 1 })];
		const color = colors[region.id];
		const isLocked = puzzle.givens[region.id] !== null;

		if (color !== null) {
			parts.push(
				t('aria.regionColor', {
					color: t(`colors.c${color}` as 'colors.c0'),
					shape: t(`shapes.s${color}` as 'shapes.s0'),
				}),
			);
		} else {
			parts.push(t('aria.regionUncolored'));
			const regionCands = candidates[region.id];
			if (regionCands && regionCands.length > 0) {
				const list = regionCands.map((c) => t(`colors.c${c}` as 'colors.c0')).join(', ');
				parts.push(t('aria.regionCandidates', { list }));
			}
		}

		if (isLocked) {
			parts.push(t('aria.regionLocked'));
		}

		if (settings.highlightConflicts && conflicts.conflictingRegions.has(region.id)) {
			parts.push(t('aria.regionConflict'));
		}

		if (region.neighbors.length > 0) {
			const neighborIds = region.neighbors.map((n) => n + 1).join(', ');
			parts.push(t('aria.regionNeighbors', { neighbors: neighborIds }));
		}

		return parts.join(', ');
	};

	const showDragVisual =
		dragState?.moved &&
		(dragState.kind === 'erase' || (dragState.kind === 'region' && dragState.startColor !== null));

	const boardAriaLabel = t('aria.boardMap', { count: puzzle.regions.length });

	return (
		<S.BoardFrame
			data-paused={isPaused ? 'true' : 'false'}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			onContextMenu={(e) => e.preventDefault()}
		>
			<S.MapViewport ref={viewportRef} data-paused={isPaused ? 'true' : 'false'}>
				<S.MapSvg viewBox={`0 0 ${gridSize} ${gridSize}`} aria-hidden="true">
					<title>{boardAriaLabel}</title>
					<defs>
						<pattern
							id="cm-conflict-hatch"
							width={Math.max(0.45, gridSize * 0.03)}
							height={Math.max(0.45, gridSize * 0.03)}
							patternUnits="userSpaceOnUse"
							patternTransform="rotate(45)"
						>
							<line
								x1="0"
								y1="0"
								x2="0"
								y2={Math.max(0.45, gridSize * 0.03)}
								stroke="var(--color-status-danger)"
								strokeWidth={Math.max(0.1, gridSize * 0.008)}
								strokeOpacity="0.65"
							/>
						</pattern>
					</defs>

					{/* Region fills */}
					{puzzle.regions.map((region) => {
						const color = colors[region.id];
						const isDropTarget =
							showDragVisual &&
							dragState?.hoveredRegionId === region.id &&
							puzzle.givens[region.id] === null;

						return (
							<S.RegionPath
								key={`region-fill-${region.id}`}
								d={regionFillPaths[region.id]}
								data-color={color === null ? 'empty' : String(color)}
								data-drop-target={isDropTarget ? 'true' : 'false'}
							/>
						);
					})}

					{/* Conflict hatch overlay */}
					{settings.highlightConflicts &&
						puzzle.regions.map((region) => {
							if (!conflicts.conflictingRegions.has(region.id)) return null;
							return (
								<S.ConflictHatchPath
									key={`region-conflict-${region.id}`}
									d={regionFillPaths[region.id]}
								/>
							);
						})}

					{/* Crisp region borders */}
					<S.InternalBorders d={borders.internalBorderPath} strokeWidth={strokeWidth} />

					{/* Highlighted conflicting shared borders */}
					{settings.highlightConflicts &&
						Array.from(conflicts.conflictingPairs).map((pairKey) => {
							const edgePath = borders.sharedEdgePaths.get(pairKey);
							if (!edgePath) return null;
							return (
								<S.ConflictBorder
									key={`conflict-edge-${pairKey}`}
									d={edgePath}
									strokeWidth={conflictStrokeWidth}
									strokeDasharray={`${strokeWidth * 3} ${strokeWidth * 2}`}
								/>
							);
						})}

					{/* Outer border */}
					<S.OuterBorder
						x={strokeWidth / 2}
						y={strokeWidth / 2}
						width={gridSize - strokeWidth}
						height={gridSize - strokeWidth}
						strokeWidth={strokeWidth * 1.4}
					/>

					{/* Symbols, locked clue rings, and candidate dots */}
					{puzzle.regions.map((region) => {
						const cx = region.labelAnchor.col + 0.5;
						const cy = region.labelAnchor.row + 0.5;
						const color = colors[region.id];
						const isLocked = puzzle.givens[region.id] !== null;
						const baseScale = Math.min(region.anchorRadius * 0.65, gridSize * 0.065);
						const fontSize = Math.max(0.55, Math.min(1.5, baseScale));

						if (color !== null) {
							const r = fontSize * 0.28;
							return (
								<g key={`region-marker-${region.id}`}>
									{isLocked && (
										<S.LockRing
											cx={cx}
											cy={cy}
											r={fontSize * 0.52}
											strokeWidth={Math.max(0.06, fontSize * 0.09)}
											data-color={String(color)}
										/>
									)}
									{settings.showColorblindShapes && (
										<S.ShapeSymbol data-color={String(color)}>
											{color === 0 && <circle cx={cx} cy={cy} r={r} />}
											{color === 1 && (
												<polygon
													points={`${cx},${cy - r * 1.05} ${cx + r * 1.05},${cy + r * 0.85} ${cx - r * 1.05},${cy + r * 0.85}`}
												/>
											)}
											{color === 2 && (
												<rect
													x={cx - r * 0.88}
													y={cy - r * 0.88}
													width={r * 1.76}
													height={r * 1.76}
													rx={r * 0.14}
												/>
											)}
											{color === 3 && (
												<polygon
													points={`${cx},${cy - r * 1.12} ${cx + r * 1.12},${cy} ${cx},${cy + r * 1.12} ${cx - r * 1.12},${cy}`}
												/>
											)}
										</S.ShapeSymbol>
									)}
								</g>
							);
						}

						const regionCandidates = candidates[region.id];
						if (!regionCandidates || regionCandidates.length === 0) return null;

						const dotSpread = Math.max(0.32, Math.min(0.68, baseScale * 0.55));
						const dotRadius = Math.max(0.16, Math.min(0.3, dotSpread * 0.45));

						return (
							<g key={`region-candidates-${region.id}`}>
								{regionCandidates.map((candColor) => {
									const [ox, oy] = CANDIDATE_OFFSETS[candColor];
									return (
										<S.CandidateDot
											key={`cand-${region.id}-${candColor}`}
											cx={cx + ox * dotSpread * 2}
											cy={cy + oy * dotSpread * 2}
											r={dotRadius}
											strokeWidth={Math.max(0.03, dotRadius * 0.22)}
											data-color={String(candColor)}
										/>
									);
								})}
							</g>
						);
					})}

					{/* Drag-to-copy visual feedback */}
					{showDragVisual && dragState && (
						<g>
							<S.DragPreviewLine
								x1={dragState.startSvgX}
								y1={dragState.startSvgY}
								x2={dragState.currentSvgX}
								y2={dragState.currentSvgY}
								strokeWidth={strokeWidth * 1.4}
							/>
							<S.DragPreviewBadge
								cx={dragState.currentSvgX}
								cy={dragState.currentSvgY}
								r={Math.max(0.35, gridSize * 0.025)}
								strokeWidth={strokeWidth}
								data-tool={dragState.kind === 'erase' ? 'eraser' : String(dragState.startColor)}
							/>
						</g>
					)}
				</S.MapSvg>

				{/* Keyboard-accessible region focus layer with roving tabindex */}
				{/* biome-ignore lint/a11y/useSemanticElements: Interactive SVG map region overlay uses role="group" with roving tabindex */}
				<S.AccessibleOverlay role="group" aria-label={boardAriaLabel}>
					{puzzle.regions.map((region) => {
						const leftPct = ((region.labelAnchor.col + 0.5) / gridSize) * 100;
						const topPct = ((region.labelAnchor.row + 0.5) / gridSize) * 100;

						return (
							<S.RegionFocusAnchor
								key={`region-btn-${region.id}`}
								ref={(el) => {
									buttonRefs.current[region.id] = el;
								}}
								type="button"
								data-color-map-region="true"
								tabIndex={focusedRegionId === region.id ? 0 : -1}
								aria-label={getRegionAriaLabel(region)}
								style={{ left: `${leftPct}%`, top: `${topPct}%` }}
								onFocus={() => onFocusRegion(region.id)}
								onKeyDown={(e) => handleRegionKeyDown(region.id, e)}
							/>
						);
					})}
				</S.AccessibleOverlay>
			</S.MapViewport>
		</S.BoardFrame>
	);
}
