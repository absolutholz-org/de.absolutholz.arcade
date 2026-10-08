import { css } from '@linaria/core';

export const headerRoot = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.25rem;
	padding: 0.25rem clamp(0.25rem, 1.5vw, 0.75rem);
	background: var(--color-surface, #ffffff);
	border-bottom: 1px solid var(--color-border, #e5e7eb);
	width: 100%;
	flex-shrink: 0;
	box-sizing: border-box;
`;

export const leftSection = css`
	display: flex;
	align-items: center;
	gap: 0.25rem;
`;

export const centerSection = css`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
`;

export const rightSection = css`
	display: flex;
	align-items: center;
	gap: 0.25rem;

	@media (max-width: 380px) {
		width: 100%;
		justify-content: center;
		padding-top: 0.125rem;
		border-top: 1px solid var(--color-border, #e5e7eb);
	}
`;

export const badge = css`
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.2rem 0.5rem;
	background: var(--color-container-1, #f3f4f6);
	border: 1px solid var(--color-container-2, #e5e7eb);
	border-radius: 9999px;
	font-size: 0.8125rem;
	font-weight: 600;
	color: var(--color-text-1, #111827);

	svg {
		width: 0.875rem;
		height: 0.875rem;
	}
`;
