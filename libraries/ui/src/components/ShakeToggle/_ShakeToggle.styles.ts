import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const ShakeToggle = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	min-inline-size: 2.75rem;
	min-block-size: 2.75rem;
	padding: 0.375rem 0.75rem;
	font-size: 0.8125rem;
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

	&:hover {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
	}

	/* Active and illuminated: shake gesture detection is active */
	&[data-state='active'] {
		--icon-accent: ${themeColor('accent')};
		background-color: oklch(from ${themeColor('accent')} l c h / 0.14);
		border-color: oklch(from ${themeColor('accent')} l c h / 0.45);
		color: ${themeColor('text-1')};

		&:hover {
			background-color: oklch(from ${themeColor('accent')} l c h / 0.2);
		}
	}

	/* Disabled or awaiting motion permission */
	&[data-state='off'] {
		background-color: transparent;
		border-color: ${themeColor('container-2')};
		color: ${themeColor('text-2')};
	}
`;
