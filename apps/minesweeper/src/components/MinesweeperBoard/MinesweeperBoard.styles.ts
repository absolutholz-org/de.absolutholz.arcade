import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
	padding: 0;
	margin: 0;
	overflow: hidden;
`;

export const BoardFrame = styled.div`
	position: relative;
	width: min(calc(100vw - 1rem), calc(100dvh - 7.5rem), 36rem);
	width: min(
		calc(100vw - 1rem),
		calc((100dvh - 7.5rem) * var(--ratio, 1)),
		calc(var(--columns, 9) * 3.75rem),
		36rem
	);
	aspect-ratio: var(--columns, 9) / var(--rows, 9);
	max-width: 100%;
	max-height: 100%;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;

	&[data-zoom='true'] {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
	}
`;

export const BoardInset = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	background: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: var(--radius-lg, 0.5rem);
	padding: clamp(0.25rem, 1vmin, 0.5rem);
	box-shadow:
		inset 0 2px 4px rgba(0, 0, 0, 0.08),
		0 4px 6px -1px rgba(0, 0, 0, 0.05);
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	&[data-zoom='true'] {
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		touch-action: pan-x pan-y;
		scrollbar-width: thin;
		scrollbar-color: ${themeColor('text-3')} transparent;
		display: block;

		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
		}
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		&::-webkit-scrollbar-thumb {
			background: ${themeColor('text-3')};
			border-radius: 9999px;
		}
		&::-webkit-scrollbar-thumb:hover {
			background: ${themeColor('text-2')};
		}
	}
`;

export const BoardTable = styled.table`
	display: grid;
	grid-template-columns: repeat(var(--columns, 9), 1fr);
	grid-template-rows: repeat(var(--rows, 9), 1fr);
	gap: clamp(1px, 0.35vmin, 2px);
	margin: 0;
	padding: 0;
	border-collapse: collapse;
	border-spacing: 0;
	user-select: none;
	width: 100%;
	height: 100%;
	box-sizing: border-box;

	&[data-zoom='true'] {
		grid-template-columns: repeat(var(--columns, 9), 2.25rem);
		grid-template-rows: repeat(var(--rows, 9), 2.25rem);
		width: max-content;
		height: max-content;
		margin: auto;
	}
`;

export const BoardBody = styled.tbody`
	display: contents;
`;

export const BoardRow = styled.tr`
	display: contents;
`;

export const BoardCellWrapper = styled.td`
	display: contents;
	padding: 0;
	margin: 0;
	border: none;
`;

export const ScrollHintLeft = styled.div`
	position: absolute;
	left: 2px;
	top: 2px;
	bottom: 2px;
	width: 1.5rem;
	pointer-events: none;
	border-top-left-radius: calc(var(--radius-lg, 0.5rem) - 2px);
	border-bottom-left-radius: calc(var(--radius-lg, 0.5rem) - 2px);
	background: linear-gradient(to right, rgba(0, 0, 0, 0.3), transparent);
	opacity: 0;
	transition: opacity 150ms ease;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding-left: 0.125rem;
	color: #ffffff;
	z-index: 5;

	&[data-visible='true'] {
		opacity: 1;
	}

	svg {
		width: 1rem;
		height: 1rem;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
	}
`;

export const ScrollHintRight = styled.div`
	position: absolute;
	right: 2px;
	top: 2px;
	bottom: 2px;
	width: 1.5rem;
	pointer-events: none;
	border-top-right-radius: calc(var(--radius-lg, 0.5rem) - 2px);
	border-bottom-right-radius: calc(var(--radius-lg, 0.5rem) - 2px);
	background: linear-gradient(to left, rgba(0, 0, 0, 0.3), transparent);
	opacity: 0;
	transition: opacity 150ms ease;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 0.125rem;
	color: #ffffff;
	z-index: 5;

	&[data-visible='true'] {
		opacity: 1;
	}

	svg {
		width: 1rem;
		height: 1rem;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
	}
`;
