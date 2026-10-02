import { css } from '@linaria/core';
import { themeVars } from '../theme.css';

export const tableContainer = css`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 1.5rem;
	margin-bottom: 2.5rem;
	font-family: 'Inter', system-ui, sans-serif;
`;

export const showcaseCard = css`
	background-color: ${themeVars.surface};
	border: 1px solid ${themeVars['container-2']};
	border-radius: 1rem;
	padding: 1.5rem;
	box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.02);
`;

export const typographyTable = css`
	width: 100%;
	border-collapse: collapse;
	text-align: left;
`;

export const tableHeadCell = css`
	padding: 0.75rem 1rem;
	border-bottom: 2px solid ${themeVars['container-2']};
	color: ${themeVars['text-2']};
	font-size: 0.85rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
`;

export const tableBodyCell = css`
	padding: 1.25rem 1rem;
	border-bottom: 1px solid ${themeVars['container-2']};
	vertical-align: middle;
`;

export const variantBadge = css`
	background-color: ${themeVars['container-1']};
	border: 1px solid ${themeVars['container-2']};
	color: ${themeVars.accent};
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	font-size: 0.85rem;
	font-weight: 600;
`;

export const specList = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	font-size: 0.8rem;
	color: ${themeVars['text-2']};
`;

export const specItem = css`
	& > span {
		color: ${themeVars['text-3']};
		font-family: monospace;
	}
`;

export const previewWrapper = css`
	color: ${themeVars['text-1']};
	word-break: break-word;
`;
