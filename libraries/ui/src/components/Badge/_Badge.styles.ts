import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Badge = styled.span`
	--badge-bg: ${themeColor('container-1')};
	--badge-fg: ${themeColor('text-1')};
	--badge-border: ${themeColor('container-2')};

	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	line-height: 1.2;
	border-radius: ${radiusScale.pill};
	border: 1px solid var(--badge-border);
	background-color: var(--badge-bg);
	color: var(--badge-fg);
	white-space: nowrap;
	user-select: none;
	vertical-align: middle;
	text-decoration: none;

	&,
	&:hover,
	&:active,
	&:focus,
	&:focus-visible,
	&:visited {
		text-decoration: none;
	}

	*,
	*::before,
	*::after {
		text-decoration: none;
	}

	&[data-tabular='true'] {
		font-variant-numeric: tabular-nums;
	}

	/* Sizing presets */
	&[data-size='sm'] {
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		gap: 0.25rem;
	}

	&[data-size='md'] {
		padding: 0.25rem 0.75rem;
		font-size: 0.8125rem;
		gap: 0.375rem;
	}

	&[data-size='lg'] {
		padding: 0.375rem 1rem;
		font-size: 0.9375rem;
		gap: 0.5rem;
	}

	/* Interactive target sizing, focus & natural press feedback */
	&[data-interactive='true'] {
		cursor: pointer;
		min-inline-size: 24px;
		min-block-size: 24px;
		transition:
			background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease,
			scale 120ms ease;

		&[data-size='md'],
		&[data-size='lg'] {
			min-block-size: 2.75rem;
		}

		@media (pointer: coarse) {
			min-block-size: 2.75rem;
		}

		${focusVisibleRing}

		&:hover:not(:disabled):not([aria-disabled='true']) {
			filter: brightness(0.96);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			scale: 0.97;
		}

		&:disabled,
		&[aria-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&[aria-pressed='true'] {
			box-shadow: inset 0 0 0 1px currentColor;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;

			&:active:not(:disabled):not([aria-disabled='true']) {
				scale: none;
			}
		}
	}

	/* Variant: dashed border */
	&[data-variant='dashed'] {
		border-style: dashed;
	}

	/* Tone: neutral */
	&[data-tone='neutral'] {
		&[data-variant='subtle'] {
			--badge-bg: ${themeColor('container-2')};
			--badge-fg: ${themeColor('text-1')};
			--badge-border: ${themeColor('container-2')};
		}

		&[data-variant='solid'] {
			--badge-bg: ${themeColor('text-1')};
			--badge-fg: ${themeColor('surface')};
			--badge-border: ${themeColor('text-1')};
		}

		&[data-variant='outline'],
		&[data-variant='dashed'] {
			--badge-bg: transparent;
			--badge-fg: ${themeColor('text-1')};
			--badge-border: ${themeColor('container-2')};
		}
	}

	/* Tone: accent (use color-mix in oklab to avoid low-chroma oklch hue artifacts) */
	&[data-tone='accent'] {
		&[data-variant='subtle'] {
			--badge-bg: color-mix(in oklab, ${themeColor('accent')} 14%, ${themeColor('surface')});
			--badge-fg: ${themeColor('accent')};
			--badge-border: color-mix(in oklab, ${themeColor('accent')} 42%, ${themeColor('container-2')});
		}

		&[data-variant='solid'] {
			--badge-bg: ${themeColor('accent')};
			--badge-fg: ${themeColor('accent-contrast')};
			--badge-border: ${themeColor('accent')};
		}

		&[data-variant='outline'],
		&[data-variant='dashed'] {
			--badge-bg: transparent;
			--badge-fg: ${themeColor('accent')};
			--badge-border: ${themeColor('accent')};
		}
	}

	/* Tone: accent-secondary */
	&[data-tone='accent-secondary'] {
		&[data-variant='subtle'] {
			--badge-bg: color-mix(in oklab, ${themeColor('accent-secondary')} 14%, ${themeColor('surface')});
			--badge-fg: ${themeColor('accent-secondary')};
			--badge-border: color-mix(in oklab, ${themeColor('accent-secondary')} 42%, ${themeColor('container-2')});
		}

		&[data-variant='solid'] {
			--badge-bg: ${themeColor('accent-secondary')};
			--badge-fg: ${themeColor('accent-secondary-contrast')};
			--badge-border: ${themeColor('accent-secondary')};
		}

		&[data-variant='outline'],
		&[data-variant='dashed'] {
			--badge-bg: transparent;
			--badge-fg: ${themeColor('accent-secondary')};
			--badge-border: ${themeColor('accent-secondary')};
		}
	}

	/* Tone: success */
	&[data-tone='success'] {
		--badge-tone: ${themeColor('status-success')};
	}

	/* Tone: warning */
	&[data-tone='warning'] {
		--badge-tone: ${themeColor('status-warning')};
	}

	/* Tone: danger */
	&[data-tone='danger'] {
		--badge-tone: ${themeColor('status-danger')};
	}

	/* Tone: info */
	&[data-tone='info'] {
		--badge-tone: ${themeColor('status-info')};
	}

	&[data-tone='success'],
	&[data-tone='warning'],
	&[data-tone='danger'],
	&[data-tone='info'] {
		&[data-variant='subtle'] {
			--badge-bg: color-mix(in oklch, var(--badge-tone) 12%, ${themeColor('surface')});
			--badge-fg: var(--badge-tone);
			--badge-border: color-mix(in oklch, var(--badge-tone) 55%, ${themeColor('surface')});
		}

		&[data-variant='solid'] {
			--badge-bg: var(--badge-tone);
			--badge-fg: oklch(from var(--badge-tone) clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
			--badge-border: var(--badge-tone);
		}

		&[data-variant='outline'],
		&[data-variant='dashed'] {
			--badge-bg: transparent;
			--badge-fg: var(--badge-tone);
			--badge-border: var(--badge-tone);
		}
	}

	/* Higher contrast reinforcement */
	@media (prefers-contrast: more) {
		border-color: currentColor;
	}

	/* Forced Colors Mode (Windows High Contrast) */
	@media (forced-colors: active) {
		background-color: Canvas;
		color: CanvasText;
		border-color: CanvasText;
		box-shadow: none;

		&[data-variant='dashed'] {
			border-style: dashed;
		}

		button&[data-interactive='true'] {
			background-color: ButtonFace;
			color: ButtonText;
			border-color: ButtonBorder;

			&[aria-pressed='true'] {
				background-color: Highlight;
				color: HighlightText;
				border-color: Highlight;
			}

			&:disabled,
			&[aria-disabled='true'] {
				border-color: GrayText;
				color: GrayText;
				opacity: 1;
			}
		}

		a&[data-interactive='true'] {
			background-color: Canvas;
			color: LinkText;
			border-color: LinkText;

			&[aria-current] {
				outline: 2px solid Highlight;
				outline-offset: 1px;
			}
		}

		&[data-interactive='true']:focus-visible {
			outline: 2px solid Highlight;
			outline-offset: 2px;
		}
	}

	> span[data-slot='icon'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		line-height: 1;

		> svg {
			width: 0.875em;
			height: 0.875em;
		}
	}

	> span[data-slot='label'] {
		display: inline-flex;
		align-items: center;
		line-height: inherit;
	}
`;
