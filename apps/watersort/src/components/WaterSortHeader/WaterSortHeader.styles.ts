import { css } from '@linaria/core';

export const headerContainer = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0.75rem 1rem;
	background: var(--color-surface-container, light-dark(#ffffff, #1e1e1e));
	border-bottom: 0.0625rem solid var(--color-border-subtle, light-dark(#e9ecef, #2c2e33));
`;

export const leftSection = css`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const centerSection = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
`;

export const metaRow = css`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.8125rem;
	font-weight: 600;
	color: var(--color-text-subtle, light-dark(#6c757d, #adb5bd));
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const statusRow = css`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const statusBadge = css`
	display: inline-flex;
	align-items: center;
	padding: 0.125rem 0.5rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 600;
	background: var(--color-surface-subtle, light-dark(#e9ecef, #2c2e33));
	color: var(--color-text-base, light-dark(#212529, #f8f9fa));
`;
