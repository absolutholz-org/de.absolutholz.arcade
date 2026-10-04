import { styled } from '@linaria/react';
import { generateFontShorthand } from './_Text.functions';

export const Text = styled.div`
	font: ${generateFontShorthand('base', 'regular')};
	text-wrap: pretty;

	&[data-wrap='balance'] {
		text-wrap: balance;
	}

	&[data-wrap='truncate'] {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&[data-wrap='normal'] {
		text-wrap: wrap;
	}
`;

export const Small = styled(Text)`
	font: ${generateFontShorthand('small', 'regular')};
`;

export const H3 = styled(Text)`
	font: ${generateFontShorthand('h3', 'bold')};
`;

export const H2 = styled(Text)`
	font: ${generateFontShorthand('h2', 'bold')};
`;

export const H1 = styled(Text)`
	font: ${generateFontShorthand('h1', 'bold')};
`;

export const Display = styled(Text)`
	font: ${generateFontShorthand('display', 'bold')};
`;
