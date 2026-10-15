import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: min(calc(100vw - 1.5rem), calc(100vh - 16rem), 38rem);
	aspect-ratio: 1 / 1;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	touch-action: manipulation;
`;

export const SvgCanvas = styled.svg`
	width: 100%;
	height: 100%;
	border: 2px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
	overflow: hidden;
`;

export const GridDot = styled.circle`
	fill: ${themeColor('container-2')};
	opacity: 0.5;
`;
