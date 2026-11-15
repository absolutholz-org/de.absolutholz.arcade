import {
	type JSX,
	type KeyboardEvent as ReactKeyboardEvent,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import type { Edge, Vertex } from '../../engine/types.ts';
import * as S from './UntangleCanvas.styles.js';

export interface UntangleCanvasProps {
	vertices: readonly Vertex[];
	edges: readonly Edge[];
	intersectingEdgeKeys: ReadonlySet<string>;
	nodeCrossingCounts: Readonly<Record<string, number>>;
	nodeDegreeCounts: Readonly<Record<string, number>>;
	selectedVertexId: string | null;
	draggingVertexId: string | null;
	highlightCrossings: boolean;
	disabled: boolean;
	ariaLabel: string;
	getNodeAriaLabel: (index: number, connections: number, crossings: number) => string;
	onSelectVertex: (vertexId: string | null) => void;
	onDragStart: (vertexId: string) => void;
	onDragMove: (vertexId: string, x: number, y: number) => void;
	onDragEnd: (vertexId: string, x: number, y: number) => void;
	onKeyNudge: (vertexId: string, dx: number, dy: number) => void;
}

const VIEWBOX_SIZE = 1000;
const VERTEX_RADIUS = 32;
const VERTEX_HIT_RADIUS = 56;
const PADDING = 40;

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

function isEdgeIntersecting(
	intersectingEdgeKeys: ReadonlySet<string>,
	u: string,
	v: string,
	edgeIndex: number,
): boolean {
	const dashKey = u < v ? `${u}-${v}` : `${v}-${u}`;
	const colonKey = u < v ? `${u}:${v}` : `${v}:${u}`;
	return (
		intersectingEdgeKeys.has(dashKey) ||
		intersectingEdgeKeys.has(colonKey) ||
		intersectingEdgeKeys.has(`${u}-${v}`) ||
		intersectingEdgeKeys.has(`${v}-${u}`) ||
		intersectingEdgeKeys.has(`${u}:${v}`) ||
		intersectingEdgeKeys.has(`${v}:${u}`) ||
		intersectingEdgeKeys.has(String(edgeIndex))
	);
}

export function UntangleCanvas({
	vertices,
	edges,
	intersectingEdgeKeys,
	nodeCrossingCounts,
	nodeDegreeCounts,
	selectedVertexId,
	draggingVertexId,
	highlightCrossings,
	disabled,
	ariaLabel,
	getNodeAriaLabel,
	onSelectVertex,
	onDragStart,
	onDragMove,
	onDragEnd,
	onKeyNudge,
}: UntangleCanvasProps): JSX.Element {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const activePointerRef = useRef<{ pointerId: number; vertexId: string } | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const pendingMoveRef = useRef<{ vertexId: string; x: number; y: number } | null>(null);

	const isNormalized = useMemo(
		() => vertices.length > 0 && vertices.every((v) => v.x >= 0 && v.x <= 1 && v.y >= 0 && v.y <= 1),
		[vertices],
	);

	const vertexMap = useMemo(() => {
		const map = new Map<string, Vertex>();
		for (const vertex of vertices) {
			map.set(vertex.id, vertex);
		}
		return map;
	}, [vertices]);

	useEffect(() => {
		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	const clientToBoardCoords = useCallback(
		(clientX: number, clientY: number): { x: number; y: number } | null => {
			const svg = svgRef.current;
			if (!svg) {
				return null;
			}
			const rect = svg.getBoundingClientRect();
			if (rect.width <= 0 || rect.height <= 0) {
				return null;
			}
			const ratioX = (clientX - rect.left) / rect.width;
			const ratioY = (clientY - rect.top) / rect.height;

			if (isNormalized) {
				const minRatio = PADDING / VIEWBOX_SIZE;
				const maxRatio = 1 - minRatio;
				return {
					x: clamp(ratioX, minRatio, maxRatio),
					y: clamp(ratioY, minRatio, maxRatio),
				};
			}

			return {
				x: clamp(ratioX * VIEWBOX_SIZE, PADDING, VIEWBOX_SIZE - PADDING),
				y: clamp(ratioY * VIEWBOX_SIZE, PADDING, VIEWBOX_SIZE - PADDING),
			};
		},
		[isNormalized],
	);

	const resolveTargetVertexId = useCallback(
		(clientX: number, clientY: number, fallbackVertexId: string): string => {
			const coords = clientToBoardCoords(clientX, clientY);
			if (!coords) {
				return fallbackVertexId;
			}
			const fallbackVertex = vertexMap.get(fallbackVertexId);
			if (!fallbackVertex) {
				return fallbackVertexId;
			}
			const fx = isNormalized ? fallbackVertex.x * VIEWBOX_SIZE : fallbackVertex.x;
			const fy = isNormalized ? fallbackVertex.y * VIEWBOX_SIZE : fallbackVertex.y;
			const cx = isNormalized ? coords.x * VIEWBOX_SIZE : coords.x;
			const cy = isNormalized ? coords.y * VIEWBOX_SIZE : coords.y;
			const fallbackDist = Math.hypot(fx - cx, fy - cy);

			// Only disambiguate overlapping hit halos when the pointer is within the hit radius of the clicked group
			if (fallbackDist > VERTEX_HIT_RADIUS) {
				return fallbackVertexId;
			}

			let closestId = fallbackVertexId;
			let closestDist = fallbackDist;
			for (const vertex of vertices) {
				const vx = isNormalized ? vertex.x * VIEWBOX_SIZE : vertex.x;
				const vy = isNormalized ? vertex.y * VIEWBOX_SIZE : vertex.y;
				const dist = Math.hypot(vx - cx, vy - cy);
				if (dist < closestDist) {
					closestDist = dist;
					closestId = vertex.id;
				}
			}
			return closestId;
		},
		[clientToBoardCoords, isNormalized, vertexMap, vertices],
	);

	const handleVertexPointerDown = useCallback(
		(event: ReactPointerEvent<SVGGElement>, vertexId: string) => {
			if (disabled) {
				return;
			}
			event.stopPropagation();
			const targetVertexId = resolveTargetVertexId(event.clientX, event.clientY, vertexId);
			event.currentTarget.setPointerCapture(event.pointerId);
			activePointerRef.current = { pointerId: event.pointerId, vertexId: targetVertexId };
			onSelectVertex(targetVertexId);
			onDragStart(targetVertexId);
		},
		[disabled, onDragStart, onSelectVertex, resolveTargetVertexId],
	);

	const handleVertexPointerMove = useCallback(
		(event: ReactPointerEvent<SVGGElement>) => {
			const active = activePointerRef.current;
			if (disabled || !active || active.pointerId !== event.pointerId) {
				return;
			}
			const coords = clientToBoardCoords(event.clientX, event.clientY);
			if (!coords) {
				return;
			}
			pendingMoveRef.current = { vertexId: active.vertexId, x: coords.x, y: coords.y };
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(() => {
					rafIdRef.current = null;
					const pending = pendingMoveRef.current;
					if (pending) {
						pendingMoveRef.current = null;
						onDragMove(pending.vertexId, pending.x, pending.y);
					}
				});
			}
		},
		[clientToBoardCoords, disabled, onDragMove],
	);

	const finishPointerDrag = useCallback(
		(event: ReactPointerEvent<SVGGElement>) => {
			const active = activePointerRef.current;
			if (!active || active.pointerId !== event.pointerId) {
				return;
			}
			const targetVertexId = active.vertexId;
			if (event.currentTarget.hasPointerCapture(event.pointerId)) {
				event.currentTarget.releasePointerCapture(event.pointerId);
			}
			activePointerRef.current = null;
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			pendingMoveRef.current = null;

			const coords = clientToBoardCoords(event.clientX, event.clientY);
			if (coords) {
				onDragEnd(targetVertexId, coords.x, coords.y);
			} else {
				const existing = vertexMap.get(targetVertexId);
				if (existing) {
					onDragEnd(targetVertexId, existing.x, existing.y);
				}
			}
		},
		[clientToBoardCoords, onDragEnd, vertexMap],
	);

	const handleVertexKeyDown = useCallback(
		(event: ReactKeyboardEvent<SVGGElement>, vertexId: string) => {
			if (disabled) {
				return;
			}

			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onSelectVertex(selectedVertexId === vertexId ? null : vertexId);
				return;
			}

			const step = isNormalized ? (event.shiftKey ? 0.05 : 0.015) : event.shiftKey ? 40 : 12;

			switch (event.key) {
				case 'ArrowUp':
					event.preventDefault();
					onSelectVertex(vertexId);
					onKeyNudge(vertexId, 0, -step);
					break;
				case 'ArrowDown':
					event.preventDefault();
					onSelectVertex(vertexId);
					onKeyNudge(vertexId, 0, step);
					break;
				case 'ArrowLeft':
					event.preventDefault();
					onSelectVertex(vertexId);
					onKeyNudge(vertexId, -step, 0);
					break;
				case 'ArrowRight':
					event.preventDefault();
					onSelectVertex(vertexId);
					onKeyNudge(vertexId, step, 0);
					break;
			}
		},
		[disabled, isNormalized, onKeyNudge, onSelectVertex, selectedVertexId],
	);

	const activeVertexId = draggingVertexId ?? selectedVertexId;

	return (
		<S.CanvasContainer>
			<S.BoardSvg
				ref={svgRef}
				viewBox="0 0 1000 1000"
				// biome-ignore lint/a11y/useSemanticElements: SVG canvas cannot be replaced by HTML table or fieldset
				role="group"
				aria-label={ariaLabel}
				onPointerDown={() => {
					if (!disabled && selectedVertexId !== null) {
						onSelectVertex(null);
					}
				}}
			>
				<g data-layer="edges">
					{edges.map(([u, v], edgeIndex) => {
						const source = vertexMap.get(u);
						const target = vertexMap.get(v);
						if (!source || !target) {
							return null;
						}
						const x1 = isNormalized ? source.x * VIEWBOX_SIZE : source.x;
						const y1 = isNormalized ? source.y * VIEWBOX_SIZE : source.y;
						const x2 = isNormalized ? target.x * VIEWBOX_SIZE : target.x;
						const y2 = isNormalized ? target.y * VIEWBOX_SIZE : target.y;
						const intersecting =
							highlightCrossings && isEdgeIntersecting(intersectingEdgeKeys, u, v, edgeIndex);
						const connectedToActive =
							activeVertexId !== null && (u === activeVertexId || v === activeVertexId);

						return (
							<S.EdgeLine
								key={`${u}-${v}`}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								data-intersecting={intersecting ? 'true' : 'false'}
								data-connected={connectedToActive ? 'true' : 'false'}
							/>
						);
					})}
				</g>

				<g data-layer="vertices">
					{vertices.map((vertex, idx) => {
						const cx = isNormalized ? vertex.x * VIEWBOX_SIZE : vertex.x;
						const cy = isNormalized ? vertex.y * VIEWBOX_SIZE : vertex.y;
						const vertexIndex =
							'index' in vertex && typeof vertex.index === 'number' ? vertex.index : idx + 1;
						const degree = nodeDegreeCounts[vertex.id] ?? 0;
						const crossings = nodeCrossingCounts[vertex.id] ?? 0;
						const isSelected = selectedVertexId === vertex.id;
						const isDragging = draggingVertexId === vertex.id;
						const hasCrossings = highlightCrossings && crossings > 0;

						return (
							<S.VertexGroup
								key={vertex.id}
								transform={`translate(${cx}, ${cy})`}
								// biome-ignore lint/a11y/useSemanticElements: SVG group element cannot be replaced by HTML button
								role="button"
								tabIndex={disabled ? -1 : 0}
								aria-label={getNodeAriaLabel(vertexIndex, degree, crossings)}
								aria-pressed={isSelected}
								data-disabled={disabled ? 'true' : 'false'}
								data-dragging={isDragging ? 'true' : 'false'}
								onPointerDown={(e: ReactPointerEvent<SVGGElement>) =>
									handleVertexPointerDown(e, vertex.id)
								}
								onPointerMove={handleVertexPointerMove}
								onPointerUp={finishPointerDrag}
								onPointerCancel={finishPointerDrag}
								onKeyDown={(e: ReactKeyboardEvent<SVGGElement>) => handleVertexKeyDown(e, vertex.id)}
							>
								<S.HitCircle r={VERTEX_HIT_RADIUS} />
								<S.FocusRing
									data-focus-ring="true"
									data-visible={isSelected || isDragging ? 'true' : 'false'}
									r={VERTEX_RADIUS + 8}
								/>
								<S.VertexCircle
									r={VERTEX_RADIUS}
									data-has-crossings={hasCrossings ? 'true' : 'false'}
									data-selected={isSelected ? 'true' : 'false'}
									data-dragging={isDragging ? 'true' : 'false'}
								/>
								<S.VertexLabel data-active={isSelected || isDragging ? 'true' : 'false'}>
									{vertexIndex}
								</S.VertexLabel>
							</S.VertexGroup>
						);
					})}
				</g>
			</S.BoardSvg>
		</S.CanvasContainer>
	);
}
