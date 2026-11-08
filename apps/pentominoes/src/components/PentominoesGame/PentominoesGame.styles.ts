import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const WorkspaceWrapper = styled.div`
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1rem;
	align-items: start;

	@media (min-width: 56rem) {
		grid-template-columns: minmax(20rem, 1.2fr) minmax(18rem, 0.9fr);
		gap: 1.25rem;
	}
`;

export const BoardSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	min-width: 0;
	container-type: inline-size;
	background: var(--color-surface-elevated, light-dark(oklch(0.97 0.01 260), oklch(0.19 0.02 260)));
	border: 1px solid var(--color-border-subtle, light-dark(oklch(0.86 0.02 260), oklch(0.3 0.02 260)));
	border-radius: 1rem;
`;

export const BoardGridContainer = styled.div`
	--cols: 12;
	--coord-col: 0rem;
	--grid-gap: clamp(0.125rem, 0.6cqi, 0.25rem);
	--grid-pad: clamp(0.25rem, 1.2cqi, 0.5rem);

	&[data-cols='3'] {
		--cols: 3;
	}
	&[data-cols='4'] {
		--cols: 4;
	}
	&[data-cols='5'] {
		--cols: 5;
	}
	&[data-cols='6'] {
		--cols: 6;
	}
	&[data-cols='7'] {
		--cols: 7;
	}
	&[data-cols='8'] {
		--cols: 8;
	}
	&[data-cols='9'] {
		--cols: 9;
	}
	&[data-cols='10'] {
		--cols: 10;
	}
	&[data-cols='11'] {
		--cols: 11;
	}
	&[data-cols='12'] {
		--cols: 12;
	}

	&[data-coords='true'] {
		--coord-col: clamp(1rem, 4cqi, 1.5rem);
	}

	--cell-size: clamp(
		1.25rem,
		calc((100cqi - (2 * var(--grid-pad)) - 0.25rem - var(--coord-col) - (var(--cols) * var(--grid-gap))) / var(--cols)),
		2.5rem
	);

	display: grid;
	grid-template-columns: repeat(var(--cols), var(--cell-size));
	gap: var(--grid-gap);
	padding: var(--grid-pad);
	background: light-dark(oklch(0.92 0.01 260), oklch(0.14 0.02 260));
	border-radius: 0.75rem;
	border: 2px solid light-dark(oklch(0.78 0.02 260), oklch(0.32 0.02 260));
	max-width: 100%;
	justify-content: center;
	align-items: center;

	&[data-coords='true'] {
		grid-template-columns: var(--coord-col) repeat(var(--cols), var(--cell-size));
	}
`;

export const CoordinateHeaderRow = styled.div`
	display: contents;
`;

export const BoardRow = styled.div`
	display: contents;
`;

export const CoordCornerCell = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: clamp(1rem, 3.5cqi, 1.375rem);
	user-select: none;
`;

export const ColCoordBadge = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: clamp(1rem, 3.5cqi, 1.375rem);
	font-size: clamp(0.625rem, 2.2cqi, 0.75rem);
	font-weight: 700;
	line-height: 1;
	text-align: center;
	color: var(--color-text-secondary, light-dark(oklch(0.45 0.02 260), oklch(0.72 0.02 260)));
	user-select: none;
`;

export const RowCoordBadge = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	font-size: clamp(0.625rem, 2.2cqi, 0.75rem);
	font-weight: 700;
	line-height: 1;
	text-align: center;
	color: var(--color-text-secondary, light-dark(oklch(0.45 0.02 260), oklch(0.72 0.02 260)));
	user-select: none;
`;

export const cellButtonClass = css`
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--cell-size);
	height: var(--cell-size);
	padding: 0;
	margin: 0;
	border-radius: clamp(0.25rem, 0.8cqi, 0.375rem);
	border: 1.5px solid light-dark(oklch(0.78 0.02 260), oklch(0.32 0.02 260));
	background: light-dark(oklch(0.99 0.005 260), oklch(0.22 0.02 260));
	color: light-dark(oklch(0.15 0.02 260), oklch(0.97 0.01 260));
	font-size: clamp(0.6875rem, 2.5cqi, 0.875rem);
	font-weight: 800;
	cursor: pointer;
	transition: transform 120ms ease, outline-color 120ms ease, background-color 120ms ease;
	user-select: none;

	&:focus-visible {
		outline: 3px solid light-dark(oklch(0.5 0.22 260), oklch(0.78 0.18 260));
		outline-offset: 2px;
		z-index: 3;
	}

	&[data-void='true'] {
		background: transparent;
		border-color: transparent;
		cursor: default;
		pointer-events: none;
	}

	&[data-color='0'] {
		background-color: light-dark(oklch(0.62 0.19 25), oklch(0.66 0.19 25));
		border-color: light-dark(oklch(0.42 0.16 25), oklch(0.82 0.12 25));
	}
	&[data-color='1'] {
		background-color: light-dark(oklch(0.66 0.16 55), oklch(0.7 0.16 55));
		border-color: light-dark(oklch(0.45 0.14 55), oklch(0.85 0.11 55));
	}
	&[data-color='2'] {
		background-color: light-dark(oklch(0.75 0.16 85), oklch(0.78 0.16 85));
		border-color: light-dark(oklch(0.52 0.14 85), oklch(0.88 0.1 85));
	}
	&[data-color='3'] {
		background-color: light-dark(oklch(0.65 0.17 135), oklch(0.69 0.17 135));
		border-color: light-dark(oklch(0.44 0.14 135), oklch(0.84 0.11 135));
	}
	&[data-color='4'] {
		background-color: light-dark(oklch(0.62 0.15 165), oklch(0.67 0.15 165));
		border-color: light-dark(oklch(0.42 0.13 165), oklch(0.82 0.1 165));
	}
	&[data-color='5'] {
		background-color: light-dark(oklch(0.63 0.14 195), oklch(0.68 0.14 195));
		border-color: light-dark(oklch(0.42 0.12 195), oklch(0.83 0.1 195));
	}
	&[data-color='6'] {
		background-color: light-dark(oklch(0.58 0.17 230), oklch(0.65 0.17 230));
		border-color: light-dark(oklch(0.39 0.14 230), oklch(0.82 0.11 230));
	}
	&[data-color='7'] {
		background-color: light-dark(oklch(0.55 0.19 260), oklch(0.64 0.18 260));
		border-color: light-dark(oklch(0.36 0.16 260), oklch(0.81 0.12 260));
	}
	&[data-color='8'] {
		background-color: light-dark(oklch(0.58 0.2 290), oklch(0.66 0.19 290));
		border-color: light-dark(oklch(0.39 0.17 290), oklch(0.82 0.12 290));
	}
	&[data-color='9'] {
		background-color: light-dark(oklch(0.6 0.2 320), oklch(0.68 0.19 320));
		border-color: light-dark(oklch(0.4 0.17 320), oklch(0.83 0.12 320));
	}
	&[data-color='10'] {
		background-color: light-dark(oklch(0.62 0.19 350), oklch(0.68 0.18 350));
		border-color: light-dark(oklch(0.42 0.16 350), oklch(0.83 0.12 350));
	}
	&[data-color='11'] {
		background-color: light-dark(oklch(0.64 0.14 110), oklch(0.7 0.14 110));
		border-color: light-dark(oklch(0.43 0.12 110), oklch(0.84 0.1 110));
	}

	&[data-pattern='true']::before {
		content: '';
		position: absolute;
		inset: 2px;
		border-radius: 0.25rem;
		pointer-events: none;
		opacity: 0.28;
		background-image: repeating-linear-gradient(
			45deg,
			currentColor 0,
			currentColor 2px,
			transparent 2px,
			transparent 6px
		);
	}

	&[data-ghost='valid'] {
		outline: 3px dashed light-dark(oklch(0.48 0.18 145), oklch(0.78 0.18 145));
		outline-offset: -3px;
		z-index: 2;
	}

	&[data-ghost='invalid'] {
		outline: 3px dashed light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
		outline-offset: -3px;
		z-index: 2;
	}
`;

export const CellLabelBadge = styled.span`
	position: relative;
	z-index: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: clamp(0.875rem, 3cqi, 1.25rem);
	height: clamp(0.875rem, 3cqi, 1.25rem);
	padding: 0 0.125rem;
	border-radius: 0.25rem;
	background: light-dark(oklch(0.99 0.005 260 / 0.88), oklch(0.14 0.02 260 / 0.88));
	color: light-dark(oklch(0.15 0.02 260), oklch(0.98 0.01 260));
	font-size: clamp(0.5625rem, 2cqi, 0.75rem);
	font-weight: 800;
	line-height: 1;
	pointer-events: none;
`;

export const TraySection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	min-width: 0;
	background: var(--color-surface-elevated, light-dark(oklch(0.97 0.01 260), oklch(0.19 0.02 260)));
	border: 1px solid var(--color-border-subtle, light-dark(oklch(0.86 0.02 260), oklch(0.3 0.02 260)));
	border-radius: 1rem;
	padding: 0.75rem;

	@media (min-width: 36rem) {
		padding: 1rem;
	}
`;

export const ActiveTransformBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	padding: 0.75rem;
	border-radius: 0.75rem;
	background: light-dark(oklch(0.93 0.015 260), oklch(0.24 0.02 260));
`;

export const TransformButtonsGroup = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
`;

export const TrayGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(4.75rem, 1fr));
	gap: 0.5rem;

	@media (min-width: 36rem) {
		grid-template-columns: repeat(auto-fill, minmax(5.25rem, 1fr));
		gap: 0.625rem;
	}
`;

export const trayItemButtonClass = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.5rem;
	border-radius: 0.75rem;
	border: 2px solid light-dark(oklch(0.82 0.02 260), oklch(0.32 0.02 260));
	background: light-dark(oklch(0.99 0.005 260), oklch(0.22 0.02 260));
	color: inherit;
	cursor: pointer;
	transition: transform 120ms ease, border-color 120ms ease, opacity 120ms ease;

	&:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	&:focus-visible {
		outline: 3px solid light-dark(oklch(0.5 0.22 260), oklch(0.78 0.18 260));
		outline-offset: 2px;
	}

	&[data-selected='true'] {
		border-color: light-dark(oklch(0.5 0.22 260), oklch(0.78 0.18 260));
		background: light-dark(oklch(0.93 0.04 260), oklch(0.28 0.05 260));
	}

	&[data-placed='true'] {
		opacity: 0.42;
	}
`;

export const TrayPieceLabel = styled.span`
	font-size: 0.75rem;
	font-weight: 800;
`;

export const KeyboardHelpText = styled.p`
	margin: 0;
	font-size: 0.8125rem;
	color: var(--color-text-secondary, light-dark(oklch(0.45 0.02 260), oklch(0.72 0.02 260)));
	text-align: center;
`;

export const SrOnlyLiveRegion = styled.div`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
`;
