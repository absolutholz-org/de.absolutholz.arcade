import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const VictoryContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	width: 100%;
	text-align: center;
`;

export const VisualSlot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
`;

export const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.625rem;
	width: 100%;

	&[data-columns='2'] {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	&[data-columns='3'] {
		grid-template-columns: repeat(2, minmax(0, 1fr));

		@media (min-width: 480px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.75rem;
		}
	}
`;

export const StatCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	padding: 0.75rem 0.625rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	width: 100%;
	min-width: 0;

	@media (min-width: 480px) {
		padding: 0.875rem 1.25rem;
	}

	> span[data-slot='label'] {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05ch;
		color: ${themeColor('text-2')};
	}

	> span[data-slot='value'] {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: ${themeColor('text-1')};
	}
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	width: 100%;
	margin-top: 0.5rem;
`;

export const SplitActions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	width: 100%;

	> button,
	> a {
		flex: 1 1 9rem;
		min-width: 0;
		justify-content: center;
	}
`;

export const FooterLinks = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.375rem 0.75rem;
	width: 100%;
`;

export const SecondaryActions = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.625rem;
	width: 100%;

	> a,
	> button {
		color: ${themeColor('text-2')};
		font-size: 0.875rem;
		text-decoration: underline;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.5rem;

		&:hover {
			color: ${themeColor('text-1')};
		}
	}
`;
