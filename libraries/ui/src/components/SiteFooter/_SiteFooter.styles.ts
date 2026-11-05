import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const SiteFooter = styled.footer`
	background-color: var(--color-surface);
	border-top: 1px solid var(--color-container-2);
	color: var(--color-text-1);
	margin-top: ${space('2xl')};
	padding-top: ${space('lg')};
	padding-bottom: calc(${space('lg')} + env(safe-area-inset-bottom, 0px));
	width: 100%;

	@media (min-width: 1024px) {
		margin-top: ${space('3xl')};
		padding-top: ${space('2xl')};
		padding-bottom: calc(${space('xl')} + env(safe-area-inset-bottom, 0px));
	}

	/* Primary Tier 1 4-column grid */
	.site-footer-grid {
		display: grid;
		gap: ${space('md')};
		grid-template-columns: 1fr;
		width: 100%;

		@media (min-width: 640px) {
			gap: ${space('lg')};
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: 1024px) {
			gap: ${space('2xl')};
			grid-template-columns: 1.25fr 1fr 1fr 1fr;
		}
	}

	.site-footer-column {
		min-width: 0;
	}

	/* Brand & Actions Column (pure block flow, no flex column) */
	.site-footer-brand-link {
		align-items: center;
		color: var(--color-text-1);
		display: inline-flex;
		gap: ${space('xs')};
		text-decoration: none;

		&:hover .site-footer-brand-title {
			color: var(--color-accent);
		}

		&:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}
	}

	.site-footer-brand-title {
		color: var(--color-text-1);
		font-size: var(--font-size-h3);
		font-weight: 700;
		line-height: var(--line-height-h3);
		transition: color 0.15s ease-in-out;
	}

	.site-footer-tagline {
		color: var(--color-text-2);
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		margin: ${space('2xs')} 0 ${space('xs')};
		max-width: 22rem;

		@media (min-width: 1024px) {
			margin: ${space('xs')} 0 ${space('md')};
		}
	}

	.footer-share-slot {
		min-height: 1.5rem;
	}

	/* Column Navigation Headings */
	.site-footer-heading {
		color: var(--color-text-2);
		font-size: var(--font-size-small);
		font-weight: 700;
		letter-spacing: 0.06em;
		line-height: var(--line-height-small);
		margin: 0 0 ${space('2xs')};
		text-transform: uppercase;

		@media (min-width: 1024px) {
			margin: 0 0 ${space('sm')};
		}
	}

	/* Navigation Link Lists */
	.site-footer-list {
		display: flex;
		flex-direction: column;
		gap: ${space('3xs')};
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.site-footer-list-item {
		margin: 0;
	}

	/* Interactive Footer Links */
	.site-footer-link {
		align-items: center;
		border-radius: var(--radius-sm);
		color: var(--color-text-1);
		display: inline-flex;
		font-size: var(--font-size-small);
		gap: ${space('3xs')};
		line-height: var(--line-height-small);
		padding-block: ${space('3xs')};
		text-decoration: none;

		&:hover {
			color: var(--color-accent);
			text-decoration: underline;
		}

		&:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}
	}

	.external-indicator {
		display: inline-block;
		font-size: 0.85em;
		line-height: 1;
		opacity: 0.8;
	}

	/* Tier 2: Legal & Utility Bar (Sub-Footer) */
	.site-footer-subfooter {
		align-items: center;
		border-top: 1px solid var(--color-container-2);
		display: flex;
		flex-direction: column;
		gap: ${space('sm')};
		margin-top: ${space('lg')};
		padding-top: ${space('md')};
		width: 100%;

		@media (min-width: 768px) {
			flex-direction: row;
			gap: ${space('md')};
			justify-content: space-between;
			margin-top: ${space('2xl')};
			padding-top: ${space('lg')};
		}
	}

	.site-footer-identity {
		align-items: center;
		color: var(--color-text-2);
		display: flex;
		flex-wrap: wrap;
		font-size: var(--font-size-small);
		gap: ${space('xs')};
		justify-content: center;
		line-height: var(--line-height-small);

		@media (min-width: 768px) {
			justify-content: flex-start;
		}
	}

	.site-footer-copyright {
		white-space: nowrap;
	}

	.site-footer-version {
		font-size: 0.75rem;
		opacity: 0.75;
		white-space: nowrap;
	}

	.site-footer-legal-list {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: ${space('xs')} ${space('md')};
		justify-content: center;
		list-style: none;
		margin: 0;
		padding: 0;

		@media (min-width: 768px) {
			justify-content: flex-end;
		}
	}

	.site-footer-legal-item {
		margin: 0;
	}
`;
