import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const FooterZone = styled.footer`
	border-top: 1px solid ${themeColor('container-2')};
	margin-top: ${space('xl')};
	padding-top: ${space('xl')};
`;

export const FooterNav = styled.nav`
	a,
	button {
		background: none;
		border: none;
		color: ${themeColor('text-2')};
		cursor: pointer;
		font-family: inherit;
		font-size: 0.9375rem;
		font-weight: 600;
		text-decoration: none;
		padding: ${space('xs')} ${space('sm')};
		border-radius: 0.25rem;
		min-height: 24px;
		display: inline-flex;
		align-items: center;
		transition: color 150ms ease;

		&:hover {
			color: ${themeColor('accent')};
		}

		${focusVisibleRing}
	}
`;
