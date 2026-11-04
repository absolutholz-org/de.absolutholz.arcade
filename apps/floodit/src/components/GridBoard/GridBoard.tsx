import { styled } from '@linaria/react';
import type { JSX } from 'react';
import type { ColorIndex, Grid } from '../../engine/types.ts';

interface GridBoardProps {
	readonly grid: Grid;
	readonly size: number;
	readonly showColorblindShapes: boolean;
	readonly currentColor: ColorIndex;
	readonly floodedCluster: ReadonlySet<string>;
	readonly id?: string;
}

const BoardFrame = styled.section`
	display: block;
	width: 100%;
	max-width: 32rem;
	margin: 0 auto;
	aspect-ratio: 1 / 1;
	padding: 0.5rem;
	background: var(--floodit-board-bg, light-dark(oklch(0.96 0.01 260), oklch(0.2 0.02 260)));
	border: 2px solid var(--floodit-board-border, light-dark(oklch(0.84 0.02 260), oklch(0.35 0.03 260)));
	border-radius: 0.75rem;
	box-shadow: light-dark(0 0.25rem 0.75rem rgba(0, 0, 0, 0.08), 0 0.25rem 1rem rgba(0, 0, 0, 0.3));
`;

const BoardGrid = styled.div`
	display: grid;
	width: 100%;
	height: 100%;
	gap: 1px;
	background: var(--floodit-cell-border, light-dark(oklch(0.88 0.01 260), oklch(0.25 0.02 260)));
	border-radius: 0.375rem;
	overflow: hidden;

	&[data-size='8'] {
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
	}

	&[data-size='10'] {
		grid-template-columns: repeat(10, 1fr);
		grid-template-rows: repeat(10, 1fr);
	}

	&[data-size='14'] {
		grid-template-columns: repeat(14, 1fr);
		grid-template-rows: repeat(14, 1fr);
	}

	&[data-size='18'] {
		grid-template-columns: repeat(18, 1fr);
		grid-template-rows: repeat(18, 1fr);
	}
`;

const CellDiv = styled.div`
	display: grid;
	place-items: center;
	user-select: none;
	transition: background-color 0.15s ease-out;

	&[data-color='0'] {
		background-color: var(--floodit-color-0);
		color: var(--floodit-color-0-fg);
	}
	&[data-color='1'] {
		background-color: var(--floodit-color-1);
		color: var(--floodit-color-1-fg);
	}
	&[data-color='2'] {
		background-color: var(--floodit-color-2);
		color: var(--floodit-color-2-fg);
	}
	&[data-color='3'] {
		background-color: var(--floodit-color-3);
		color: var(--floodit-color-3-fg);
	}
	&[data-color='4'] {
		background-color: var(--floodit-color-4);
		color: var(--floodit-color-4-fg);
	}
	&[data-color='5'] {
		background-color: var(--floodit-color-5);
		color: var(--floodit-color-5-fg);
	}

	&[data-flooded='true'] {
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
	}
`;

const ShapeSymbolSpan = styled.span`
	font-size: 0.75rem;
	line-height: 1;
	font-weight: 900;
	opacity: 0.85;
	pointer-events: none;
`;

const SHAPE_GLYPHS: Record<ColorIndex, string> = {
	0: '●',
	1: '▲',
	2: '■',
	3: '◆',
	4: '★',
	5: '✚',
};

export function GridBoard({
	grid,
	size,
	showColorblindShapes,
	floodedCluster,
	id = 'floodit-grid',
}: GridBoardProps): JSX.Element {
	return (
		<BoardFrame id={id} aria-label="Flood-It game board">
			<BoardGrid data-size={String(size)}>
				{grid.map((row, r) => {
					const rowKey = row.join('-');
					return (
						<div key={`floodit-row-${r}-${rowKey}`} style={{ display: 'contents' }}>
							{row.map((color, c) => {
								const key = `${r},${c}`;
								const isFlooded = floodedCluster.has(key);
								return (
									<CellDiv
										key={`floodit-cell-${key}`}
										data-color={String(color)}
										data-flooded={isFlooded ? 'true' : 'false'}
										aria-label={`Row ${r + 1}, Column ${c + 1}: Color ${color + 1}${isFlooded ? ' (controlled)' : ''}`}
									>
										{showColorblindShapes && (
											<ShapeSymbolSpan aria-hidden="true">{SHAPE_GLYPHS[color]}</ShapeSymbolSpan>
										)}
									</CellDiv>
								);
							})}
						</div>
					);
				})}
			</BoardGrid>
		</BoardFrame>
	);
}
