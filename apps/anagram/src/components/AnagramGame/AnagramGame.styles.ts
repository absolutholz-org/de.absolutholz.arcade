import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PlayColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1.25rem;
	padding: 1rem 0.75rem 1.5rem;
	width: 100%;
	max-width: 44rem;
	margin: 0 auto;
	user-select: none;
`;

export const GameFooter = styled.footer`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 0.5rem 0 0.25rem;
`;

export const GameFooterLink = styled.a`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	font-weight: 500;
	color: ${themeColor('text-2')};
	text-decoration: none;
	padding: 0.375rem 0.75rem;
	border-radius: var(--radius-sm);
	transition:
		color 150ms ease,
		background-color 150ms ease;

	&:hover {
		color: ${themeColor('text-1')};
		background-color: ${themeColor('container-1')};
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;
