import { css } from '@linaria/core';

export const deadlockContent = css`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	padding: 0.5rem 0;
`;

export const deadlockDescription = css`
	font-size: 0.9375rem;
	line-height: 1.5;
	color: var(--color-text-subtle, light-dark(#495057, #ced4da));
	margin: 0;
`;

export const deadlockActions = css`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-top: 0.5rem;

	@media (min-width: 480px) {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
`;
