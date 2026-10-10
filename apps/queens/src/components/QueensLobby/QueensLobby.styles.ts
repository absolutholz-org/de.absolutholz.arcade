import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const LobbyContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
	max-width: 48rem;
	margin: 0 auto;
	padding: 1rem 0;
`;

export const HeroSection = styled.header`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	> h1 {
		font-size: 2.25rem;
		font-weight: 800;
		color: ${themeColor('text-1')};
		letter-spacing: -0.02em;
	}

	> p {
		font-size: 1rem;
		color: ${themeColor('text-2')};
		line-height: 1.5;
		max-width: 38rem;
	}
`;

export const ResumeCard = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('accent')};
	border-radius: var(--radius-md);
	gap: 1rem;

	.resume-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.resume-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}

	.resume-meta {
		font-size: 0.875rem;
		color: ${themeColor('text-2')};
	}
`;

export const DifficultyTabs = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0.5rem;
	background-color: ${themeColor('container-1')};
	padding: 0.375rem;
	border-radius: var(--radius-md);
	border: 1px solid ${themeColor('container-2')};

	@media (max-width: 600px) {
		grid-template-columns: repeat(2, 1fr);
	}
`;

export const TabButton = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.25rem;
	padding: 0.75rem 0.5rem;
	border: none;
	border-radius: var(--radius-sm);
	background: transparent;
	color: ${themeColor('text-2')};
	cursor: pointer;
	transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;

	.tab-title {
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.tab-size {
		font-size: 0.75rem;
		color: ${themeColor('text-3')};
	}

	&[data-active='true'] {
		background-color: ${themeColor('surface')};
		color: ${themeColor('accent')};
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

		.tab-size {
			color: ${themeColor('accent')};
			opacity: 0.85;
		}
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 1px;
	}
`;

export const PuzzlesSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	> h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}
`;

export const PuzzlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
	gap: 1rem;
`;

export const PuzzleCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1.25rem;
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

	&:hover {
		border-color: ${themeColor('accent')};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.puzzle-num {
		font-size: 1.0625rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}

	.completed-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: ${themeColor('accent')};
		background-color: ${themeColor('container-1')};
		padding: 0.2rem 0.5rem;
		border-radius: 9999px;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8125rem;
		color: ${themeColor('text-2')};
	}
`;

export const QuickLinks = styled.div`
	display: flex;
	gap: 1.5rem;
	padding-top: 1rem;
	border-top: 1px solid ${themeColor('container-2')};

	> a {
		color: ${themeColor('text-2')};
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 150ms ease;

		&:hover {
			color: ${themeColor('accent')};
			text-decoration: underline;
		}

		&:focus-visible {
			outline: 2px solid ${themeColor('accent')};
			outline-offset: 2px;
		}
	}
`;
