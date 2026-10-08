import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const SiteHeader = styled.header`
	align-items: center;
	border-bottom: 1px solid var(--color-container-2);
	box-sizing: border-box;
	display: flex;
	height: 4rem;
	justify-content: space-between;
	min-height: 4rem;
	padding: 0 var(--page-content-padding, ${space('xl')});
	width: 100%;
`;
