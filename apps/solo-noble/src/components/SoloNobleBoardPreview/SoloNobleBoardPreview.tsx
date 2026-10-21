import type { JSX } from 'react';
import { BOARD_DEFINITIONS } from '../../engine/layouts.js';
import type { BoardLayoutId, GameVariant } from '../../engine/types.js';
import * as S from './SoloNobleBoardPreview.styles.js';

interface SoloNobleBoardPreviewProps {
	layoutId: BoardLayoutId;
	variant: GameVariant;
}

export function SoloNobleBoardPreview({ layoutId, variant }: SoloNobleBoardPreviewProps): JSX.Element {
	const layout = BOARD_DEFINITIONS[layoutId];
	const isTriangular = layout.id === 'triangular';
	const is9x9 = layoutId === 'diamond' || layoutId === 'wiegleb';

	const centerRow = layout.centerHole?.row ?? (is9x9 ? 4 : 3);
	const centerCol = layout.centerHole?.col ?? (is9x9 ? 4 : 3);

	return (
		<S.PreviewSvg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
			<rect width="64" height="64" rx="8" fill="var(--theme-container-2, #e5e7eb)" />
			{layout.holes.map((hole) => {
				let cx = 0;
				let cy = 0;
				let radius = 2.4;

				if (isTriangular) {
					// 5 rows: 0..4
					cy = 10 + hole.row * 11;
					cx = 32 + (hole.col - hole.row / 2) * 11;
					radius = 3;
				} else if (is9x9) {
					// 9x9 grid (0..8)
					cx = 8 + hole.col * 6;
					cy = 8 + hole.row * 6;
					radius = 2.2;
				} else {
					// 7x7 grid (0..6)
					cx = 8 + hole.col * 8;
					cy = 8 + hole.row * 8;
					radius = 2.8;
				}

				const isCenter = hole.row === centerRow && hole.col === centerCol;

				// Classic Central: center is empty
				// Clear out: center is empty
				// Custom Start: center is highlighted as customizable
				const isEmpty = (variant === 'classic-central' || variant === 'clear-out') && isCenter;

				if (isEmpty) {
					return (
						<circle
							key={`${hole.row},${hole.col}`}
							cx={cx}
							cy={cy}
							r={radius}
							fill="var(--theme-surface, #f8fafc)"
							stroke="var(--theme-border, #cbd5e1)"
							strokeWidth="0.8"
						/>
					);
				}

				if (variant === 'custom-start' && isCenter) {
					return (
						<g key={`${hole.row},${hole.col}`}>
							<circle cx={cx} cy={cy} r={radius} fill="var(--theme-accent, #ef4444)" />
							<circle
								cx={cx}
								cy={cy}
								r={radius + 1.2}
								fill="none"
								stroke="var(--theme-accent, #f59e0b)"
								strokeWidth="0.8"
								strokeDasharray="1.5 1.5"
							/>
						</g>
					);
				}

				return (
					<circle
						key={`${hole.row},${hole.col}`}
						cx={cx}
						cy={cy}
						r={radius}
						fill="var(--theme-accent, #ef4444)"
					/>
				);
			})}
		</S.PreviewSvg>
	);
}
