import { css } from '@linaria/core';

export const FavoritesSectionRoot = css`
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

export const QuickLaunchStrip = css`
	display: flex;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	-webkit-overflow-scrolling: touch;
	gap: 0.75rem;
	padding-bottom: 0.5rem;
	scrollbar-width: thin;
	scrollbar-color: var(--color-container-3) transparent;

	&::-webkit-scrollbar {
		height: 4px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--color-container-3);
		border-radius: var(--radius-pill, 9999px);
	}

	@media (min-width: 768px) {
		flex-wrap: wrap;
		overflow-x: visible;
		scroll-snap-type: none;
		padding-bottom: 0;
	}
`;

export const QuickLaunchItem = css`
	width: auto;
	height: auto;
	flex-direction: row;
	align-items: center;
	flex-shrink: 0;
	scroll-snap-align: start;
	min-height: 44px;
	min-width: 44px;
	padding: 0.625rem 1rem;
	gap: 0.625rem;
	white-space: nowrap;
`;

export const QuickLaunchIcon = css`
	font-size: 1.5rem;
	line-height: 1;
	flex-shrink: 0;
`;

export const QuickLaunchTitle = css`
	font-size: 0.9375rem;
	font-weight: 600;
	line-height: 1.25;
	color: var(--color-text-1);
`;
