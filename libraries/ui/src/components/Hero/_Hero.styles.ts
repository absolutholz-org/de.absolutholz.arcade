import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import { generateFontShorthand } from '../Text/_Text.functions';

export const Hero = styled.header`
	display: flex;
	align-items: center;
	flex-direction: row;
	gap: ${space('lg')};
	padding-block: ${space('3xl')} ${space('xl')};
	text-align: left;
	width: 100%;

	@media (max-width: 600px) {
		align-items: flex-start;
		flex-direction: column;
		gap: ${space('md')};
	}
`;

export const Hero_Visual = styled.div`
	display: inline-flex;
	flex-shrink: 0;
`;

export const Hero_Body = styled.div`
	display: block;

	& > * + * {
		margin-top: ${space('2xs')};
	}
`;

export const Hero_Title = styled.h1`
	color: ${themeColor('text-1')};
	font: ${generateFontShorthand('display', 'bold')};
	margin: 0;
`;

export const Hero_Tagline = styled.p`
	color: ${themeColor('text-2')};
	font: ${generateFontShorthand('h3', 'regular')};
	margin: 0;
`;

export const Hero_Actions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${space('sm')};
	margin-top: ${space('sm')};
`;
