import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
`;

export const FavoriteWrapper = styled.div`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	z-index: 2;
`;

export const Icon = styled.span`
	font-size: 1.75rem;
	line-height: 1;
	flex-shrink: 0;
`;

export const Title = styled.h3`
	font-size: 1.25rem;
	font-weight: 600;
	line-height: 1.3;
	margin: 0;
	color: ${themeColor('text-1')};
	min-width: 0;
`;

export const Description = styled.p`
	font-size: 0.875rem;
	line-height: 1.5;
	color: ${themeColor('text-2')};
	margin: 0;
	flex-grow: 1;
`;

export const Footer = styled.footer`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.5rem;
	width: 100%;
`;
