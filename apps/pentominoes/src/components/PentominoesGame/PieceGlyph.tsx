import { css } from '@linaria/core';
import type { JSX } from 'react';
import { getPieceDefinition, getTransformedShape } from '../../engine/pieces.ts';
import type { PieceId, Rotation } from '../../engine/types.ts';

const previewSvgClass = css`
	display: block;
	width: 3.25rem;
	height: 3.25rem;
	overflow: visible;
`;

const cellRectClass = css`
	stroke: light-dark(oklch(0.22 0.02 260 / 0.85), oklch(0.95 0.01 260 / 0.85));
	stroke-width: 1.25;
	rx: 2px;
	ry: 2px;

	&[data-color='0'] {
		fill: light-dark(oklch(0.62 0.19 25), oklch(0.66 0.19 25));
	}
	&[data-color='1'] {
		fill: light-dark(oklch(0.66 0.16 55), oklch(0.7 0.16 55));
	}
	&[data-color='2'] {
		fill: light-dark(oklch(0.75 0.16 85), oklch(0.78 0.16 85));
	}
	&[data-color='3'] {
		fill: light-dark(oklch(0.65 0.17 135), oklch(0.69 0.17 135));
	}
	&[data-color='4'] {
		fill: light-dark(oklch(0.62 0.15 165), oklch(0.67 0.15 165));
	}
	&[data-color='5'] {
		fill: light-dark(oklch(0.63 0.14 195), oklch(0.68 0.14 195));
	}
	&[data-color='6'] {
		fill: light-dark(oklch(0.58 0.17 230), oklch(0.65 0.17 230));
	}
	&[data-color='7'] {
		fill: light-dark(oklch(0.55 0.19 260), oklch(0.64 0.18 260));
	}
	&[data-color='8'] {
		fill: light-dark(oklch(0.58 0.2 290), oklch(0.66 0.19 290));
	}
	&[data-color='9'] {
		fill: light-dark(oklch(0.6 0.2 320), oklch(0.68 0.19 320));
	}
	&[data-color='10'] {
		fill: light-dark(oklch(0.62 0.19 350), oklch(0.68 0.18 350));
	}
	&[data-color='11'] {
		fill: light-dark(oklch(0.64 0.14 110), oklch(0.7 0.14 110));
	}
`;

const labelTextClass = css`
	font-size: 7px;
	font-weight: 800;
	fill: light-dark(oklch(0.14 0.02 260), oklch(0.98 0.01 260));
	paint-order: stroke;
	stroke: light-dark(oklch(0.98 0.01 260 / 0.9), oklch(0.15 0.02 260 / 0.9));
	stroke-width: 2px;
	text-anchor: middle;
	dominant-baseline: central;
	pointer-events: none;
`;

export interface PieceGlyphProps {
	readonly pieceId: PieceId;
	readonly rotation?: Rotation;
	readonly flipped?: boolean;
	readonly showLabel?: boolean;
	readonly title: string;
}

export function PieceGlyph({
	pieceId,
	rotation = 0,
	flipped = false,
	showLabel = true,
	title,
}: PieceGlyphProps): JSX.Element {
	const def = getPieceDefinition(pieceId);
	const shape = getTransformedShape(pieceId, rotation, flipped);
	const cellSize = 10;
	const offsetX = ((5 - shape.width) * cellSize) / 2;
	const offsetY = ((5 - shape.height) * cellSize) / 2;
	const colorAttr = String(def.colorIndex % 12);

	return (
		<svg viewBox="0 0 50 50" className={previewSvgClass} role="img" aria-label={title}>
			<title>{title}</title>
			{shape.cells.map((cell) => {
				const x = offsetX + cell.col * cellSize;
				const y = offsetY + cell.row * cellSize;
				const isLabelCell = showLabel && cell.row === shape.labelCell.row && cell.col === shape.labelCell.col;

				return (
					<g key={`${pieceId}-${cell.row}-${cell.col}`}>
						<rect
							x={x + 0.5}
							y={y + 0.5}
							width={cellSize - 1}
							height={cellSize - 1}
							className={cellRectClass}
							data-color={colorAttr}
						/>
						{isLabelCell && (
							<text x={x + cellSize / 2} y={y + cellSize / 2} className={labelTextClass}>
								{def.label}
							</text>
						)}
					</g>
				);
			})}
		</svg>
	);
}
