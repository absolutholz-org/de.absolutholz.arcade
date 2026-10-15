import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const VictoryContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	padding: 0.5rem 0;
	text-align: center;
	min-width: min(calc(100vw - 4rem), 22rem);
`;

export const TimeCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.375rem;
	padding: 1rem 1.5rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	width: 100%;

	> span[data-slot='label'] {
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05ch;
		color: ${themeColor('text-2')};
	}
`;

export const BestTimeBadge = styled.div`
	display: inline-flex;
	align-items: center;
	padding: 0.375rem 0.75rem;
	border-radius: 9999px;
	background-color: ${themeColor('accent')};
	color: ${themeColor('accent-contrast')};
	font-size: 0.8125rem;
	font-weight: 700;
	letter-spacing: 0.03ch;
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	width: 100%;
	margin-top: 0.5rem;

	> a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 1rem;
		border-radius: var(--radius-sm);
		border: 1px solid ${themeColor('container-2')};
		background-color: ${themeColor('surface')};
		color: ${themeColor('text-1')};
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: background-color 150ms ease;

		&:hover {
			background-color: ${themeColor('container-1')};
		}
	}
`;
