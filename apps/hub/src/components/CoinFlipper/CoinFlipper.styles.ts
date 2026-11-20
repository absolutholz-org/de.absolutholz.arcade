import { css } from '@linaria/core';

export const Container = css`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding-bottom: 2rem;
`;

export const Toolbar = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	gap: 0.75rem;
`;

export const HistorySection = css`
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
	padding: 1rem 1.25rem;
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 0.875rem;
`;

export const HistoryHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
`;

export const HistoryTitle = css`
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-text-2);
	margin: 0;
`;

export const HistoryStrip = css`
	display: flex;
	align-items: center;
	gap: 0.4375rem;
	overflow-x: auto;
	padding: 0.25rem 0;
	scrollbar-width: thin;
`;

export const EmptyHistory = css`
	font-size: 0.875rem;
	color: var(--color-text-2);
`;
