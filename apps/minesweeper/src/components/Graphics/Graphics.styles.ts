import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { css } from '@linaria/core';

export const graphicContainer = css`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 3rem;
	padding: 0.5rem;
`;

export const sizeGrid = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	align-items: center;
`;

export const sizeRow = css`
	display: flex;
	gap: 0.25rem;
`;

export const sizeField = css`
	width: 1rem;
	height: 1rem;
	border-radius: 0.1875rem;
	background: ${themeColor('container-2')};
	border: 1px solid ${themeColor('text-3')};
`;

export const difficultyGrid = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	align-items: center;
`;

export const difficultyRow = css`
	display: flex;
	gap: 0.375rem;
`;

export const difficultyMine = css`
	width: 1rem;
	height: 1rem;
	color: ${themeColor('text-1')};
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 100%;
		height: 100%;
	}
`;
