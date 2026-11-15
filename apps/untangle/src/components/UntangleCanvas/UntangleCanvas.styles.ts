import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const CanvasContainer = styled.div`
	position: relative;
	width: 100%;
	max-width: 42.5rem;
	aspect-ratio: 1 / 1;
	margin: 0 auto;
	background: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-lg);
	overflow: hidden;
	touch-action: none;
	user-select: none;
`;

export const BoardSvg = styled.svg`
	display: block;
	width: 100%;
	height: 100%;
	touch-action: none;
`;

export const EdgeLine = styled.line`
	stroke-linecap: round;
	transition: stroke 120ms ease, opacity 120ms ease;
	pointer-events: none;
	stroke: light-dark(oklch(0.55 0.18 145), oklch(0.7 0.18 145));
	stroke-width: 3.5;
	stroke-dasharray: none;
	opacity: 0.78;

	&[data-connected='true'] {
		stroke: ${themeColor('accent')};
		stroke-width: 5;
		opacity: 1;
	}

	&[data-intersecting='true'] {
		stroke: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		stroke-width: 4.5;
		stroke-dasharray: 10 6;
		opacity: 0.92;
	}

	&[data-intersecting='true'][data-connected='true'] {
		stroke: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		stroke-width: 5.5;
		stroke-dasharray: 10 6;
		opacity: 1;
	}
`;

export const VertexGroup = styled.g`
	cursor: grab;
	outline: none;
	touch-action: none;

	&[data-disabled='true'] {
		cursor: default;
	}

	&[data-dragging='true'] {
		cursor: grabbing;
	}

	&:focus-visible > circle[data-focus-ring='true'] {
		opacity: 1;
	}
`;

export const HitCircle = styled.circle`
	fill: transparent;
	pointer-events: all;
`;

export const FocusRing = styled.circle`
	fill: none;
	stroke: ${themeColor('accent')};
	stroke-width: 4;
	stroke-dasharray: 6 4;
	opacity: 0;
	pointer-events: none;
	transition: opacity 120ms ease;

	&[data-visible='true'] {
		opacity: 1;
	}
`;

export const VertexCircle = styled.circle`
	fill: light-dark(oklch(0.4 0.14 145), oklch(0.38 0.13 145));
	stroke: light-dark(${themeColor('surface')}, oklch(0.78 0.17 145));
	stroke-width: 4;
	transition: fill 120ms ease, stroke 120ms ease, transform 120ms ease;

	&[data-has-crossings='true'] {
		fill: light-dark(oklch(0.43 0.19 25), oklch(0.4 0.17 25));
		stroke: light-dark(${themeColor('surface')}, oklch(0.76 0.18 25));
	}

	&[data-selected='true'],
	&[data-dragging='true'] {
		fill: ${themeColor('accent')};
		stroke: ${themeColor('accent-contrast')};
	}
`;

export const VertexLabel = styled.text`
	fill: oklch(0.99 0 0);
	font-size: 1.625rem;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	text-anchor: middle;
	dominant-baseline: central;
	pointer-events: none;
	user-select: none;

	&[data-active='true'] {
		fill: ${themeColor('accent-contrast')};
	}
`;
