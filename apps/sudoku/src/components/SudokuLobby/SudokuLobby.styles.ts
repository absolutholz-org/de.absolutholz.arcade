import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const LobbyContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	width: 100%;
`;

export const HeroSection = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;

	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		color: ${themeColor('text-1')};
		margin: 0;
	}

	p {
		font-size: 1.125rem;
		color: ${themeColor('text-2')};
		margin: 0;
	}
`;

export const ResumeCard = styled.div`
	background: ${themeColor('container-2')};
	border: 2px solid ${themeColor('accent')};
	border-radius: var(--radius-lg, 0.75rem);
	padding: 1.5rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;

	.resume-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		.resume-title {
			font-size: 1.125rem;
			font-weight: 700;
			color: ${themeColor('text-1')};
		}

		.resume-meta {
			font-size: 0.875rem;
			color: ${themeColor('text-2')};
		}
	}
`;

export const DifficultySection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;

	h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin: 0;
	}
`;

export const DifficultyGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
	gap: 1rem;

	.difficulty-card {
		background: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};
		border-radius: var(--radius-md, 0.5rem);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
		transition: transform 150ms ease, border-color 150ms ease;

		&:hover {
			border-color: ${themeColor('accent')};
			transform: translateY(-2px);
		}

		.diff-name {
			font-size: 1.125rem;
			font-weight: 600;
			color: ${themeColor('text-1')};
		}

		.diff-best {
			font-size: 0.8125rem;
			color: ${themeColor('text-2')};
		}

		.diff-cta {
			font-size: 0.875rem;
			font-weight: 600;
			color: ${themeColor('accent')};
			align-self: flex-start;
		}
	}
`;

export const QuickLinks = styled.div`
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	border-top: 1px solid ${themeColor('container-2')};
	padding-top: 2rem;

	a {
		color: ${themeColor('accent')};
		font-weight: 600;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
`;
