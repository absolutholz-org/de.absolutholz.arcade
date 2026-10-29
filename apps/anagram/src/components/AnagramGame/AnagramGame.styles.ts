import { css } from '@linaria/core';

export const boardArea = css`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	min-height: 0;
	min-width: 0;
	width: 100%;
	max-width: 44rem;
	margin: 0 auto;
	user-select: none;
`;

export const statusBar = css`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-lg);
	padding: 0;
	width: 100%;
	background-color: transparent;
`;

export const statusMetric = css`
	display: inline-flex;
	align-items: center;
	gap: var(--space-2xs);
	font-size: var(--font-size-md);
	font-weight: var(--font-weight-medium);
	color: var(--color-text-1);
	font-variant-numeric: tabular-nums;
`;
