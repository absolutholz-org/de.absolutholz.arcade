import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const SiteFooter = styled.footer`
	align-items: center;
	border-top: 1px solid var(--color-container-2);
	display: flex;
	flex-direction: column;
	gap: ${space('md')};
	margin-top: ${space('3xl')};
	padding: ${space('lg')} var(--page-content-padding, ${space('xl')});
	text-align: center;
	width: 100%;

	/* Subtle dividers between clusters on mobile */
	> *:not(:first-child) {
		@media (max-width: 767px) {
			border-top: 1px solid var(--color-container-2);
			padding-top: ${space('md')};
			width: 100%;
		}
	}

	@media (min-width: 768px) {
		align-items: center;
		display: grid;
		gap: var(--page-content-padding, ${space('xl')});
		grid-template-columns: 1fr auto 1fr;
		padding: ${space('md')} var(--page-content-padding, ${space('xl')});
		text-align: initial;
	}

	/* Nav landmark resets and horizontal layout */
	nav ul {
		align-items: center;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: ${space('2xs')} ${space('xs')};
		justify-content: center;
		list-style: none;
	}

	/* Cluster A: Legal navigation */
	.site-footer-legal {
		@media (min-width: 768px) {
			grid-column: 1;
			justify-self: start;

			ul {
				justify-content: flex-start;
			}
		}
	}

	/* Cluster B: Identity & Copyright notice */
	.site-footer-identity {
		align-items: baseline;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: ${space('2xs')} ${space('xs')};
		justify-content: center;

		@media (min-width: 768px) {
			grid-column: 2;
			justify-self: center;
		}
	}

	/* Cluster C: Project & Resource navigation */
	.site-footer-resources {
		@media (min-width: 768px) {
			grid-column: 3;
			justify-self: end;

			ul {
				justify-content: flex-end;
			}
		}
	}

	/* Standalone centering when no navigation clusters exist (e.g. minimal game view) */
	&:not(:has(.site-footer-legal)):not(:has(.site-footer-resources)) {
		@media (min-width: 768px) {
			display: flex;
			justify-content: center;
		}
	}

	/* Interactive footer links */
	a {
		align-items: center;
		border-radius: var(--radius-sm);
		color: var(--color-text-1);
		display: inline-flex;
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		min-height: 1.5rem;
		padding: ${space('3xs')} ${space('2xs')};
		text-decoration: none;
		white-space: nowrap;

		&:hover {
			color: var(--color-accent);
			text-decoration: none;
		}
	}

	/* Identity typography */
	.site-footer-copyright {
		color: var(--color-text-2);
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		white-space: nowrap;
	}

	.site-footer-version {
		color: var(--color-text-2);
		font-size: 0.75rem;
		line-height: var(--line-height-small);
		opacity: 0.7;
		white-space: nowrap;
	}
`;
