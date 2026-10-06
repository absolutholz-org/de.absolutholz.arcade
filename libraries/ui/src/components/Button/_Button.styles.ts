import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Button = styled.button`
	appearance: none;
	border: 1px solid transparent;
	border-radius: ${radiusScale.lg};
	font-family: inherit;
	font-weight: 600;
	line-height: 1.25;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	cursor: pointer;
	user-select: none;
	transition: background-color 120ms ease,
		border-color 120ms ease,
		color 120ms ease,
		box-shadow 120ms cubic-bezier(0, 0, 0.2, 1),
		transform 120ms cubic-bezier(0, 0, 0.2, 1);
	outline: none;

	&:hover,
	&:active,
	&:focus {
		text-decoration: none;
	}

	/* Enforce WCAG 2.2 AA touch target minimum */
	min-width: 24px;

	/* Sizing via CSS data attributes */
	&[data-size='sm'] {
		min-height: 2rem;
		padding: 0 0.75rem;
		font-size: 0.8125rem;
		gap: 0.375rem;

		&[data-icon-only='true'] {
			padding: 0.375rem;
		}
	}

	&[data-size='md'] {
		min-height: 2.625rem;
		padding: 0 1.25rem;
		font-size: 0.9375rem;
		gap: 0.5rem;

		&[data-icon-only='true'] {
			padding: 0.625rem;
		}
	}

	&[data-size='lg'] {
		min-height: 3.125rem;
		padding: 0 1.625rem;
		font-size: 1.0625rem;
		gap: 0.625rem;

		&[data-icon-only='true'] {
			padding: 0.8125rem;
		}
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	&:disabled,
	&[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
		box-shadow: none;
		transform: none;
	}

	/* Primary Variant (4px bottom depth) */
	&[data-variant='primary'] {
		background-color: ${themeColor('accent')};
		color: ${themeColor('accent-contrast')};
		box-shadow: 0 4px 0 oklch(from ${themeColor('accent')} calc(l - 0.12) c h), 0 4px 12px oklch(from ${themeColor('accent')} l c h / 0.25);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: oklch(from ${themeColor('accent')} calc(l + 0.04) c h);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			transform: translateY(4px);
			box-shadow: 0 0 0 oklch(from ${themeColor('accent')} calc(l - 0.12) c h), 0 0 4px oklch(from ${themeColor('accent')} l c h / 0.2);
		}
	}

	/* Secondary Variant (4px bottom depth) */
	&[data-variant='secondary'] {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
		border-color: oklch(from ${themeColor('container-2')} calc(l + 0.05) c h / 0.3);
		box-shadow: 0 4px 0 oklch(from ${themeColor('container-1')} calc(l - 0.08) c h), 0 4px 8px rgba(0, 0, 0, 0.2);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: ${themeColor('container-2')};
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			transform: translateY(4px);
			box-shadow: 0 0 0 oklch(from ${themeColor('container-1')} calc(l - 0.08) c h), 0 0 4px rgba(0, 0, 0, 0.15);
		}
	}

	/* Outline Variant (3px bottom depth) */
	&[data-variant='outline'] {
		background-color: transparent;
		color: ${themeColor('text-1')};
		border-color: ${themeColor('container-2')};
		box-shadow: 0 3px 0 oklch(from ${themeColor('container-2')} calc(l - 0.05) c h);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: oklch(from ${themeColor('text-1')} l c h / 0.06);
			border-color: ${themeColor('text-2')};
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			transform: translateY(3px);
			box-shadow: 0 0 0 oklch(from ${themeColor('container-2')} calc(l - 0.05) c h);
		}
	}

	/* Ghost Variant (flat / no bottom bevel) */
	&[data-variant='ghost'] {
		background-color: transparent;
		color: ${themeColor('text-1')};
		border-color: transparent;
		box-shadow: none;

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: oklch(from ${themeColor('text-1')} l c h / 0.08);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			transform: translateY(1px);
			background-color: oklch(from ${themeColor('text-1')} l c h / 0.12);
		}
	}

	> span[data-slot='icon'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	> span[data-slot='content'] {
		display: inline-flex;
		align-items: center;
	}
`;
