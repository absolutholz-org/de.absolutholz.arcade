import { styled } from '@linaria/react';

export const LaunchSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	width: 100%;
`;

export const SizeSelectorWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

export const DifficultyGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	width: 100%;

	@media (min-width: 36rem) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 56rem) {
		grid-template-columns: repeat(4, 1fr);
	}
`;
