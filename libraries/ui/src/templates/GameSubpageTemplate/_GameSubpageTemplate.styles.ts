import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Container = styled.div`
	display: block;
	padding-block: ${space('md')} ${space('xl')};

	& > * + * {
		margin-top: ${space('lg')};
	}
`;

export const Hero = styled.header`
	display: block;
`;

export const Title = styled.h1`
	color: ${themeColor('text-1')};
	font-size: 2.25rem;
	font-weight: 800;
	line-height: 1.2;
	margin: 0;

	&:has(+ p) {
		margin-bottom: ${space('xs')};
	}
`;

export const Subtitle = styled.p`
	color: ${themeColor('text-2')};
	font-size: 1.125rem;
	line-height: 1.5;
	margin: 0;
`;

export const Footer = styled.footer`
	border-top: 1px solid ${themeColor('container-2')};
	margin-top: ${space('xl')};
	padding-top: ${space('xl')};
`;
