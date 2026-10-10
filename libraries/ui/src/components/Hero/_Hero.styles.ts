import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import { generateFontShorthand } from '../Text/_Text.functions';

export const Hero = styled.header`
	display: flex;
	padding-block: ${space('3xl')} ${space('xl')};
	width: 100%;

	&[data-align='left'] {
		align-items: center;
		flex-direction: row;
		gap: ${space('lg')};
		text-align: left;

		@media (max-width: 600px) {
			align-items: flex-start;
			flex-direction: column;
			gap: ${space('md')};
		}
	}

	&[data-align='center'] {
		align-items: center;
		flex-direction: column;
		gap: ${space('md')};
		text-align: center;
	}
`;

export const Hero_Visual = styled.div`
	display: inline-flex;
	flex-shrink: 0;
`;

export const Hero_Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('2xs')};
`;

export const Hero_Title = styled.h1`
	color: ${themeColor('text-1')};
	font: ${generateFontShorthand('display', 'bold')};
	/* letter-spacing: -0.03em; */
`;

export const Hero_Tagline = styled.p`
	color: ${themeColor('text-2')};
	font: ${generateFontShorthand('h3', 'regular')};
`;

export const Hero_Actions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${space('sm')};
	margin-top: ${space('sm')};
`;
