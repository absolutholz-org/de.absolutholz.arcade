import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const WakeLockToggleButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	min-inline-size: 2.75rem;
	min-block-size: 2.75rem;
	border-radius: ${radiusScale.pill};
	border: 1px solid ${themeColor('container-2')};
	background-color: transparent;
	color: ${themeColor('text-2')};
	font-weight: 600;
	line-height: 1.25;
	white-space: nowrap;
	user-select: none;
	cursor: pointer;
	transition:
		background-color 120ms ease,
		border-color 120ms ease,
		color 120ms ease,
		box-shadow 120ms cubic-bezier(0, 0, 0.2, 1);

	${focusVisibleRing}

	&[data-size='sm'] {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}

	&[data-size='md'] {
		padding: 0.5rem 1rem;
		font-size: 0.9375rem;
	}

	&:hover {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
	}

	/* Active and illuminated: Screen Wake Lock is held */
	&[data-state='active'] {
		--icon-accent: ${themeColor('accent')};
		background-color: oklch(from ${themeColor('accent')} l c h / 0.14);
		border-color: oklch(from ${themeColor('accent')} l c h / 0.45);
		color: ${themeColor('text-1')};

		&:hover {
			background-color: oklch(from ${themeColor('accent')} l c h / 0.2);
		}
	}

	/* Enabled by user, but blocked/released by OS (e.g., Low Power Mode) */
	&[data-state='blocked'] {
		background-color: ${themeColor('container-1')};
		border-style: dashed;
		border-color: ${themeColor('text-2')};
		color: ${themeColor('text-2')};
	}

	/* Disabled by user */
	&[data-state='off'] {
		background-color: transparent;
		border-color: ${themeColor('container-2')};
		color: ${themeColor('text-2')};
	}
`;
