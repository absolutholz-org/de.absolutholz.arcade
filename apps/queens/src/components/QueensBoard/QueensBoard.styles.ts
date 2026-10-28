import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: calc(100dvh - var(--game-header-height, 3.5rem) - 15rem);
	aspect-ratio: 1;
	margin-inline: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	touch-action: none;
	min-height: 0;
	flex-shrink: 1;

	@media (min-width: 640px) {
		max-width: calc(100dvh - var(--game-header-height, 3.5rem) - 12rem);
	}
`;

export const GridContainer = styled.div`
	width: 100%;
	height: 100%;
	display: grid;
	border: 3px solid ${themeColor('text-1')};
	border-radius: var(--radius-sm);
	overflow: hidden;
	background-color: ${themeColor('surface')};
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);

	&[data-size='6'] {
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(6, 1fr);
	}

	&[data-size='8'] {
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
	}

	&[data-size='10'] {
		grid-template-columns: repeat(10, 1fr);
		grid-template-rows: repeat(10, 1fr);
	}

	&[data-size='12'] {
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(12, 1fr);
	}
`;

export const GridRow = styled.div`
	display: contents;
`;

export const SrOnly = styled.div`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
`;
