import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
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
	gap: 0.75rem;
	flex-wrap: wrap;
`;

export const StyledDiceTrayWrapper = css`
	display: flex;
	width: 100%;
`;

export const HistorySection = css`
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
	width: 100%;
	padding: 1rem 1.25rem;
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
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
	color: ${themeColor('text-2')};
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
	color: ${themeColor('text-2')};
`;
