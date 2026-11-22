import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardFrame = styled.div`
	position: relative;
	width: 100%;
	/* Fit grid aspect cleanly inside standard game container on both desktop and mobile */
	max-width: min(46rem, calc((100dvh - var(--game-header-height, 3.5rem) - 14rem) * 1.5));
	aspect-ratio: 15 / 10;
	margin-inline: auto;
	min-height: 0;
	flex-shrink: 1;
	padding: 0.25rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 2px dashed ${themeColor('container-2')};
	box-shadow: 0 4px 20px oklch(0% 0 0 / 0.08);
	user-select: none;
	touch-action: manipulation;

	&[data-grid='5x5'] {
		aspect-ratio: 1 / 1;
		max-width: min(26rem, calc(100dvh - var(--game-header-height, 3.5rem) - 13rem));
	}

	&[data-grid='10x5'] {
		aspect-ratio: 2 / 1;
		max-width: min(40rem, calc((100dvh - var(--game-header-height, 3.5rem) - 13rem) * 2));
	}

	&[data-grid='15x10'] {
		aspect-ratio: 15 / 10;
		max-width: min(46rem, calc((100dvh - var(--game-header-height, 3.5rem) - 14rem) * 1.5));
	}

	&[data-grid='20x15'] {
		aspect-ratio: 20 / 15;
		max-width: min(50rem, calc((100dvh - var(--game-header-height, 3.5rem) - 14rem) * 1.3333));
	}

	/* Colorblind-safe vibrant OKLCH palette with light-dark() adaptation */
	--cascade-tile-0: light-dark(oklch(62% 0.21 25), oklch(66% 0.2 25));
	--cascade-tile-0-border: light-dark(oklch(48% 0.19 25), oklch(78% 0.15 25));
	--cascade-tile-1: light-dark(oklch(56% 0.2 255), oklch(65% 0.18 255));
	--cascade-tile-1-border: light-dark(oklch(42% 0.18 255), oklch(78% 0.14 255));
	--cascade-tile-2: light-dark(oklch(58% 0.18 152), oklch(66% 0.17 152));
	--cascade-tile-2-border: light-dark(oklch(44% 0.16 152), oklch(79% 0.13 152));
	--cascade-tile-3: light-dark(oklch(72% 0.17 78), oklch(75% 0.16 78));
	--cascade-tile-3-border: light-dark(oklch(54% 0.15 78), oklch(85% 0.12 78));
	--cascade-tile-4: light-dark(oklch(58% 0.2 308), oklch(67% 0.19 308));
	--cascade-tile-4-border: light-dark(oklch(44% 0.18 308), oklch(80% 0.14 308));

	@media (min-width: 640px) {
		padding: 0.75rem;
	}

	&[data-mega-pulse='true'] {
		animation: cascadeMegaPulse 380ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes cascadeMegaPulse {
		0% {
			transform: scale(1);
			box-shadow: 0 4px 20px oklch(0% 0 0 / 0.08);
		}
		35% {
			transform: scale(1.015);
			box-shadow: 0 0 0 4px ${themeColor('accent')}, 0 8px 28px oklch(0% 0 0 / 0.16);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 4px 20px oklch(0% 0 0 / 0.08);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		&[data-mega-pulse='true'] {
			animation: none;
		}
	}

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
	}
`;

export const BoardViewport = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: var(--radius-sm);
	background-color: ${themeColor('surface')};
	overflow: hidden;

	&[data-paused='true'] {
		visibility: hidden;
		pointer-events: none;
	}
`;

export const GridContainer = styled.div`
	display: grid;
	grid-template-rows: repeat(10, minmax(0, 1fr));
	width: 100%;
	height: 100%;
	gap: 0.0625rem;
	padding: 0.125rem;

	&[data-rows='5'] {
		grid-template-rows: repeat(5, minmax(0, 1fr));
	}

	&[data-rows='10'] {
		grid-template-rows: repeat(10, minmax(0, 1fr));
	}

	&[data-rows='15'] {
		grid-template-rows: repeat(15, minmax(0, 1fr));
	}

	@media (min-width: 640px) {
		gap: 0.1875rem;
		padding: 0.375rem;
	}
`;

export const GridRow = styled.div`
	display: grid;
	grid-template-columns: repeat(15, minmax(0, 1fr));
	gap: 0.0625rem;
	min-height: 0;

	&[data-cols='5'] {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	&[data-cols='10'] {
		grid-template-columns: repeat(10, minmax(0, 1fr));
	}

	&[data-cols='15'] {
		grid-template-columns: repeat(15, minmax(0, 1fr));
	}

	&[data-cols='20'] {
		grid-template-columns: repeat(20, minmax(0, 1fr));
	}

	@media (min-width: 640px) {
		gap: 0.1875rem;
	}
`;

export const CellButton = styled.button`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-width: 0;
	min-height: 0;
	padding: 0;
	border: 1px solid transparent;
	border-radius: 0.25rem;
	background: transparent;
	cursor: default;
	will-change: transform;
	transition:
		transform 140ms ease-out,
		filter 140ms ease-out,
		box-shadow 140ms ease-out,
		opacity 160ms ease-out;

	@media (min-width: 640px) {
		border-radius: 0.3125rem;
	}

	${focusVisibleRing}

	&[data-empty='true'] {
		background-color: transparent;
		border-color: transparent;
		cursor: default;
	}

	&[data-empty='false'] {
		cursor: pointer;
		box-shadow: inset 0 -2px 0 oklch(0% 0 0 / 0.2), inset 0 1px 0 oklch(100% 0 0 / 0.28);
	}

	&[data-color='0'] {
		background-color: var(--cascade-tile-0);
		border-color: var(--cascade-tile-0-border);
	}

	&[data-color='1'] {
		background-color: var(--cascade-tile-1);
		border-color: var(--cascade-tile-1-border);
	}

	&[data-color='2'] {
		background-color: var(--cascade-tile-2);
		border-color: var(--cascade-tile-2-border);
	}

	&[data-color='3'] {
		background-color: var(--cascade-tile-3);
		border-color: var(--cascade-tile-3-border);
	}

	&[data-color='4'] {
		background-color: var(--cascade-tile-4);
		border-color: var(--cascade-tile-4-border);
	}

	&[data-hovered='true'] {
		filter: brightness(1.1);
		transform: scale(0.95);
		box-shadow: 0 0 0 2px oklch(100% 0 0 / 0.7), inset 0 -2px 0 oklch(0% 0 0 / 0.2);
		z-index: 2;
	}

	&[data-selected='true'] {
		filter: brightness(1.16);
		transform: scale(0.92);
		box-shadow:
			0 0 0 2px ${themeColor('surface')},
			0 0 0 4px ${themeColor('text-1')};
		z-index: 3;
	}

	&[data-orphan='true'] {
		opacity: 0.72;
		border-style: dashed;
		border-width: 2px;
		box-shadow: 0 0 0 1px ${themeColor('text-1')};
		animation: cascadeOrphanPulse 1.4s ease-in-out infinite;
	}

	@keyframes cascadeOrphanPulse {
		0%,
		100% {
			transform: scale(0.96);
			opacity: 0.78;
		}
		50% {
			transform: scale(0.9);
			opacity: 0.55;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
		&[data-orphan='true'] {
			animation: none;
		}
	}

	@media (forced-colors: active) {
		&[data-empty='false'] {
			border: 2px solid ButtonBorder;
			background-color: ButtonFace;
			color: ButtonText;
		}
		&[data-selected='true'] {
			border: 3px solid Highlight;
			outline: 2px solid Highlight;
		}
		&[data-orphan='true'] {
			border: 2px dashed Mark;
		}
	}
`;

export const TileSymbol = styled.svg`
	width: 56%;
	height: 56%;
	pointer-events: none;
	fill: oklch(100% 0 0 / 0.88);
	stroke: oklch(0% 0 0 / 0.24);
	stroke-width: 1.5;

	@media (forced-colors: active) {
		fill: ButtonText;
		stroke: none;
	}
`;

export const ParticleCanvas = styled.canvas`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 5;
`;

export const FloatingPreviewBadge = styled.div`
	position: absolute;
	pointer-events: none;
	z-index: 6;
	transform: translate(-50%, -115%);
	padding: 0.1875rem 0.5rem;
	border-radius: var(--radius-full, 999px);
	background-color: ${themeColor('text-1')};
	color: ${themeColor('surface')};
	font-size: 0.8125rem;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
	box-shadow: 0 4px 12px oklch(0% 0 0 / 0.25);

	&[data-mega='true'] {
		background-color: ${themeColor('accent')};
		color: ${themeColor('accent-contrast')};
		font-size: 0.9375rem;
		padding: 0.25rem 0.625rem;
	}

	@media (forced-colors: active) {
		background-color: Canvas;
		color: CanvasText;
		border: 2px solid Highlight;
	}
`;

export const MegaToastBanner = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: 7;
	padding: 0.5rem 1.125rem;
	border-radius: var(--radius-full, 999px);
	background-color: ${themeColor('accent')};
	color: ${themeColor('accent-contrast')};
	font-size: 1.125rem;
	font-weight: 800;
	letter-spacing: 0.02em;
	box-shadow: 0 8px 24px oklch(0% 0 0 / 0.28);
	animation: cascadeMegaBanner 720ms cubic-bezier(0.22, 1, 0.36, 1) forwards;

	@keyframes cascadeMegaBanner {
		0% {
			opacity: 0;
			transform: translate(-50%, -35%) scale(0.8);
		}
		22% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.06);
		}
		75% {
			opacity: 1;
			transform: translate(-50%, -58%) scale(1);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -78%) scale(0.95);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		opacity: 0.95;
	}
`;
