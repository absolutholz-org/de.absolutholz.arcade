import { css } from '@linaria/core';
import { styled } from '@linaria/react';
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
	display: flex;
	flex-wrap: wrap;
	gap: ${space('xs')};
	margin-top: ${space('sm')};
`;
