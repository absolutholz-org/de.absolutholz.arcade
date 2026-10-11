import { css } from '@linaria/core';
import { themeVars } from '../../theme/theme.css';

export const showcaseContainer = css`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	font-family: 'Inter', system-ui, sans-serif;
	margin-top: 1.5rem;
	margin-bottom: 2.5rem;
`;

export const schemeGrid = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	align-items: start;

	@media (min-width: 1024px) {
		grid-template-columns: 1fr 1fr;
	}
`;

export const schemeCard = {
	light: css`
		background-color: ${themeVars.surface};
		color: ${themeVars['text-1']};
		padding: 1.75rem;
		border-radius: 1rem;
		border: 1px solid ${themeVars['container-2']};
		box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		color-scheme: light;
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
		gap: 1.5rem;
		color-scheme: dark;
	`,
};

export const schemeHeader = css`
	border-bottom: 2px solid ${themeVars['container-2']};
	padding-bottom: 0.75rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const schemeTitle = css`
	font-size: 1.15rem;
	font-weight: 700;
	color: ${themeVars['text-1']};
	margin: 0;
`;

export const patternsGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
	gap: 1rem;
`;

export const patternCard = css`
	background-color: ${themeVars['container-1']};
	border: 1px solid ${themeVars['container-2']};
	border-radius: 0.75rem;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	transition: transform 150ms ease, border-color 150ms ease;

	&:hover {
		border-color: ${themeVars.accent};
		transform: translateY(-2px);
	}
`;

export const swatch = css`
	width: 100%;
	height: 5rem;
	border-radius: 0.5rem;
	border: 1px solid ${themeVars['container-2']};
	position: relative;
	overflow: hidden;
`;

export const tokenInfo = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

export const tokenKey = css`
	font-weight: 700;
	font-size: 0.85rem;
	color: ${themeVars['text-1']};
`;

export const tokenVar = css`
	font-family: monospace;
	font-size: 0.75rem;
	color: ${themeVars['text-2']};
	word-break: break-all;
`;
