import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PlayColumn = styled.div`
	width: 100%;
	max-width: min(calc(100vw - 1rem), 34rem);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0.25rem 0.5rem 0.75rem;
	gap: 0.375rem;
	margin: 0 auto;

	@media (min-width: 640px) {
		max-width: min(calc(100vw - 2rem), 34rem);
		padding: 0.5rem 1rem 1rem;
		gap: 0.75rem;
	}
`;

export const BoardWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 0.25rem 0;

	@media (min-width: 640px) {
		padding: 0.5rem 0;
	}
`;

export const GameFooter = styled.footer`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
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
