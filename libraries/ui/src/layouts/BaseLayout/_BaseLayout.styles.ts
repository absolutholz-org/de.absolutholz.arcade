import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const Root = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	min-height: 100dvh;
	width: 100%;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
`;
