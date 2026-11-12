import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { themeColor } from '../../styles/theme/theme.utils';
import { Toolbar } from '../Toolbar';

export const ControlBar = styled(Toolbar)`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: var(--game-toolbar-max-width, 36rem);
	margin-inline: auto;
	gap: 0.5rem;

	&[data-align='start'] {
		justify-content: flex-start;
	}

	&[data-align='center'] {
		justify-content: center;
	}

	&[data-align='end'] {
		justify-content: flex-end;
	}

	&[data-align='between'] {
		justify-content: space-between;
	}
`;

export const ControlGroup = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	flex-wrap: wrap;
`;

export const Divider = styled.hr`
	width: 1px;
	height: 1.5rem;
	border: 0;
	margin: 0 0.125rem;
	background-color: ${themeColor('container-2')};
	flex-shrink: 0;
	align-self: center;
`;

export const ActionButton = styled.button`
	flex: 0 0 auto;
	min-height: 2.75rem;
	min-width: 2.75rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	padding: 0.5rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	touch-action: manipulation;
	transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease, border-color 150ms ease;
	cursor: pointer;

	> span {
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.15;
		white-space: nowrap;
		text-align: center;
	}

	/* Collapse text on compact mobile screens when specified */
	@media (max-width: 639px) {
		&[data-collapse-mobile='true'] {
			width: 2.75rem;
			height: 2.75rem;
			padding: 0;

			> span:not([aria-hidden='true']) {
				display: none;
			}
		}
	}

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
	}

	&:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* Constructive buttons: Ghost / subtle outline style */
	&[data-action-style='constructive'] {
		background-color: transparent;
		border-color: ${themeColor('container-2')};

		&:hover:not(:disabled) {
			background-color: ${themeColor('container-1')};
		}
	}

	/* Destructive / session lifecycle buttons: Outlined subtle accent */
	&[data-action-style='destructive'] {
		background-color: ${themeColor('container-1')};
		border-color: ${themeColor('container-2')};

		&:hover:not(:disabled) {
			border-color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
			background-color: ${themeColor('container-2')};
		}
	}

	${focusVisibleRing}

	@media (min-width: 640px) {
		min-height: 2.75rem;
		min-width: 4.5rem;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;

		> span {
			font-size: 0.8125rem;
		}
	}
`;

export const GameControlStrip = ControlBar;
export const GameControls = ControlBar;
