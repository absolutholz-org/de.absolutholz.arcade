import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const PopoverContent = styled.div`
	/* Popover user-agent reset */
	border: 1px solid ${themeColor('container-2')};
	margin: 0;
	padding: 1rem;
	inset: auto;
	position: fixed;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border-radius: ${radiusScale.lg};
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.12),
		0 0.125rem 0.375rem rgba(0, 0, 0, 0.08);
	font-family: inherit;
	font-size: 0.9375rem;
	line-height: 1.5;
	min-width: 12rem;
	max-width: calc(100vw - 2rem);
	z-index: 1000;
	outline: none;
`;
