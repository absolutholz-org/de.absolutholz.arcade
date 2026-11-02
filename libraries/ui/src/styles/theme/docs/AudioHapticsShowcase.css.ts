import { css } from '@linaria/core';
import { themeVars } from '../theme.css';

export const showcaseContainer = css`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	margin-top: 1.5rem;
	margin-bottom: 2.5rem;
`;

export const showcaseCard = css`
	background-color: ${themeVars.surface};
	border: 1px solid ${themeVars['container-2']};
	border-radius: 1rem;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
`;

export const cardHeader = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	border-bottom: 1px solid ${themeVars['container-2']};
	padding-bottom: 1rem;
`;

export const cardTitle = css`
	font-size: 1.25rem;
	font-weight: 700;
	margin: 0;
	color: ${themeVars['text-1']};
`;

export const cardDescription = css`
	font-size: 0.95rem;
	color: ${themeVars['text-2']};
	margin: 0;
`;

export const buttonGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
	gap: 1rem;
`;

export const actionBox = css`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem;
	background-color: ${themeVars['container-1']};
	border: 1px solid ${themeVars['container-2']};
	border-radius: 0.5rem;
`;

export const actionTitle = css`
	font-size: 0.95rem;
	font-weight: 600;
	color: ${themeVars['text-1']};
	margin: 0;
`;

export const actionDescription = css`
	font-size: 0.8rem;
	color: ${themeVars['text-2']};
	margin: 0;
`;

export const stepperRow = css`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

export const statusNotice = css`
	font-size: 0.85rem;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;
	background-color: ${themeVars['container-1']};
	border: 1px solid ${themeVars['container-2']};
	color: ${themeVars['text-2']};
`;
