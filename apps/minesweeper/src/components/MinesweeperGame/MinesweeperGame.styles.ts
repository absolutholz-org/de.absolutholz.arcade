import { css } from '@linaria/core';

export const gameRoot = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100vh;
	height: 100dvh;
	width: 100%;
	background: var(--color-surface, #ffffff);
	overflow: hidden;
`;

export const boardArea = css`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1 1 0%;
	min-height: 0;
	min-width: 0;
	width: 100%;
	padding: clamp(0.25rem, 1.5vmin, 0.75rem);
	overflow: hidden;
`;
