import type { CompiledBoardLayout, CoordinateKey, GameStatus } from '../../engine/types.js';
import * as S from './SoloNobleBoard.styles.js';

export interface SoloNobleBoardProps {
	layout: CompiledBoardLayout;
	board: Record<CoordinateKey, boolean>;
	status: GameStatus;
	selectedHole: CoordinateKey | null;
	validTargets: Set<CoordinateKey>;
	onCellClick: (holeKey: CoordinateKey) => void;
}

export function SoloNobleBoard({
	layout,
	board,
	status,
	selectedHole,
	validTargets,
	onCellClick,
}: SoloNobleBoardProps) {
	const isTriangular = layout.definition.id === 'triangular';
	const gridCols = isTriangular ? 9 : layout.definition.gridWidth;
	const gridRows = layout.definition.gridHeight;

	return (
		<S.BoardWrapper>
			{/* biome-ignore lint/a11y/useSemanticElements: APG interactive grid pattern on responsive container */}
			<S.BoardSurface
				role="grid"
				aria-label={layout.definition.name}
				style={{
					gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
					gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
				}}
			>
				{layout.definition.holes.map((hole) => {
					const key: CoordinateKey = `${hole.row},${hole.col}`;
					const hasPeg = Boolean(board[key]);
					const isSelected = selectedHole === key;
					const isValidTarget = validTargets.has(key);
					const isInteractive = status === 'ready' || hasPeg || isValidTarget;

					const gridRow = hole.row + 1;
					const gridColumn = isTriangular ? 4 - hole.row + hole.col * 2 + 1 : hole.col + 1;

					let stateLabel = 'Empty hole';
					if (hasPeg) {
						stateLabel = isSelected ? 'Selected peg' : 'Peg';
					} else if (isValidTarget) {
						stateLabel = 'Valid jump destination';
					}

					return (
						<S.CellButton
							key={key}
							type="button"
							style={{ gridRow, gridColumn }}
							data-has-peg={hasPeg ? 'true' : 'false'}
							data-selected={isSelected ? 'true' : 'false'}
							data-valid-target={isValidTarget ? 'true' : 'false'}
							disabled={!isInteractive}
							aria-pressed={isSelected}
							aria-label={`Row ${hole.row + 1}, Column ${hole.col + 1}, ${stateLabel}`}
							onClick={() => onCellClick(key)}
						/>
					);
				})}
			</S.BoardSurface>
		</S.BoardWrapper>
	);
}
