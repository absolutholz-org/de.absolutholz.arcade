import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const HeaderContainer = styled.header`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	background-color: ${themeColor('surface')};
	border-bottom: 1px solid ${themeColor('container-2')};
	gap: 0.75rem;
`;

export const LeftSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	> a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-sm);
		color: ${themeColor('text-1')};
		text-decoration: none;
		transition: background-color 150ms ease;

		&:hover {
			background-color: ${themeColor('container-1')};
		}

		&:focus-visible {
			outline: 2px solid ${themeColor('accent')};
			outline-offset: 2px;
		}
	}
`;

export const CenterSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
`;

export const MetaRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.8125rem;
	font-weight: 600;
	color: ${themeColor('text-2')};
	text-transform: uppercase;
	letter-spacing: 0.04em;
`;

export const StatusRow = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
`;

export const StatusBadge = styled.span`
	display: inline-flex;
	align-items: center;
	padding: 0.125rem 0.5rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 600;
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-2')};
	border: 1px solid ${themeColor('container-2')};

	&[data-variant='mistakes'][data-has-mistakes='true'] {
		color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		border-color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
	}
`;

export const HeaderButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	padding: 0;
	border: none;
	border-radius: var(--radius-sm);
	background: transparent;
	color: ${themeColor('text-1')};
	cursor: pointer;
	transition: background-color 150ms ease, color 150ms ease;

	&:hover {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('accent')};
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;
