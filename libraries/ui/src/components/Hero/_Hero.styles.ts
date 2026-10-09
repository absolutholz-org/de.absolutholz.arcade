import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const Hero = styled.header`
	display: flex;
	margin-bottom: ${space('xl')};
	width: 100%;

	&[data-align='left'] {
		align-items: center;
		flex-direction: row;
		gap: ${space('lg')};
		text-align: left;

		@media (max-width: 600px) {
			align-items: flex-start;
			flex-direction: column;
			gap: ${space('md')};
		}
	}

	&[data-align='center'] {
		align-items: center;
		flex-direction: column;
		gap: ${space('md')};
		text-align: center;
	}

	.hero-visual {
		display: inline-flex;
		flex-shrink: 0;
	}

	.hero-body {
		display: flex;
		flex-direction: column;
		gap: ${space('2xs')};
	}

	.hero-title {
		color: var(--color-text-1);
		font-size: 3rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin: 0;

		@media (max-width: 600px) {
			font-size: 2.25rem;
		}
	}

	.hero-tagline {
		color: var(--color-text-2);
		font-size: 1.25rem;
		line-height: 1.4;
		margin: 0;

		@media (max-width: 600px) {
			font-size: 1.125rem;
		}
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: ${space('sm')};
		margin-top: ${space('sm')};
	}
`;
