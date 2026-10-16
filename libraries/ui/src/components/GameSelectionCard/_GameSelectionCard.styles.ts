import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Header = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 0.5rem;
	width: 100%;
`;

export const Title = styled.h3`
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
	line-height: 1.3;
	color: ${themeColor('text-1')};
`;

export const Metadata = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.375rem 0.75rem;
	font-size: 0.875rem;
	color: ${themeColor('text-2')};
`;

export const PreviewContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: ${radiusScale.md};
	background-color: ${themeColor('container-2')};
	overflow: hidden;
	aspect-ratio: 16 / 9;
`;
