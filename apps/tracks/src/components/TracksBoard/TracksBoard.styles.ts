import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: min(calc(100vw - 1.5rem), calc(100vh - 15rem), 38rem);
	aspect-ratio: 1 / 1;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	touch-action: none;
`;

export const BoardMatrix = styled.div`
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 3rem 1fr;
	grid-template-rows: 3rem 1fr;
	gap: 0.375rem;
`;

export const CornerCell = styled.div`
	width: 100%;
	height: 100%;
	border-radius: var(--radius-sm);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
`;

export const ColCluesRow = styled.div`
	display: grid;
	width: 100%;
	height: 100%;
	gap: 0.125rem;

	&[data-size='6'] {
		grid-template-columns: repeat(6, 1fr);
	}

	&[data-size='7'] {
		grid-template-columns: repeat(7, 1fr);
	}

	&[data-size='8'] {
		grid-template-columns: repeat(8, 1fr);
	}

	&[data-size='10'] {
		grid-template-columns: repeat(10, 1fr);
	}
`;

export const RowCluesCol = styled.div`
	display: grid;
	width: 100%;
	height: 100%;
	gap: 0.125rem;

	&[data-size='6'] {
		grid-template-rows: repeat(6, 1fr);
	}

	&[data-size='7'] {
		grid-template-rows: repeat(7, 1fr);
	}

	&[data-size='8'] {
		grid-template-rows: repeat(8, 1fr);
	}

	&[data-size='10'] {
		grid-template-rows: repeat(10, 1fr);
	}
`;

export const ClueButton = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 0.125rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	cursor: pointer;
	transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;

	.clue-target {
		font-size: 0.9375rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.clue-current {
		font-size: 0.6875rem;
		font-weight: 600;
		color: ${themeColor('text-3')};
		line-height: 1;
	}

	&[data-status='satisfied'] {
		background-color: ${themeColor('surface')};
		border-color: light-dark(oklch(0.55 0.18 145), oklch(0.7 0.18 145));
		color: light-dark(oklch(0.45 0.18 145), oklch(0.75 0.18 145));

		.clue-target {
			text-decoration: line-through;
		}

		.clue-current {
			color: light-dark(oklch(0.45 0.18 145), oklch(0.75 0.18 145));
		}
	}

	&[data-status='overflow'] {
		background-color: ${themeColor('surface')};
		border-color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));

		.clue-current {
			color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		}
	}

	&:hover {
		border-color: ${themeColor('accent')};
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 1px;
	}
`;

export const GridContainer = styled.div`
	width: 100%;
	height: 100%;
	display: grid;
	border: 2px solid ${themeColor('text-1')};
	border-radius: var(--radius-sm);
	overflow: hidden;
	background-color: ${themeColor('surface')};
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);

	&[data-size='6'] {
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(6, 1fr);
	}

	&[data-size='7'] {
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(7, 1fr);
	}

	&[data-size='8'] {
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
	}

	&[data-size='10'] {
		grid-template-columns: repeat(10, 1fr);
		grid-template-rows: repeat(10, 1fr);
	}
`;

export const GridRow = styled.div`
	display: contents;
`;

export const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	min-width: 24px;
	min-height: 24px;
	padding: 0;
	margin: 0;
	border: 1px solid ${themeColor('container-2')};
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	user-select: none;
	touch-action: none;
	transition: background-color 120ms ease;

	&[data-fixed='true'] {
		background-color: ${themeColor('container-1')};
		cursor: default;
	}

	&[data-error='true'] {
		background-color: rgba(239, 68, 68, 0.14);
	}

	&[data-train-here='true'] {
		background-color: rgba(34, 197, 94, 0.16);
	}

	&[data-focused='true'] {
		z-index: 2;
		box-shadow: inset 0 0 0 2px ${themeColor('accent')};
	}

	&:hover:not([data-fixed='true']) {
		background-color: ${themeColor('container-1')};
	}

	&:focus-visible {
		outline: none;
		z-index: 3;
		box-shadow: inset 0 0 0 3px ${themeColor('accent')};
	}

	> svg {
		width: 100%;
		height: 100%;
		display: block;
		pointer-events: none;
	}
`;

export const GateOverlay = styled.span`
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 2;

	> svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

export const LocomotiveOverlay = styled.span`
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 4;
	display: flex;
	align-items: center;
	justify-content: center;

	> svg {
		width: 92%;
		height: 92%;
		display: block;
	}
`;

export const SrOnly = styled.div`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
`;
