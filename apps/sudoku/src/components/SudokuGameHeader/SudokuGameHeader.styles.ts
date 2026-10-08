import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const HeaderContainer = styled.header`
	width: 100%;
	max-width: min(calc(100vw - 1rem), 34rem);
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.125rem 0 0.25rem;
	user-select: none;

	@media (min-width: 640px) {
		max-width: min(calc(100vw - 2rem), 34rem);
		padding: 0.25rem 0 0.5rem;
	}
`;

export const LeftSection = styled.div`
	display: flex;
	align-items: center;

	> a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-sm);
		border: 1px solid ${themeColor('container-2')};
		background-color: ${themeColor('surface')};
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
	justify-content: center;
	gap: 0.125rem;
`;

export const DifficultyText = styled.span`
	font-size: 0.6875rem;
	font-weight: 700;
	color: ${themeColor('text-2')};
	text-transform: uppercase;
	letter-spacing: 0.08ch;
	line-height: 1;
`;

export const RightSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;

	> button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-sm);
		border: 1px solid ${themeColor('container-2')};
		background-color: ${themeColor('surface')};
		color: ${themeColor('text-1')};
		cursor: pointer;
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
