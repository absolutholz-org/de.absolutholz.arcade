import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardFrame = styled.div`
	container-type: inline-size;
	position: relative;
	width: 100%;
	max-width: min(30rem, calc(100dvh - var(--game-header-height, 3.5rem) - 16rem));
	aspect-ratio: 1;
	margin-inline: auto;
	min-height: 0;
	flex-shrink: 1;
	padding: 0.5rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	box-shadow: 0 4px 20px oklch(0% 0 0 / 0.08);
	touch-action: manipulation;

	@media (min-width: 640px) {
		max-width: min(32rem, calc(100dvh - var(--game-header-height, 3.5rem) - 12rem));
		padding: 0.75rem;
	}

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
	}
`;

/**
 * Visual (2N - 1) × (2N - 1) CSS Grid with dedicated gutter tracks for inequality chevrons.
 * Semantic N × N ARIA rows inherit column tracks via `subgrid`.
 */
export const GridRoot = styled.div`
	display: grid;
	width: 100%;
	height: 100%;

	&[data-size='4'] {
		grid-template-columns: repeat(3, minmax(0, 1fr) minmax(0.875rem, 0.34fr)) minmax(0, 1fr);
		grid-template-rows: repeat(3, minmax(0, 1fr) minmax(0.875rem, 0.34fr)) minmax(0, 1fr);
	}

	&[data-size='5'] {
		grid-template-columns: repeat(4, minmax(0, 1fr) minmax(0.875rem, 0.34fr)) minmax(0, 1fr);
		grid-template-rows: repeat(4, minmax(0, 1fr) minmax(0.875rem, 0.34fr)) minmax(0, 1fr);
	}

	&[data-size='6'] {
		grid-template-columns: repeat(5, minmax(0, 1fr) minmax(0.75rem, 0.34fr)) minmax(0, 1fr);
		grid-template-rows: repeat(5, minmax(0, 1fr) minmax(0.75rem, 0.34fr)) minmax(0, 1fr);
	}

	&[data-size='7'] {
		grid-template-columns: repeat(6, minmax(0, 1fr) minmax(0.6875rem, 0.34fr)) minmax(0, 1fr);
		grid-template-rows: repeat(6, minmax(0, 1fr) minmax(0.6875rem, 0.34fr)) minmax(0, 1fr);
	}

	&[data-paused='true'] {
		visibility: hidden;
		pointer-events: none;
	}
`;

export const SemanticRow = styled.div`
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: subgrid;
	align-items: stretch;
	justify-items: stretch;
`;

export const VerticalGutterRow = styled.div`
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: subgrid;
	align-items: center;
	justify-items: center;
	pointer-events: none;
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
	color: ${themeColor('accent')};
	font-family: inherit;
	font-variant-numeric: tabular-nums;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

	&[data-given='true'] {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
	}

	&[data-peer='true'] {
		background-color: color-mix(in oklch, ${themeColor('accent')} 10%, ${themeColor('surface')});
	}

	&[data-matching='true'] {
		background-color: color-mix(in oklch, ${themeColor('accent')} 20%, ${themeColor('surface')});
		border-color: color-mix(in oklch, ${themeColor('accent')} 50%, ${themeColor('container-2')});
	}

	&[data-selected='true'] {
		background-color: color-mix(in oklch, ${themeColor('accent')} 24%, ${themeColor('surface')});
		border-color: ${themeColor('accent')};
		box-shadow: inset 0 0 0 1px ${themeColor('accent')};
		z-index: 2;
	}

	&[data-hinted='true'] {
		border-color: ${themeColor('accent')};
		box-shadow: 0 0 0 2px color-mix(in oklch, ${themeColor('accent')} 35%, transparent);
	}

	&[data-error='true'] {
		background-color: color-mix(in oklch, ${themeColor('status-danger')} 16%, ${themeColor('surface')});
		border-color: ${themeColor('status-danger')};
		color: ${themeColor('status-danger')};
	}

	&:hover:not(:disabled) {
		border-color: ${themeColor('accent')};
	}

	${focusVisibleRing}

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
		color: CanvasText;

		&[data-given='true'] {
			font-weight: 800;
		}

		&[data-selected='true'] {
			border: 3px solid Highlight;
			outline: 2px solid Highlight;
			outline-offset: -3px;
		}

		&[data-error='true'] {
			border-style: dashed;
			border-color: Mark;
		}
	}
`;

export const CellDigit = styled.span`
	font-weight: 700;
	line-height: 1;
	font-size: clamp(1rem, 6cqi, 2rem);

	[data-size='6'] & {
		font-size: clamp(0.95rem, 5.2cqi, 1.75rem);
	}

	[data-size='7'] & {
		font-size: clamp(0.875rem, 4.4cqi, 1.5rem);
	}

	[data-given='true'] & {
		font-weight: 800;
	}
`;

export const ConflictCornerDot = styled.span`
	position: absolute;
	top: 0.1875rem;
	right: 0.1875rem;
	width: 0.375rem;
	height: 0.375rem;
	border-radius: 50%;
	background-color: ${themeColor('status-danger')};
	pointer-events: none;

	@media (forced-colors: active) {
		background-color: Mark;
		border: 1px solid CanvasText;
	}
`;

export const NotesGrid = styled.span`
	display: grid;
	width: 100%;
	height: 100%;
	padding: 0.0625rem;
	align-items: center;
	justify-items: center;
	pointer-events: none;

	&[data-size='4'] {
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
	}

	&[data-size='5'],
	&[data-size='6'] {
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
	}

	&[data-size='7'] {
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 1fr);
	}
`;

export const NoteDigit = styled.span`
	font-size: clamp(0.5rem, 2.2cqi, 0.75rem);
	font-weight: 600;
	line-height: 1;
	color: ${themeColor('text-2')};
	font-variant-numeric: tabular-nums;

	&[data-visible='false'] {
		visibility: hidden;
	}

	@media (forced-colors: active) {
		color: CanvasText;
	}
`;

export const InequalitySlot = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	color: ${themeColor('text-1')};
	pointer-events: none;

	&[data-violated='true'] {
		color: ${themeColor('status-danger')};
	}

	@media (forced-colors: active) {
		color: CanvasText;

		&[data-violated='true'] {
			color: Mark;
		}
	}
`;

export const InequalitySvg = styled.svg`
	width: clamp(0.625rem, 2.8cqi, 1.125rem);
	height: clamp(0.625rem, 2.8cqi, 1.125rem);
	display: block;
	overflow: visible;

	&[data-violated='true'] {
		transform: scale(1.15);
	}
`;

export const EmptyCornerSpacer = styled.span`
	display: block;
	width: 100%;
	height: 100%;
	pointer-events: none;
`;
