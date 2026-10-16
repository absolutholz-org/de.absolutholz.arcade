import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PuzzlesSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 1.5rem;

	> h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}
`;

export const PuzzlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
	gap: 1rem;
`;

export const MiniThumbnail = styled.div`
	display: grid;
	grid-template-columns: repeat(var(--thumb-cols, 5), 1fr);
	grid-template-rows: repeat(var(--thumb-rows, 5), 1fr);
	width: 3.5rem;
	height: 3.5rem;
	aspect-ratio: 1 / 1;
	background: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: 0.25rem;
	padding: 2px;
	gap: 1px;

	> div {
		width: 100%;
		height: 100%;
		border-radius: 0.5px;

		&[data-filled='true'] {
			background-color: var(--thumb-color, ${themeColor('accent')});
		}

		&[data-filled='false'] {
			background-color: transparent;
		}
	}

	&[data-unsolved='true'] {
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${themeColor('text-3')};

		svg {
			width: 1.5rem;
			height: 1.5rem;
		}
	}
`;
