import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardRoot = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 100%;
	margin: 0 auto;
	user-select: none;
	touch-action: none;
`;

export const BoardContainer = styled.section`
	position: relative;
	display: grid;
	grid-template-columns: max-content 1fr;
	grid-template-rows: max-content 1fr;
	background: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: var(--radius-lg, 0.5rem);
	padding: clamp(0.25rem, 1.5vmin, 0.75rem);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	width: min(calc(100vw - 1rem), calc(100dvh - 12rem), 40rem);
	max-width: 100%;
	aspect-ratio: auto;
	touch-action: none;

	&[data-size='hard'] {
		width: min(calc(100vw - 1rem), calc(100dvh - 12rem), 44rem);
	}
`;

export const CornerCell = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${themeColor('container-1')};
	border-right: 2px solid ${themeColor('text-2')};
	border-bottom: 2px solid ${themeColor('text-2')};
	padding: 0.25rem;
	color: ${themeColor('text-3')};
`;

export const TopCluesContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(var(--cols, 5), 1fr);
	border-bottom: 2px solid ${themeColor('text-2')};
	background: ${themeColor('container-1')};
`;

export const TopClueColumn = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	gap: 0.125rem;
	padding: clamp(0.125rem, 0.5vmin, 0.375rem) 0;
	font-size: clamp(0.625rem, 1.8vmin, 0.875rem);
	font-weight: 600;
	font-variant-numeric: tabular-nums;
	color: ${themeColor('text-1')};
	transition: opacity 150ms ease;

	&[data-completed='true'] {
		opacity: 0.3;
		text-decoration: line-through;
	}

	&[data-thick-right='true'] {
		border-right: 2px solid ${themeColor('text-2')};
	}
`;

export const LeftCluesContainer = styled.div`
	display: grid;
	grid-template-rows: repeat(var(--rows, 5), 1fr);
	border-right: 2px solid ${themeColor('text-2')};
	background: ${themeColor('container-1')};
	min-width: clamp(2rem, 6vmin, 4rem);
`;

export const LeftClueRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: clamp(0.2rem, 0.8vmin, 0.5rem);
	padding: 0 clamp(0.25rem, 0.8vmin, 0.5rem);
	font-size: clamp(0.625rem, 1.8vmin, 0.875rem);
	font-weight: 600;
	font-variant-numeric: tabular-nums;
	color: ${themeColor('text-1')};
	transition: opacity 150ms ease;

	&[data-completed='true'] {
		opacity: 0.3;
		text-decoration: line-through;
	}

	&[data-thick-bottom='true'] {
		border-bottom: 2px solid ${themeColor('text-2')};
	}
`;

export const GridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(var(--cols, 5), 1fr);
	grid-template-rows: repeat(var(--rows, 5), 1fr);
	gap: 0;
	background: ${themeColor('container-2')};
	touch-action: none;
`;
