import { css } from '@linaria/core';

export const stageContainer = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 52rem;
	margin: 0 auto;
	padding: 0.5rem 0.75rem;
	gap: 1.25rem;

	@media (min-width: 640px) {
		gap: 1.5rem;
		padding: 1rem 1.5rem;
	}
`;

export const liveRegion = css`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
`;
