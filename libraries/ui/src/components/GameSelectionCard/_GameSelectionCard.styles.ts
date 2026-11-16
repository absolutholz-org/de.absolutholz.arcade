import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import { generateFontShorthand } from '../Text/_Text.functions';

export const card = css`
	display: block;
	font: ${generateFontShorthand('base', 'regular')};
	color: ${themeColor('text-2')};
`;

export const Title = styled.h3`
	margin: 0;
	font: ${generateFontShorthand('h3', 'bold')};
	color: ${themeColor('text-1')};
`;

export const Content = styled.div`
	margin-top: ${space('xs')};
	font: ${generateFontShorthand('base', 'regular')};
	color: ${themeColor('text-2')};
`;

export const Metadata = styled.div`
	margin-top: ${space('xs')};
`;

export const MetadataPill = styled.span`
	display: inline-block;
	padding: 0.125rem 0.5rem;
	margin-right: ${space('xs')};
	margin-top: ${space('xs')};
	border-radius: ${radiusScale.pill};
	background-color: ${themeColor('container-2')};
	border: 1px solid ${themeColor('container-2')};
	font: ${generateFontShorthand('small', 'regular')};
	line-height: 1.3;
	color: ${themeColor('text-2')};
	white-space: nowrap;
`;
