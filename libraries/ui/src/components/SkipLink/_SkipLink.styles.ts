import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const SkipLink = styled.a`
	background: var(--color-accent);
	border-radius: var(--radius-sm);
	color: #ffffff;
	font-weight: 600;
	left: ${space('md')};
	padding: ${space('xs')} ${space('md')};
	position: absolute;
	top: -3rem;
	transition: top 150ms ease;
	z-index: 100;

	&:focus {
		top: ${space('md')};
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}
`;
