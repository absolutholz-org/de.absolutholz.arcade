import { css } from '@linaria/core';

export const settingsContent = css`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	padding: 0.5rem 0;
`;

export const settingRow = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
`;

export const settingLabelGroup = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

export const settingTitle = css`
	font-weight: 600;
	font-size: 0.9375rem;
`;

export const settingDesc = css`
	font-size: 0.8125rem;
	color: var(--color-text-subtle, light-dark(#6c757d, #adb5bd));
`;
