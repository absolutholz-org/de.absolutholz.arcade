import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const TimerButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.pill};
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	cursor: pointer;
	user-select: none;
	line-height: 1;
	font-variant-numeric: tabular-nums;
	font-feature-settings: "tnum";
	font-weight: 600;
	letter-spacing: 0.03ch;

	/* Transitions & Touch Target */
	min-width: 24px;
	min-height: 24px;
	transition: background-color 120ms ease,
		border-color 120ms ease,
		color 120ms ease,
		box-shadow 120ms cubic-bezier(0, 0, 0.2, 1),
		transform 120ms cubic-bezier(0, 0, 0.2, 1),
		opacity 120ms ease;

	&[data-interactive='false'] {
		cursor: default;
	}

	/* Hover & Active States */
	&[data-interactive='true']:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
		border-color: ${themeColor('text-2')};
	}

	&[data-interactive='true']:active:not(:disabled) {
		transform: scale(0.97);
		background-color: oklch(from ${themeColor('container-2')} calc(l - 0.04) c h);
	}

	/* Accessible Focus Ring */
	outline: none;
	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	/* Disabled State */
	&:disabled:not([data-interactive='false']) {
		cursor: not-allowed;
		opacity: 0.45;
	}

	/* Paused Visual State */
	&[data-paused="true"] {
		opacity: 0.75;
		border-style: dashed;
		border-color: ${themeColor('accent')};

		> [data-slot="action-icon"] {
			color: ${themeColor('accent')};
		}
	}

	/* Sizing Presets */
	&[data-size="sm"] {
		min-height: 2rem;
		padding: 0 0.625rem;
		font-size: 0.8125rem;
		gap: 0.375rem;
	}

	&[data-size="md"] {
		min-height: 2.375rem;
		padding: 0 0.875rem;
		font-size: 0.9375rem;
		gap: 0.5rem;
	}

	&[data-size="lg"] {
		min-height: 2.75rem;
		padding: 0 1.125rem;
		font-size: 1.0625rem;
		gap: 0.625rem;
	}

	/* Child Slots */
	> [data-slot="leading-icon"] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: ${themeColor('text-2')};
		flex-shrink: 0;
	}

	> [data-slot="digits"] {
		display: inline-flex;
		align-items: center;
	}

	> [data-slot="digits"] > time {
		color: inherit;
		font-variant-numeric: inherit;
		letter-spacing: inherit;
	}

	> [data-slot="action-icon"] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: ${themeColor('text-2')};
		transition: color 120ms ease;
		flex-shrink: 0;
	}

	&:hover:not(:disabled) > [data-slot="action-icon"] {
		color: ${themeColor('text-1')};
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
`;
