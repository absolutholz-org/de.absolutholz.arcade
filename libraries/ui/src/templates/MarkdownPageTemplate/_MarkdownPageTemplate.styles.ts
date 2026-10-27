import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const ActionArea = styled.div`
	align-items: center;
	border-top: 1px solid var(--color-container-2);
	display: flex;
	justify-content: center;
	margin-top: ${space('3xl')};
	padding-top: ${space('2xl')};
`;
