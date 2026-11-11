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

export const QuickPlayGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	gap: 1rem;
`;

export const ArchiveWrapper = styled.div`
	margin-top: 2rem;
`;

export const ArchiveContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
`;

export const PuzzlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
	gap: 1rem;
`;
