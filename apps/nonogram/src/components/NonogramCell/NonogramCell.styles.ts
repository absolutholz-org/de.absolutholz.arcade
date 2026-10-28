import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	aspect-ratio: 1 / 1;
	min-width: 0;
	min-height: 0;
	padding: 0;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid ${themeColor('container-2')};
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	cursor: pointer;
	user-select: none;
	touch-action: none;
	transition: background-color 80ms ease, border-color 80ms ease, transform 80ms ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	/* 5-cell thick grid boundaries for scanning */
	&[data-thick-right='true'] {
		border-right: 2px solid ${themeColor('text-2')};
	}

	&[data-thick-bottom='true'] {
		border-bottom: 2px solid ${themeColor('text-2')};
	}

	/* State: Empty */
	&[data-state='empty'] {
		background-color: ${themeColor('surface')};
	}

	/* State: Filled */
	&[data-state='filled'] {
		background-color: ${themeColor('text-1')};
		color: ${themeColor('surface')};
	}

	/* State: Crossed */
	&[data-state='crossed'] {
		background-color: ${themeColor('surface')};
		color: ${themeColor('text-2')};
	}

	/* Preview states for active strokes */
	&[data-preview='filled'] {
		background-color: ${themeColor('container-2')};
		opacity: 0.8;
	}

	&[data-preview='crossed'] {
		background-color: ${themeColor('surface')};
		color: ${themeColor('text-3')};
		opacity: 0.8;
	}

	&[data-preview='empty'] {
		background-color: ${themeColor('container-1')};
		opacity: 0.6;
	}

	/* Keyboard Focus ring */
	&[data-focused='true'] {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -1px;
		z-index: 2;
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -1px;
		z-index: 2;
	}

	/* Victory reveal polish */
	&[data-victory='true'] {
		border-color: transparent;
		cursor: default;
	}
`;

export const CellIconWrapper = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60%;
	height: 60%;
	pointer-events: none;

	svg {
		width: 100%;
		height: 100%;
	}
`;
