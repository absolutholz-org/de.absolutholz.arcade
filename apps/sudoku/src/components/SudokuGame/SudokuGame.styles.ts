import { styled } from '@linaria/react';

export const GameRoot = styled.main`
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: 0.25rem 0.5rem 0.75rem;
	gap: 0.375rem;
	margin: 0 auto;

	@media (min-width: 640px) {
		padding: 0.75rem 1rem 1.5rem;
		gap: 0.75rem;
	}
`;

export const BoardWrapper = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	justify-content: center;
	padding: 0.25rem 0;

	@media (min-width: 640px) {
		padding: 0.5rem 0;
	}
`;
