import { css } from '@linaria/core';

export const boardWrapper = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 0.25rem;
`;

export const rackContainer = css`
	display: grid;
	justify-content: center;
	justify-items: center;
	align-items: end;
	width: fit-content;
	max-width: 100%;
	gap: 1.5rem 0.75rem;
	padding: 1.75rem 1.25rem 1.25rem;
	border-radius: 1.25rem;
	background: var(--color-surface-container, light-dark(#f1f3f5, #212529));
	box-shadow: inset 0 0.125rem 0.375rem rgba(0, 0, 0, 0.05);

	@media (min-width: 640px) {
		gap: 1.75rem 1rem;
		padding: 2rem 2rem 1.5rem;
	}

	@media (max-width: 360px) {
		gap: 1.25rem 0.375rem;
		padding: 1.5rem 0.5rem 1rem;
	}

	/* Easy (6 tubes): 1 row on tablet/desktop, 2 balanced rows (3 + 3) on mobile */
	&[data-tubes="6"] {
		grid-template-columns: repeat(3, auto);
		@media (min-width: 480px) {
			grid-template-columns: repeat(6, auto);
		}
	}

	/* Medium (8 tubes): 1 row on wide desktop, 2 balanced rows (4 + 4) on mobile/tablet */
	&[data-tubes="8"] {
		grid-template-columns: repeat(4, auto);
		@media (min-width: 860px) {
			grid-template-columns: repeat(8, auto);
		}
	}

	/* Hard (10 tubes): 2 balanced rows of 5 (5 + 5) */
	&[data-tubes="10"] {
		grid-template-columns: repeat(5, auto);
	}

	/* Expert (12 tubes): 2 balanced rows of 6 (6 + 6) */
	&[data-tubes="12"] {
		grid-template-columns: repeat(6, auto);
	}
`;
