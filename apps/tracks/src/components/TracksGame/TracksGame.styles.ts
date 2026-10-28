import { css } from '@linaria/core';
import { styled } from '@linaria/react';

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

	svg {
		width: 1.125em;
		height: 1.125em;
		color: var(--color-text-2);
	}
`;

export const PlayColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem 0.75rem 1.5rem;
	width: 100%;
	max-width: 44rem;
	margin: 0 auto;
	user-select: none;
`;
