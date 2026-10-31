import { css } from '@linaria/core';

export const gridWrapper = css`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding: 0.5rem;
	touch-action: manipulation;
`;

export const grid = css`
	display: grid;
	grid-template-columns: repeat(var(--grid-cols, 5), minmax(0, 1fr));
	grid-template-rows: repeat(var(--grid-rows, 5), minmax(0, 1fr));
	gap: 0.375rem;
	width: min(85vw, min(70vh, 560px));
	height: min(85vw, min(70vh, 560px));
	max-width: 560px;
	max-height: 560px;
	aspect-ratio: 1 / 1;
	background: var(--color-surface-sunken);
	padding: 0.5rem;
	border-radius: var(--radius-xl);
	border: 1px solid var(--color-border-subtle);
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.25);
	user-select: none;
`;

export const row = css`
	display: contents;
`;

export const tileButton = css`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	border: 1px solid var(--color-border-subtle);
	border-radius: var(--radius-md);
	background: var(--color-surface-raised);
	cursor: pointer;
	outline: none;
	transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
	min-width: 28px;
	min-height: 28px;

	&:hover:not(:disabled) {
		background: var(--color-surface-hover);
		border-color: var(--color-border-strong);
	}

	&:focus-visible {
		outline: 2px solid var(--color-primary-main);
		outline-offset: 2px;
		z-index: 2;
	}

	&[data-locked='true'] {
		cursor: default;
		background: var(--color-surface-sunken);
		border-color: var(--color-border-subtle);
	}

	&[data-root='true'] {
		box-shadow: 0 0 8px rgba(0, 200, 255, 0.25);
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.85;
	}
`;

export const tileGraphic = css`
	width: 100%;
	height: 100%;
	display: block;
	transform: rotate(var(--tile-angle, 0deg));
	transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
	pointer-events: none;
`;

export const counterRotate = css`
	transform-origin: 50% 50%;
	transform: rotate(calc(-1 * var(--tile-angle, 0deg)));
	transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const lockBadge = css`
	position: absolute;
	top: 2px;
	right: 2px;
	width: 14px;
	height: 14px;
	color: var(--color-text-muted);
	pointer-events: none;
	opacity: 0.8;
	z-index: 1;
`;
