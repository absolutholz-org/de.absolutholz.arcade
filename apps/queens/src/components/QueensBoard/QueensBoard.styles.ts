import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: min(calc(100vw - 1.5rem), calc(100vh - 16rem), 36rem);
	aspect-ratio: 1 / 1;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	touch-action: none;
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
