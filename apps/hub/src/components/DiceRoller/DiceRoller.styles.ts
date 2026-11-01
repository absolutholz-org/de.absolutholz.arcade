import { css } from '@linaria/core';

export const Container = css`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.5rem;
	width: 100%;
	padding: 0 0 2rem;
`;

export const UtilityHeader = css`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	gap: 1rem;
	flex-wrap: wrap;
`;

export const StyledDiceTrayWrapper = css`
	display: inline-flex;
	max-width: 100%;
`;
