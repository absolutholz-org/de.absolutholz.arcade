import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const GameRoot = styled.main`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	width: 100vw;
	min-height: 100dvh;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	overflow-x: hidden;
`;

export const BoardArea = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	flex: 1;
	padding: 1rem 0.5rem;
`;
