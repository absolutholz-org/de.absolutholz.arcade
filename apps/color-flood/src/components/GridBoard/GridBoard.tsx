import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
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
	background: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: 0.75rem;
	box-shadow: light-dark(0 0.25rem 0.75rem rgba(0, 0, 0, 0.08), 0 0.25rem 1rem rgba(0, 0, 0, 0.3));
`;

const BoardGrid = styled.div`
	display: grid;
	width: 100%;
	height: 100%;
	gap: 1px;
	background: ${themeColor('container-2')};
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

	&[data-color='0'] { --flood-color: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { --flood-color: ${themeColor('rainbow-4')}; }
	&[data-color='2'] { --flood-color: ${themeColor('rainbow-3')}; }
	&[data-color='3'] { --flood-color: ${themeColor('rainbow-6')}; }
	&[data-color='4'] { --flood-color: ${themeColor('rainbow-2')}; }
	&[data-color='5'] { --flood-color: ${themeColor('rainbow-5')}; }

	&[data-color] {
		background-color: var(--flood-color);
		color: oklch(from var(--flood-color) clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
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
	id = 'color-flood-grid',
}: GridBoardProps): JSX.Element {
	return (
		<BoardFrame id={id} aria-label="Color Flood game board">
			<BoardGrid data-size={String(size)}>
				{grid.map((row, r) => {
					const rowKey = row.join('-');
					return (
						<div key={`color-flood-row-${r}-${rowKey}`} style={{ display: 'contents' }}>
							{row.map((color, c) => {
								const key = `${r},${c}`;
								const isFlooded = floodedCluster.has(key);
								return (
									<CellDiv
										key={`color-flood-cell-${key}`}
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
