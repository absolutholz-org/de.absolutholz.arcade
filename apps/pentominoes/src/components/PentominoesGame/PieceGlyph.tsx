import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
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
	stroke: oklch(from ${themeColor('text-1')} l c h / 0.85);
	stroke-width: 1.25;
	rx: 2px;
	ry: 2px;

	&[data-color='0'] { fill: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { fill: ${themeColor('rainbow-7')}; }
	&[data-color='2'] { fill: ${themeColor('rainbow-4')}; }
	&[data-color='3'] { fill: ${themeColor('rainbow-3')}; }
	&[data-color='4'] { fill: ${themeColor('rainbow-6')}; }
	&[data-color='5'] { fill: ${themeColor('rainbow-12')}; }
	&[data-color='6'] { fill: ${themeColor('rainbow-2')}; }
	&[data-color='7'] { fill: ${themeColor('rainbow-10')}; }
	&[data-color='8'] { fill: ${themeColor('rainbow-5')}; }
	&[data-color='9'] { fill: ${themeColor('rainbow-8')}; }
	&[data-color='10'] { fill: ${themeColor('rainbow-11')}; }
	&[data-color='11'] { fill: ${themeColor('rainbow-9')}; }
`;

const labelTextClass = css`
	font-size: 7px;
	font-weight: 800;
	fill: ${themeColor('text-1')};
	paint-order: stroke;
	stroke: oklch(from ${themeColor('surface')} l c h / 0.9);
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
