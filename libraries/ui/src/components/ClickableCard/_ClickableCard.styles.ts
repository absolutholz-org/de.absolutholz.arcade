import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const ClickableCard = styled.button`
	display: flex;
	flex-direction: column;
	width: 100%;
	text-align: left;
	position: relative;
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.lg};
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	text-decoration: none;
	cursor: pointer;
	user-select: none;
	outline: none;
	box-shadow: 0 4px 0 oklch(from ${themeColor('container-1')} calc(l - 0.08) c h), 0 4px 8px rgba(0, 0, 0, 0.2);
	transition: background-color 140ms ease,
		border-color 140ms ease,
		box-shadow 140ms cubic-bezier(0, 0, 0.2, 1),
		transform 140ms cubic-bezier(0, 0, 0.2, 1);

	/* Enforce WCAG 2.2 AA minimum touch target bounds */
	min-width: 24px;
	min-height: 24px;

	/* Density variants */
	&[data-density='compact'] {
		padding: 0.75rem 1rem;
		gap: 0.5rem;
	}

	&[data-density='normal'] {
		padding: 1.25rem 1.5rem;
		gap: 0.75rem;
	}

	/* Interactive hover state */
	&:hover:not(:disabled):not([aria-disabled='true']) {
		background-color: ${themeColor('container-2')};
		border-color: ${themeColor('text-2')};
		transform: translateY(-2px);
		box-shadow: 0 6px 0 oklch(from ${themeColor('container-1')} calc(l - 0.08) c h), 0 8px 16px rgba(0, 0, 0, 0.25);
	}

	/* Interactive pressed/active state */
	&:active:not(:disabled):not([aria-disabled='true']) {
		transform: translateY(2px);
		box-shadow: 0 2px 0 oklch(from ${themeColor('container-1')} calc(l - 0.08) c h), 0 2px 4px rgba(0, 0, 0, 0.15);
	}

	/* Focus-visible ring */
	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 3px;
	}

	/* Selected state */
	&[data-selected='true'] {
		border-color: ${themeColor('accent')};
		background-color: oklch(from ${themeColor('accent')} l c h / 0.08);
		box-shadow: 0 4px 0 oklch(from ${themeColor('accent')} calc(l - 0.12) c h), 0 4px 12px oklch(from ${themeColor('accent')} l c h / 0.25);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: oklch(from ${themeColor('accent')} l c h / 0.12);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			transform: translateY(2px);
			box-shadow: 0 2px 0 oklch(from ${themeColor('accent')} calc(l - 0.12) c h), 0 2px 6px oklch(from ${themeColor('accent')} l c h / 0.2);
		}
	}

	/* Disabled / non-interactive state */
	&:disabled,
	&[aria-disabled='true'] {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
		box-shadow: none;
		transform: none;
	}
`;
