import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardFrame = styled.div`
	position: relative;
	width: 100%;
	max-width: min(36rem, calc(100dvh - var(--game-header-height, 3.5rem) - 13.5rem));
	aspect-ratio: 1 / 1;
	margin-inline: auto;
	min-height: 0;
	flex-shrink: 1;
	padding: 0.375rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	box-shadow: 0 4px 20px oklch(0% 0 0 / 0.1);
	user-select: none;
	touch-action: manipulation;

	/* Optical beam channel OKLCH palette with light-dark() contrast adaptation */
	--laser-red: light-dark(oklch(55% 0.24 25), oklch(68% 0.23 25));
	--laser-green: light-dark(oklch(52% 0.2 148), oklch(72% 0.21 148));
	--laser-blue: light-dark(oklch(50% 0.22 258), oklch(68% 0.2 258));
	--laser-yellow: light-dark(oklch(62% 0.19 88), oklch(82% 0.18 92));
	--laser-magenta: light-dark(oklch(54% 0.24 328), oklch(70% 0.23 328));
	--laser-cyan: light-dark(oklch(52% 0.17 205), oklch(74% 0.17 205));
	--laser-white: light-dark(oklch(38% 0.02 250), oklch(96% 0.01 250));

	@media (min-width: 640px) {
		padding: 0.625rem;
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
	position: relative;
	z-index: 2;
	display: grid;
	width: 100%;
	height: 100%;

	&[data-rows='5'] {
		grid-template-rows: repeat(5, minmax(0, 1fr));
	}

	&[data-rows='7'] {
		grid-template-rows: repeat(7, minmax(0, 1fr));
	}

	&[data-rows='8'] {
		grid-template-rows: repeat(8, minmax(0, 1fr));
	}

	&[data-rows='9'] {
		grid-template-rows: repeat(9, minmax(0, 1fr));
	}
`;

export const GridRow = styled.div`
	display: grid;
	min-height: 0;

	&[data-cols='5'] {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	&[data-cols='7'] {
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}

	&[data-cols='8'] {
		grid-template-columns: repeat(8, minmax(0, 1fr));
	}

	&[data-cols='9'] {
		grid-template-columns: repeat(9, minmax(0, 1fr));
	}
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
	padding: 0;
	border: 0;
	box-shadow: inset 0 0 0 1px ${themeColor('container-2')};
	background-color: transparent;
	color: ${themeColor('text-1')};
	cursor: default;
	transition: background-color 140ms ease-out;

	${focusVisibleRing}

	&[data-rotatable='true'] {
		cursor: pointer;
	}

	&[data-rotatable='true']:hover {
		background-color: ${themeColor('container-1')};
	}

	&[data-hinted='true'] {
		box-shadow:
			inset 0 0 0 3px ${themeColor('accent')},
			0 0 12px ${themeColor('accent')};
		z-index: 4;
	}

	&[data-kind='wall'] {
		background-color: ${themeColor('container-2')};
	}

	&:focus-visible {
		z-index: 5;
		outline: 3px solid ${themeColor('accent')};
		outline-offset: -3px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	@media (forced-colors: active) {
		border: 1px solid ButtonBorder;
		box-shadow: none;

		&:focus-visible {
			outline: 3px solid transparent;
			box-shadow: inset 0 0 0 3px Highlight;
		}

		&[data-kind='wall'] {
			background-color: ButtonText;
			color: ButtonFace;
		}
	}
`;

export const BeamOverlay = styled.svg`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 3;
`;

export const BeamGlowLine = styled.line`
	stroke-width: 14;
	stroke-linecap: round;
	opacity: 0.28;

	&[data-color='red'] {
		stroke: var(--laser-red);
	}
	&[data-color='green'] {
		stroke: var(--laser-green);
	}
	&[data-color='blue'] {
		stroke: var(--laser-blue);
	}
	&[data-color='yellow'] {
		stroke: var(--laser-yellow);
	}
	&[data-color='magenta'] {
		stroke: var(--laser-magenta);
	}
	&[data-color='cyan'] {
		stroke: var(--laser-cyan);
	}
	&[data-color='white'] {
		stroke: var(--laser-white);
	}

	@media (forced-colors: active) {
		opacity: 0;
	}
`;

export const BeamCoreLine = styled.line`
	stroke-width: 5.5;
	stroke-linecap: round;

	&[data-color='red'] {
		stroke: var(--laser-red);
	}
	&[data-color='green'] {
		stroke: var(--laser-green);
		stroke-dasharray: 18 5;
	}
	&[data-color='blue'] {
		stroke: var(--laser-blue);
		stroke-dasharray: 10 5;
	}
	&[data-color='yellow'] {
		stroke: var(--laser-yellow);
		stroke-dasharray: 14 4 4 4;
	}
	&[data-color='magenta'] {
		stroke: var(--laser-magenta);
		stroke-dasharray: 20 4 6 4;
	}
	&[data-color='cyan'] {
		stroke: var(--laser-cyan);
	}
	&[data-color='white'] {
		stroke: var(--laser-white);
	}

	@media (forced-colors: active) {
		stroke: Highlight;
		stroke-width: 6;
	}
`;

export const CellGraphic = styled.svg`
	position: relative;
	z-index: 4;
	width: 84%;
	height: 84%;
	pointer-events: none;
	overflow: visible;
`;

export const ChannelFill = styled.g`
	&[data-color='red'] {
		color: var(--laser-red);
	}
	&[data-color='green'] {
		color: var(--laser-green);
	}
	&[data-color='blue'] {
		color: var(--laser-blue);
	}
	&[data-color='yellow'] {
		color: var(--laser-yellow);
	}
	&[data-color='magenta'] {
		color: var(--laser-magenta);
	}
	&[data-color='cyan'] {
		color: var(--laser-cyan);
	}
	&[data-color='white'] {
		color: var(--laser-white);
	}

	@media (forced-colors: active) {
		color: CanvasText;
	}
`;

export const SymbolText = styled.text`
	font-size: 26px;
	font-weight: 900;
	text-anchor: middle;
	dominant-baseline: central;
	fill: ${themeColor('surface')};
	stroke: ${themeColor('text-1')};
	stroke-width: 1.5px;
	paint-order: stroke;
	pointer-events: none;

	&[data-unlit='true'] {
		fill: ${themeColor('text-1')};
		stroke: ${themeColor('surface')};
	}

	@media (forced-colors: active) {
		fill: CanvasText;
		stroke: Canvas;
	}
`;
