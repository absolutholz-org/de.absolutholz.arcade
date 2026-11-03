import { css } from '@linaria/core';

export const FilterBarWrapper = css`
	margin-top: 1rem;
	width: 100%;
`;

export const EmptyState = css`
	grid-column: 1 / -1;
	padding: 3rem 1.5rem;
	text-align: center;
	color: var(--color-text-2);
	border-radius: var(--radius-lg, 0.75rem);
	border: 1px dashed var(--color-container-2);
	background: var(--color-surface);
`;
