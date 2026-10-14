import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Root = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('2xl')};
	width: 100%;
	padding-top: ${space('lg')};
	padding-bottom: ${space('2xl')};
`;

export const HeaderZone = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('lg')};
	width: 100%;
`;

export const MainZone = styled.main`
	width: 100%;
`;

export const FooterZone = styled.footer`
	width: 100%;
	border-top: 1px solid ${themeColor('container-2')};
	padding-top: ${space('xl')};
`;

export const FooterNav = styled.nav`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: ${space('lg')};

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

		&:focus-visible {
			outline: 2px solid ${themeColor('accent')};
			outline-offset: 2px;
		}
	}
`;
