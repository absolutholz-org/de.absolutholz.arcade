import { css } from '@linaria/core';

export const controlsDock = css`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
	padding: 0.25rem 0;

	@media (min-width: 640px) {
		gap: 0.75rem;
	}
`;
