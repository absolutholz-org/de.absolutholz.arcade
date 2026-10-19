import { styled } from '@linaria/react';

export const ClusterContainer = styled.div`
	position: relative;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	user-select: none;
`;

export const TopRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	position: relative;
	z-index: 1;
`;

export const BottomRow = styled.div`
	display: flex;
	justify-content: center;
	margin-top: -0.875rem;
	position: relative;
	z-index: 2;

	> [data-slot='gold-medal'] {
		filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35));
	}
`;
