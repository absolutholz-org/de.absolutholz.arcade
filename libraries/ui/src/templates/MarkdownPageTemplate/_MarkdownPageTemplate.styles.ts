import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const ActionArea = styled.div`
	align-items: center;
	border-top: 1px solid ${themeColor('container-2')};
	display: flex;
	justify-content: center;
	margin-top: ${space('3xl')};
	padding-top: ${space('2xl')};
`;
