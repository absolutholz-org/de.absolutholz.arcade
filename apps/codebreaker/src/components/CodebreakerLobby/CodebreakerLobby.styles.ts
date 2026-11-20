import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 1.5rem;

	> h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}
`;

export const DifficultyGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
	gap: 1rem;
`;
