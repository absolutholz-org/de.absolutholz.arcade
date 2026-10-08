import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	width: 100%;
	max-width: 52rem;
	margin: 0 auto;
`;

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;

	h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin: 0;
		border-bottom: 2px solid ${themeColor('container-2')};
		padding-bottom: 0.5rem;
	}
`;

export const DifficultyBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: ${themeColor('text-2')};
		margin: 0;
	}
`;

export const ScoresList = styled.ol`
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	gap: 0.75rem;
	counter-reset: highscores;
`;

export const ScoreCard = styled.li`
	counter-increment: highscores;
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.875rem 1rem;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md, 0.5rem);

	&.highlighted {
		border: 2px solid ${themeColor('accent')};
		background: ${themeColor('container-2')};
	}

	&::before {
		content: counter(highscores) '.';
		font-size: 1.5rem;
		font-weight: 800;
		color: ${themeColor('accent')};
		min-width: 2ch;
		text-align: right;
	}

	.score-details {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;

		.score-time {
			font-size: 1.125rem;
			font-weight: 700;
			color: ${themeColor('text-1')};
		}

		.score-date {
			font-size: 0.75rem;
			color: ${themeColor('text-3')};
		}
	}

	.highlight-badge {
		position: absolute;
		top: -0.5rem;
		right: 0.5rem;
		background: ${themeColor('accent')};
		color: ${themeColor('surface')};
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}
`;

export const NoScores = styled.p`
	margin: 0;
	font-size: 0.875rem;
	color: ${themeColor('text-3')};
	font-style: italic;
`;

export const Actions = styled.div`
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	margin-top: 1rem;
`;
