import { styled } from '@linaria/react';

export const PlayColumn = styled.div`
	width: 100%;
	max-width: min(calc(100vw - 1rem), 34rem);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0.25rem 0.5rem 0.75rem;
	gap: 0.375rem;
	margin: 0 auto;

	@media (min-width: 640px) {
		max-width: min(calc(100vw - 2rem), 34rem);
		padding: 0.5rem 1rem 1rem;
		gap: 0.75rem;
	}
`;

export const BoardWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 0.25rem 0;

	@media (min-width: 640px) {
		padding: 0.5rem 0;
	}
`;
