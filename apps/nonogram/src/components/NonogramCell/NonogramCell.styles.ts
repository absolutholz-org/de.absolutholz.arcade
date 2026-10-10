import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	aspect-ratio: 1 / 1;
	min-width: 24px;
	min-height: 24px;
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
		color: ${themeColor('text-3')};
	}

	/* Drag previews */
	&[data-preview='filled'] {
		background-color: color-mix(in srgb, ${themeColor('text-1')} 60%, ${themeColor('surface')});
	}

	&[data-preview='crossed'] {
		color: ${themeColor('text-2')};
		background-color: color-mix(in srgb, ${themeColor('accent')} 12%, ${themeColor('surface')});
	}

	&[data-preview='empty'] {
		background-color: color-mix(in srgb, #ef4444 15%, ${themeColor('surface')});
	}

	/* Victory reveal mode: filled cells show puzzle art color */
	&[data-victory='true'][data-state='filled'] {
		background-color: var(--art-color, ${themeColor('accent')});
		border-color: transparent;
	}

	&[data-victory='true'][data-state='crossed'] {
		/* Crosses fade out when revealed */
		color: transparent;
	}

	/* Focus visibility for WCAG AA compliance */
	&:focus-visible,
	&[data-focused='true'] {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -2px;
		z-index: 5;
	}

	&:disabled {
		cursor: default;
	}

	/* SVG cross icon styling */
	svg {
		width: 60%;
		height: 60%;
		pointer-events: none;
	}
`;
