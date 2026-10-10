import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';
import { space } from '../../styles/spacing';
import { generateFontShorthand } from '../Text/_Text.functions';

export const Breadcrumb = styled.nav`
	font: ${generateFontShorthand('small', 'regular')};
	margin-block: ${space('xl')};
`;

export const Breadcrumb_List = styled.ol`
	display: flex;
	flex-wrap: wrap;
	row-gap: 0.25rem;
`;

export const Breadcrumb_ListItem = styled.li`
`;

export const Breadcrumb_Separator = styled.span`
	color: ${themeColor('text-3')};
	margin-inline: 0.5rem;
	user-select: none;
`;

export const Breadcrumb_Link = styled.a`
	color: ${themeColor('text-2')};
	text-decoration: none;

	&:hover {
		color: ${themeColor('accent')};
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	&[data-home='true'] {
		align-items: center;
		display: inline-flex;
		line-height: 1;

		&:hover {
			opacity: 0.85;
		}
	}
`;

export const Breadcrumb_Span = styled.span`
	color: ${themeColor('text-1')};
	cursor: default;
	font-weight: 600;
`;
