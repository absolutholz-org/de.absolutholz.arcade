import { styled } from '@linaria/react';

export const GamesGrid = styled.div`
	display: grid;
	gap: 1.5rem;
	grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
	width: 100%;
	margin-top: 1rem;
`;
