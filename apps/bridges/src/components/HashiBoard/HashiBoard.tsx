import type { JSX } from 'react';
import { useMemo } from 'react';
import { HashiBridge } from '../HashiBridge/index.js';
import { HashiIsland } from '../HashiIsland/index.js';
import * as S from './HashiBoard.styles.js';
import type { HashiBoardProps } from './HashiBoard.types.js';

const CELL_SPACING = 50;
const PADDING = 35;

export function HashiBoard({
	board,
	selectedIslandId,
	focusedIslandId,
	highlightSatisfied,
	highlightOverflow,
	getIslandEvaluation,
	onIslandClick,
	onIslandFocus,
	onIslandKeyDown,
	onBridgeClick,
}: HashiBoardProps): JSX.Element {
	const svgWidth = (board.width - 1) * CELL_SPACING + PADDING * 2;
	const svgHeight = (board.height - 1) * CELL_SPACING + PADDING * 2;

	const islandMap = useMemo(() => {
		return new Map(board.islands.map((isl) => [isl.id, isl]));
	}, [board.islands]);

	// Background subtle grid dots
	const gridDots = useMemo(() => {
		const dots: { x: number; y: number }[] = [];
		for (let y = 0; y < board.height; y++) {
			for (let x = 0; x < board.width; x++) {
				dots.push({
					x: PADDING + x * CELL_SPACING,
					y: PADDING + y * CELL_SPACING,
				});
			}
		}
		return dots;
	}, [board.width, board.height]);

	return (
		<S.BoardWrapper>
			<S.SvgCanvas
				viewBox={`0 0 ${svgWidth} ${svgHeight}`}
				// biome-ignore lint/a11y/useSemanticElements: SVG canvas cannot be replaced by HTML table
				role="grid"
				aria-label={`Bridges board ${board.width} by ${board.height}`}
			>
				{/* Background subtle grid dots */}
				<g className="grid-dots">
					{gridDots.map((dot) => (
						<S.GridDot key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={1.5} />
					))}
				</g>

				{/* Layer 1: Bridges (underneath islands) */}
				<g className="bridges-layer">
					{board.bridges.map((bridge) => {
						const fromIsland = islandMap.get(bridge.fromId);
						const toIsland = islandMap.get(bridge.toId);
						if (!fromIsland || !toIsland) return null;

						return (
							<HashiBridge
								key={bridge.id}
								bridge={bridge}
								fromIsland={fromIsland}
								toIsland={toIsland}
								cellSpacing={CELL_SPACING}
								padding={PADDING}
								onClick={onBridgeClick}
							/>
						);
					})}
				</g>

				{/* Layer 2: Islands (above bridges) */}
				<g className="islands-layer">
					{board.islands.map((island) => {
						const evaluation = getIslandEvaluation(island.id);
						const isSelected = selectedIslandId === island.id;
						const isFocused = focusedIslandId === island.id;

						return (
							<HashiIsland
								key={island.id}
								island={island}
								evaluation={evaluation}
								isSelected={isSelected}
								isFocused={isFocused}
								highlightSatisfied={highlightSatisfied}
								highlightOverflow={highlightOverflow}
								cellSpacing={CELL_SPACING}
								padding={PADDING}
								onClick={onIslandClick}
								onFocus={onIslandFocus}
								onKeyDown={onIslandKeyDown}
							/>
						);
					})}
				</g>
			</S.SvgCanvas>
		</S.BoardWrapper>
	);
}
