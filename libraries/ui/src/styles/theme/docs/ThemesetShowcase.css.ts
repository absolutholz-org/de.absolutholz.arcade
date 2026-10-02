import { css } from '@linaria/core';
import { themeVars } from '../theme.css';

export const showcaseContainer = css`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	font-family: 'Inter', system-ui, sans-serif;
	margin-top: 1.5rem;
	margin-bottom: 2.5rem;
`;

export const descriptionBlock = css`
	padding: 1rem 1.25rem;
	border-radius: 0.75rem;
	background: linear-gradient(135deg, oklch(0.97 0.01 250), oklch(0.95 0.02 250));
	border-left: 0.3125rem solid oklch(0.6 0.18 250);
	color: oklch(0.3 0.02 250);

	@media (prefers-color-scheme: dark) {
		background: linear-gradient(135deg, oklch(0.18 0.01 250), oklch(0.15 0.01 250));
		border-left-color: oklch(0.7 0.16 250);
		color: oklch(0.9 0.01 250);
	}
`;

export const sideBySide = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	align-items: start;

	@media (min-width: 1200px) {
		grid-template-columns: 1fr 1fr;
	}
`;

export const schemeWrapper = {
	light: css`
		background-color: ${themeVars.surface};
		color: ${themeVars['text-1']};
		padding: 1.75rem;
		border-radius: 1rem;
		border: 1px solid ${themeVars['container-2']};
		box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		color-scheme: light;

		&:hover {
			box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.06);
		}
	`,
	dark: css`
		background-color: ${themeVars.surface};
		color: ${themeVars['text-1']};
		padding: 1.75rem;
		border-radius: 1rem;
		border: 1px solid ${themeVars['container-2']};
		box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		color-scheme: dark;

		&:hover {
			box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.06);
		}
	`,
};

export const schemeTitle = css`
	border-bottom: 2px solid ${themeVars['container-2']};
	padding-bottom: 0.75rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const themeSection = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

export const themeTitleLabel = css`
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: ${themeVars['text-2']};
	font-weight: 700;
`;

export const themeBlockGrid = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;

	@media (min-width: 640px) {
		grid-template-columns: 1fr 1.2fr;
	}
`;

export const demoCard = css`
	background-color: ${themeVars.surface};
	color: ${themeVars['text-1']};
	border: 1px solid ${themeVars['container-2']};
	border-radius: 0.875rem;
	padding: 1.25rem;
	box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.02);
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	justify-content: space-between;
	min-height: 10.625rem;
	transition: all 0.2s ease-in-out;

	&:hover {
		border-color: ${themeVars.accent};
		transform: translateY(-0.125rem);
		box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.04);
	}
`;

export const cardTop = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const cardBadge = css`
	background-color: ${themeVars.accent};
	color: ${themeVars['accent-contrast']};
	font-size: 0.7rem;
	font-weight: 700;
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	text-transform: uppercase;
	letter-spacing: 0.06em;
`;

export const activeStatusLabel = css`
	color: ${themeVars['text-3']};
	font-size: 0.75rem;
`;

export const cardTitleWrapper = css`
	font-weight: 600;
`;

export const cardBodyWrapper = css`
	color: ${themeVars['text-2']};
`;

export const cardFooter = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid ${themeVars['container-2']};
	padding-top: 0.625rem;
	margin-top: 0.25rem;
`;

export const footerTextWrapper = css`
	color: ${themeVars['text-3']};
	font-size: 0.75rem;
`;

export const footerActionWrapper = css`
	color: ${themeVars.accent};
	cursor: pointer;
	font-weight: 600;
`;

export const swatchList = css`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
`;

export const swatchItem = css`
	display: flex;
	align-items: center;
	gap: 0.625rem;
	padding: 0.375rem 0.625rem;
	background-color: ${themeVars['container-1']};
	border: 1px solid ${themeVars['container-2']};
	border-radius: 0.5rem;
	font-size: 0.78rem;
`;

export const colorPreview = css`
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 0.375rem;
	border: 1px solid ${themeVars['container-2']};
	flex-shrink: 0;
`;

export const tokenDetails = css`
	display: flex;
	flex-direction: column;
	min-width: 0;
	flex-grow: 1;
`;

export const tokenLabelWrapper = css`
	font-weight: 600;
	color: ${themeVars['text-1']};
`;

export const tokenValueString = css`
	color: ${themeVars['text-3']};
	font-size: 0.7rem;
	font-family: monospace;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`;
