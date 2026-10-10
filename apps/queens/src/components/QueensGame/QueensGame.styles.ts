import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const GameRoot = styled.main`
	position: relative;
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	user-select: none;
`;

export const GameViewport = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem 0.75rem 1.5rem;
	width: 100%;
	max-width: 44rem;
	margin: 0 auto;
	position: relative;
`;
