import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const LanguageRedirectFallback = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: var(--space-xl) var(--space-md);
	text-align: center;
	color: ${themeColor('text-1')};

	> h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 var(--space-sm) 0;
	}

	> p {
		font-size: 1rem;
		color: ${themeColor('text-2')};
		line-height: 1.5;
		margin: 0 0 var(--space-xl) 0;
		max-width: 32rem;
	}

	> nav {
		width: 100%;
		max-width: 40rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		justify-content: center;
		align-items: center;
	}

	li {
		margin: 0;
		padding: 0;
	}

	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
		min-height: 2.75rem;
		min-width: 3rem;
		padding: var(--space-xs) var(--space-lg);
		border-radius: ${radiusScale.pill};
		border: 1px solid ${themeColor('container-2')};
		background-color: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9375rem;
		transition: background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease,
			transform 120ms ease;

		&:hover {
			border-color: ${themeColor('accent')};
			background-color: ${themeColor('container-2')};
			transform: translateY(-1px);
		}

		&:focus-visible {
			outline: 2px solid ${themeColor('accent')};
			outline-offset: 2px;
		}

		> span[data-slot='flag'] {
			font-size: 1.25rem;
			line-height: 1;
		}

		> span[data-slot='label'] {
			line-height: 1.25;
		}
	}
`;
