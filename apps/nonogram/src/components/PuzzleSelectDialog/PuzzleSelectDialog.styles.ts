import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ContentRoot = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	padding: 0.5rem 0;
	min-width: min(calc(100vw - 4rem), 26rem);
	max-height: 70vh;
	overflow-y: auto;
`;

export const DifficultyGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	> h4 {
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05ch;
		color: ${themeColor('text-2')};
		margin: 0;
	}
`;

export const PuzzlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
	gap: 0.5rem;
`;

export const PuzzleCard = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0.625rem 0.5rem;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md, 0.375rem);
	cursor: pointer;
	text-align: center;
	gap: 0.375rem;
	transition: border-color 150ms ease, transform 150ms ease, background-color 150ms ease;

	&:hover {
		border-color: ${themeColor('accent')};
		transform: translateY(-2px);
		background-color: ${themeColor('container-2')};
	}

	&[data-active='true'] {
		border-color: ${themeColor('accent')};
		box-shadow: 0 0 0 2px ${themeColor('accent')};
	}

	> .puzzle-title {
		font-size: 0.8125rem;
		font-weight: 600;
		color: ${themeColor('text-1')};
	}

	> .puzzle-badge {
		font-size: 0.6875rem;
		color: ${themeColor('text-3')};
		font-variant-numeric: tabular-nums;
	}

	> .solved-indicator {
		font-size: 0.6875rem;
		font-weight: 600;
		color: ${themeColor('accent')};
	}
`;
