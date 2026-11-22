import { css } from '@linaria/core';

export const FavoritesSectionRoot = css`
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

export const FavoritesHeader = css`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 0.75rem;
`;

export const QuickLaunchStrip = css`
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
`;

export const QuickLaunchItemWrapper = css`
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	flex-shrink: 0;
	scroll-snap-align: start;
`;

export const QuickLaunchItem = css`
	width: auto;
	height: auto;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	min-height: 44px;
	min-width: 44px;
	padding: 0.625rem;
`;

export const QuickLaunchIcon = css`
	font-size: 1.5rem;
	line-height: 1;
	flex-shrink: 0;
`;
