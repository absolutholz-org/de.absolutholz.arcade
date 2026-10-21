import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PuzzlesSection = styled.section`
	margin-top: 1.5rem;

	h2 {
		font-size: 1.125rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin-bottom: 1rem;
	}
`;

export const VariantsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
	gap: 1rem;
`;
