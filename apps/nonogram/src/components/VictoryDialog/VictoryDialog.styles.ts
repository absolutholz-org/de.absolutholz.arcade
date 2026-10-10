import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const VictoryContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	width: 100%;
`;

export const PixelArtPreview = styled.div`
	display: grid;
	grid-template-columns: repeat(var(--preview-cols, 5), 1fr);
	grid-template-rows: repeat(var(--preview-rows, 5), 1fr);
	width: min(10rem, 40vmin);
	aspect-ratio: 1 / 1;
	background: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: var(--radius-md, 0.375rem);
	padding: 0.25rem;
	gap: 1px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

	> div {
		width: 100%;
		height: 100%;
		border-radius: 1px;

		&[data-filled='true'] {
			background-color: var(--art-color, ${themeColor('accent')});
		}

		&[data-filled='false'] {
			background-color: transparent;
		}
	}
`;

export const PuzzleTitle = styled.h3`
	font-size: 1.25rem;
	font-weight: 700;
	color: ${themeColor('text-1')};
	margin: 0;
	text-align: center;
`;

export const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.75rem;
	width: 100%;
`;

export const StatCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0.75rem;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md, 0.375rem);

	> span:first-child {
		font-size: 0.75rem;
		color: ${themeColor('text-3')};
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
	}

	> span:last-child {
		font-size: 1.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: ${themeColor('text-1')};
	}
`;

export const BestNotice = styled.div`
	font-size: 0.875rem;
	font-weight: 600;
	color: ${themeColor('accent')};
	text-align: center;
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.625rem;
	width: 100%;

	> button {
		width: 100%;
	}

	> a {
		color: ${themeColor('text-2')};
		font-size: 0.875rem;
		text-decoration: none;
		transition: color 150ms ease;

		&:hover {
			color: ${themeColor('accent')};
		}
	}
`;
