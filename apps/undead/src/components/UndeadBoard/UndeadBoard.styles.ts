import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardFrame = styled.div`
	container-type: inline-size;
	position: relative;
	width: 100%;
	max-width: min(30rem, calc(100dvh - var(--game-header-height, 3.5rem) - 18.5rem));
	aspect-ratio: 1;
	margin-inline: auto;
	min-height: 0;
	flex-shrink: 1;
	padding: 0.375rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	box-shadow: 0 4px 20px oklch(0% 0 0 / 0.08);
	touch-action: manipulation;

	@media (min-width: 640px) {
		max-width: min(33rem, calc(100dvh - var(--game-header-height, 3.5rem) - 15rem));
		padding: 0.625rem;
	}

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
	}
`;

/**
 * Outer (N + 2) × (N + 2) CSS Grid framing the 4N interactive edge clues
 * around the inner N × N WAI-ARIA mirror grid.
 */
export const OuterGrid = styled.div`
	display: grid;
	width: 100%;
	height: 100%;
	gap: 0.25rem;

	&[data-size='4'] {
		grid-template-columns: minmax(1.75rem, 0.72fr) repeat(4, minmax(0, 1fr)) minmax(1.75rem, 0.72fr);
		grid-template-rows: minmax(1.75rem, 0.72fr) repeat(4, minmax(0, 1fr)) minmax(1.75rem, 0.72fr);
	}

	&[data-size='5'] {
		grid-template-columns: minmax(1.75rem, 0.72fr) repeat(5, minmax(0, 1fr)) minmax(1.75rem, 0.72fr);
		grid-template-rows: minmax(1.75rem, 0.72fr) repeat(5, minmax(0, 1fr)) minmax(1.75rem, 0.72fr);
	}

	&[data-size='6'] {
		grid-template-columns: minmax(1.625rem, 0.72fr) repeat(6, minmax(0, 1fr)) minmax(1.625rem, 0.72fr);
		grid-template-rows: minmax(1.625rem, 0.72fr) repeat(6, minmax(0, 1fr)) minmax(1.625rem, 0.72fr);
	}

	&[data-size='7'] {
		grid-template-columns: minmax(1.5rem, 0.72fr) repeat(7, minmax(0, 1fr)) minmax(1.5rem, 0.72fr);
		grid-template-rows: minmax(1.5rem, 0.72fr) repeat(7, minmax(0, 1fr)) minmax(1.5rem, 0.72fr);
	}

	&[data-paused='true'] {
		visibility: hidden;
		pointer-events: none;
	}
`;

/**
 * Inner N × N WAI-ARIA grid inheriting the parent OuterGrid's exact column and row tracks via CSS Subgrid.
 */
export const InnerGrid = styled.div`
	position: relative;
	grid-column: 2 / -2;
	grid-row: 2 / -2;
	display: grid;
	/* Explicit fallback before subgrid per modern-web-guidance css-layout */
	grid-template-columns: repeat(4, minmax(0, 1fr));
	grid-template-rows: repeat(4, minmax(0, 1fr));
	grid-template-columns: subgrid;
	grid-template-rows: subgrid;
`;

export const SemanticRow = styled.div`
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	grid-template-columns: subgrid;
	align-items: stretch;
	justify-items: stretch;
`;

export const RayOverlaySvg = styled.svg`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 3;
	display: block;

	.ray-direct {
		stroke: ${themeColor('rainbow-7')};
		stroke-width: 7;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}

	.ray-reflected {
		stroke: ${themeColor('rainbow-2')};
		stroke-width: 7;
		stroke-dasharray: 14 10;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}

	.ray-node-direct {
		fill: ${themeColor('rainbow-7')};
	}

	.ray-node-reflected {
		fill: ${themeColor('rainbow-2')};
	}

	@media (forced-colors: active) {
		.ray-direct {
			stroke: Highlight;
		}
		.ray-reflected {
			stroke: CanvasText;
		}
		.ray-node-direct {
			fill: Highlight;
		}
		.ray-node-reflected {
			fill: CanvasText;
		}
	}
`;

export const ClueButton = styled.button`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-width: 24px;
	min-height: 24px;
	padding: 0;
	border: 1.5px solid transparent;
	border-radius: var(--radius-sm);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-family: inherit;
	font-size: clamp(0.8125rem, 3.2cqi, 1.125rem);
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	line-height: 1;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 120ms ease, border-color 120ms ease, opacity 120ms ease, color 120ms ease;

	&:hover {
		background-color: color-mix(in oklch, ${themeColor('accent')} 14%, ${themeColor('surface')});
		border-color: ${themeColor('accent')};
	}

	&[data-active-ray='true'] {
		background-color: color-mix(in oklch, ${themeColor('accent')} 20%, ${themeColor('surface')});
		border-color: ${themeColor('accent')};
		color: ${themeColor('accent')};
	}

	&[data-done='true'] {
		opacity: 0.42;
		text-decoration: line-through;
	}

	&[data-clue-status='satisfied'] {
		color: ${themeColor('status-success')};
	}

	&[data-clue-status='error'] {
		background-color: color-mix(in oklch, ${themeColor('status-danger')} 16%, ${themeColor('surface')});
		border-color: ${themeColor('status-danger')};
		color: ${themeColor('status-danger')};
		opacity: 1;
	}

	${focusVisibleRing};

	@media (forced-colors: active) {
		border: 1px solid ButtonBorder;
		background-color: Canvas;
		color: CanvasText;

		&[data-active-ray='true'],
		&[data-clue-status='error'] {
			border: 2px solid Highlight;
		}
	}
`;

export const ClueSubCount = styled.span`
	font-size: clamp(0.5625rem, 1.8cqi, 0.6875rem);
	font-weight: 600;
	color: ${themeColor('text-2')};
	line-height: 1;
	margin-top: 0.0625rem;
`;

export const CellButton = styled.button`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-width: 24px;
	min-height: 24px;
	padding: 0.125rem;
	border: 1.5px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-family: inherit;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 120ms ease, border-color 120ms ease;

	&[data-mirror='true'] {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
		cursor: default;
	}

	&[data-ray='direct'] {
		background-color: color-mix(
			in oklab,
			${themeColor('rainbow-7')} 18%,
			${themeColor('surface')}
		);
	}

	&[data-ray='reflected'] {
		background-color: color-mix(
			in oklab,
			${themeColor('rainbow-2')} 18%,
			${themeColor('surface')}
		);
	}

	&[data-ray='both'] {
		background-color: color-mix(
			in oklab,
			${themeColor('rainbow-5')} 20%,
			${themeColor('surface')}
		);
	}

	&[data-selected='true'] {
		border-color: ${themeColor('accent')};
		box-shadow: inset 0 0 0 2px ${themeColor('accent')};
		z-index: 2;
	}

	${focusVisibleRing};

	@media (forced-colors: active) {
		border: 1px solid ButtonBorder;
		background-color: Canvas;
		color: CanvasText;

		&[data-selected='true'] {
			border: 2px solid Highlight;
			outline: 2px solid Highlight;
		}
	}
`;

export const CellMonsterWrap = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 78%;
	height: 78%;
	z-index: 1;

	&[data-monster='ghost'] {
		color: ${themeColor('rainbow-12')};
	}

	&[data-monster='vampire'] {
		color: ${themeColor('rainbow-1')};
	}

	&[data-monster='zombie'] {
		color: ${themeColor('rainbow-3')};
	}

	> svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

export const CellMirrorWrap = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 82%;
	height: 82%;
	color: ${themeColor('text-1')};
	z-index: 1;

	> svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

export const NotesStrip = styled.span`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	align-items: center;
	justify-items: center;
	width: 92%;
	height: 55%;
	gap: 0.0625rem;
	z-index: 1;
`;

export const NotePip = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	opacity: 0.85;

	&[data-monster='ghost'] {
		color: ${themeColor('rainbow-12')};
	}

	&[data-monster='vampire'] {
		color: ${themeColor('rainbow-1')};
	}

	&[data-monster='zombie'] {
		color: ${themeColor('rainbow-3')};
	}

	> svg {
		width: 100%;
		height: 100%;
		max-width: 1.125rem;
		max-height: 1.125rem;
		display: block;
	}
`;

export const RayLegend = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	min-height: 1.25rem;
	font-size: 0.75rem;
	color: ${themeColor('text-2')};
`;

export const LegendItem = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
`;

export const LegendSwatch = styled.span`
	display: inline-block;
	width: 1.5rem;
	height: 0;

	&[data-kind='direct'] {
		border-top: 3px solid ${themeColor('rainbow-7')};
	}

	&[data-kind='reflected'] {
		border-top: 3px dashed ${themeColor('rainbow-2')};
	}

	@media (forced-colors: active) {
		&[data-kind='direct'] {
			border-top-color: Highlight;
		}
		&[data-kind='reflected'] {
			border-top-color: CanvasText;
		}
	}
`;
