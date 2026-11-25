import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const SkipLink = styled.a`
	background: ${themeColor('accent')};
	border-radius: var(--radius-sm);
	color: ${themeColor('accent-contrast')};
	font-weight: 600;
	left: ${space('md')};
	padding: ${space('xs')} ${space('md')};
	position: absolute;
	top: -3rem;
	transition: top 150ms ease;
	z-index: 100;

	&:focus {
		top: ${space('md')};
		outline: 2px solid ${themeColor('accent-contrast')};
		outline-offset: 2px;
	}
`;
