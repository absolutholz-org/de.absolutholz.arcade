import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardFrame = styled.div`
	position: relative;
	width: 100%;
	max-width: min(30rem, calc(100dvh - var(--game-header-height, 3.5rem) - 16.5rem));
	aspect-ratio: 1;
	margin-inline: auto;
	min-height: 0;
	flex-shrink: 1;
	padding: 0.75rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 2px dashed ${themeColor('container-2')};
	box-shadow: 0 4px 20px oklch(0% 0 0 / 0.08);
	touch-action: none;
	user-select: none;
	cursor: crosshair;

	@media (min-width: 640px) {
		max-width: min(33rem, calc(100dvh - var(--game-header-height, 3.5rem) - 13rem));
		padding: 1rem;
	}

	&[data-paused='true'] {
		cursor: default;
	}

	@media (forced-colors: active) {
		border: 2px dashed ButtonBorder;
		background-color: Canvas;
	}
`;

export const MapViewport = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: var(--radius-sm);
	overflow: hidden;
	background-color: ${themeColor('surface')};

	&[data-paused='true'] {
		visibility: hidden;
		pointer-events: none;
	}
`;

export const MapSvg = styled.svg`
	display: block;
	width: 100%;
	height: 100%;
	pointer-events: none;
`;

export const RegionPath = styled.path`
	transition: fill 120ms ease, opacity 120ms ease;

	&[data-color='empty'] {
		fill: ${themeColor('surface')};
	}

	&[data-color='0'] { fill: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { fill: ${themeColor('rainbow-4')}; }
	&[data-color='2'] { fill: ${themeColor('rainbow-3')}; }
	&[data-color='3'] { fill: ${themeColor('rainbow-2')}; }

	&[data-drop-target='true'] {
		opacity: 0.78;
	}

	@media (forced-colors: active) {
		&[data-color='empty'] {
			fill: Canvas;
		}
		&[data-color='0'],
		&[data-color='1'],
		&[data-color='2'],
		&[data-color='3'] {
			fill: Canvas;
		}
	}
`;

export const ConflictHatchPath = styled.path`
	fill: url(#cm-conflict-hatch);
	pointer-events: none;
`;

export const InternalBorders = styled.path`
	fill: none;
	stroke: ${themeColor('text-1')};
	stroke-linecap: square;
	stroke-linejoin: miter;
	pointer-events: none;

	@media (forced-colors: active) {
		stroke: CanvasText;
	}
`;

export const OuterBorder = styled.rect`
	fill: none;
	stroke: ${themeColor('text-1')};
	pointer-events: none;

	@media (forced-colors: active) {
		stroke: CanvasText;
	}
`;

export const ConflictBorder = styled.path`
	fill: none;
	stroke: ${themeColor('status-danger')};
	stroke-linecap: round;
	pointer-events: none;

	@media (forced-colors: active) {
		stroke: Mark;
	}
`;

export const ShapeSymbol = styled.g`
	pointer-events: none;

	&[data-color='0'] { --sym-color: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { --sym-color: ${themeColor('rainbow-4')}; }
	&[data-color='2'] { --sym-color: ${themeColor('rainbow-3')}; }
	&[data-color='3'] { --sym-color: ${themeColor('rainbow-2')}; }

	&[data-color] {
		fill: oklch(from var(--sym-color) clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
	}

	@media (forced-colors: active) {
		fill: CanvasText;
	}
`;

export const LockRing = styled.circle`
	fill: none;
	stroke-dasharray: 0.16 0.12;
	pointer-events: none;

	&[data-color='0'] { --ring-color: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { --ring-color: ${themeColor('rainbow-4')}; }
	&[data-color='2'] { --ring-color: ${themeColor('rainbow-3')}; }
	&[data-color='3'] { --ring-color: ${themeColor('rainbow-2')}; }

	&[data-color] {
		stroke: oklch(from var(--ring-color) clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h / 0.75);
	}

	@media (forced-colors: active) {
		stroke: CanvasText;
	}
`;

export const CandidateDot = styled.circle`
	stroke: ${themeColor('text-1')};
	pointer-events: none;

	&[data-color='0'] { fill: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { fill: ${themeColor('rainbow-4')}; }
	&[data-color='2'] { fill: ${themeColor('rainbow-3')}; }
	&[data-color='3'] { fill: ${themeColor('rainbow-2')}; }

	@media (forced-colors: active) {
		fill: CanvasText;
		stroke: Canvas;
	}
`;

export const DragPreviewLine = styled.line`
	stroke: ${themeColor('text-1')};
	stroke-dasharray: 0.25 0.2;
	stroke-linecap: round;
	opacity: 0.75;
	pointer-events: none;

	@media (forced-colors: active) {
		stroke: Highlight;
	}
`;

export const DragPreviewBadge = styled.circle`
	stroke: ${themeColor('surface')};
	pointer-events: none;

	&[data-tool='0'] {
		fill: light-dark(oklch(0.66 0.19 28), oklch(0.56 0.19 28));
	}
	&[data-tool='1'] {
		fill: light-dark(oklch(0.84 0.16 88), oklch(0.76 0.16 88));
	}
	&[data-tool='2'] {
		fill: light-dark(oklch(0.70 0.15 162), oklch(0.55 0.15 162));
	}
	&[data-tool='3'] {
		fill: light-dark(oklch(0.55 0.18 255), oklch(0.52 0.18 255));
	}
	&[data-tool='eraser'] {
		fill: ${themeColor('surface')};
		stroke: ${themeColor('text-1')};
	}
`;

export const AccessibleOverlay = styled.div`
	position: absolute;
	inset: 0;
	pointer-events: none;
`;

export const RegionFocusAnchor = styled.button`
	position: absolute;
	transform: translate(-50%, -50%);
	width: 1.5rem;
	height: 1.5rem;
	min-width: 24px;
	min-height: 24px;
	padding: 0;
	border: 2px solid transparent;
	border-radius: 50%;
	background-color: transparent;
	color: transparent;
	pointer-events: none;
	cursor: pointer;

	&:focus-visible {
		pointer-events: auto;
		border-color: ${themeColor('accent')};
		background-color: color-mix(in oklch, ${themeColor('accent')} 18%, transparent);
	}

	${focusVisibleRing}

	@media (forced-colors: active) {
		&:focus-visible {
			border: 3px solid Highlight;
			background-color: transparent;
		}
	}
`;
