import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const ContentWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	width: 100%;
`;

export const IconContainer = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 3rem;
	height: 3rem;
	border-radius: ${radiusScale.md};
	background-color: oklch(from ${themeColor('accent')} l c h / 0.12);
	color: ${themeColor('accent')};
	font-size: 1.5rem;
`;

export const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	text-align: left;
`;

export const Title = styled.h3`
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
	line-height: 1.3;
	color: ${themeColor('text-1')};
`;

export const Subtitle = styled.span`
	font-size: 0.875rem;
	color: ${themeColor('text-2')};
	line-height: 1.3;
`;
