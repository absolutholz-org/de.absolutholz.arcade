import { styled } from '@linaria/react';

export const CanvasContainer = styled.div`
	position: relative;
	width: 100%;
	max-width: 42.5rem;
	aspect-ratio: 1 / 1;
	margin: 0 auto;
	background: var(--color-surface-elevated, #111827);
	border: 1px solid var(--color-border-default, rgba(255, 255, 255, 0.12));
	border-radius: 1rem;
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
	stroke: var(--color-status-success, #22c55e);
	stroke-width: 3.5;
	stroke-dasharray: none;
	opacity: 0.78;

	&[data-connected='true'] {
		stroke: var(--color-interactive-primary, #38bdf8);
		stroke-width: 5;
		opacity: 1;
	}

	&[data-intersecting='true'] {
		stroke: var(--color-status-danger, #ef4444);
		stroke-width: 4.5;
		stroke-dasharray: 10 6;
		opacity: 0.92;
	}

	&[data-intersecting='true'][data-connected='true'] {
		stroke: var(--color-status-danger, #ef4444);
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
`;

export const FocusRing = styled.circle`
	fill: none;
	stroke: var(--color-focus-ring, var(--color-interactive-primary, #38bdf8));
	stroke-width: 3.5;
	stroke-dasharray: 6 4;
	opacity: 0;
	pointer-events: none;
	transition: opacity 120ms ease;

	&[data-visible='true'] {
		opacity: 1;
	}
`;

export const VertexCircle = styled.circle`
	fill: var(--color-status-success, #16a34a);
	stroke: var(--color-surface, #0f172a);
	stroke-width: 4;
	transition: fill 120ms ease, transform 120ms ease;

	&[data-has-crossings='true'] {
		fill: var(--color-status-danger, #ef4444);
	}

	&[data-selected='true'],
	&[data-dragging='true'] {
		fill: var(--color-interactive-primary, #0284c7);
		stroke: var(--color-text-primary, #ffffff);
	}
`;

export const VertexLabel = styled.text`
	fill: var(--color-text-primary, #ffffff);
	font-size: 1rem;
	font-weight: 700;
	text-anchor: middle;
	dominant-baseline: central;
	pointer-events: none;
	user-select: none;
`;
