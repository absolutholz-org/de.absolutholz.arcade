import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PaletteContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.375rem;
	width: 100%;
	max-width: 34rem;
	margin-inline: auto;
`;

export const PaletteRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: stretch;
	justify-content: center;
	gap: 0.375rem;
	width: 100%;

	@media (min-width: 640px) {
		gap: 0.5rem;
	}
`;

export const MonsterButton = styled.button`
	--monster-color: ${themeColor('text-1')};

	&[data-monster='ghost'] {
		--monster-color: light-dark(oklch(44% 0.14 235), oklch(78% 0.12 225));
	}

	&[data-monster='vampire'] {
		--monster-color: light-dark(oklch(46% 0.19 20), oklch(72% 0.17 20));
	}

	&[data-monster='zombie'] {
		--monster-color: light-dark(oklch(42% 0.14 148), oklch(75% 0.14 148));
	}

	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	flex: 1 1 6.5rem;
	min-height: 2.75rem;
	min-width: 24px;
	padding: 0.375rem 0.625rem;
	border: 1.5px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-family: inherit;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 120ms ease, border-color 120ms ease, transform 80ms ease;

	&:hover:not(:disabled) {
		background-color: color-mix(in oklab, var(--monster-color) 10%, ${themeColor('surface')});
		border-color: var(--monster-color);
	}

	&:active:not(:disabled) {
		transform: translateY(1px);
	}

	&[data-selected='true'] {
		background-color: color-mix(in oklab, var(--monster-color) 16%, ${themeColor('surface')});
		border-color: var(--monster-color);
		box-shadow: inset 0 0 0 1px var(--monster-color);
	}

	&[data-satisfied='true'] {
		opacity: 0.78;
	}

	&[data-over-limit='true'] {
		border-color: var(--color-danger, ${themeColor('accent')});
		background-color: color-mix(in oklab, var(--color-danger, ${themeColor('accent')}) 12%, ${themeColor('surface')});
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	${focusVisibleRing};

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
		color: CanvasText;

		&[data-selected='true'] {
			border-color: Highlight;
			outline: 2px solid Highlight;
		}
	}
`;

export const IconSlot = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	color: var(--monster-color);
	flex-shrink: 0;

	> svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

export const MonsterMeta = styled.span`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	line-height: 1.15;
	min-width: 0;
`;

export const MonsterName = styled.span`
	font-size: 0.8125rem;
	font-weight: 700;
	color: ${themeColor('text-1')};
	white-space: nowrap;
`;

export const CountRow = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.75rem;
	font-weight: 600;
	font-variant-numeric: tabular-nums;
	color: ${themeColor('text-2')};

	&[data-over-limit='true'] {
		color: var(--color-danger, ${themeColor('accent')});
		font-weight: 800;
	}
`;

export const KeyBadge = styled.kbd`
	display: none;
	align-items: center;
	justify-content: center;
	min-width: 1.25rem;
	height: 1.25rem;
	padding-inline: 0.25rem;
	border-radius: var(--radius-xs, 0.25rem);
	border: 1px solid ${themeColor('container-2')};
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-2')};
	font-family: inherit;
	font-size: 0.6875rem;
	font-weight: 700;
	margin-inline-start: auto;

	@media (min-width: 520px) {
		display: inline-flex;
	}
`;

export const ActionGroup = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	flex-shrink: 0;
`;

export const ModeButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.3rem;
	min-height: 2.75rem;
	min-width: 2.75rem;
	padding: 0.375rem 0.625rem;
	border: 1.5px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-family: inherit;
	font-size: 0.8125rem;
	font-weight: 600;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 120ms ease, border-color 120ms ease;

	&:hover:not(:disabled):not([data-active='true']) {
		background-color: ${themeColor('container-1')};
	}

	&[data-active='true'] {
		background-color: color-mix(in oklab, ${themeColor('accent')} 18%, ${themeColor('surface')});
		border-color: ${themeColor('accent')};
		color: ${themeColor('accent')};

		&:hover:not(:disabled) {
			background-color: color-mix(in oklab, ${themeColor('accent')} 24%, ${themeColor('surface')});
		}
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	${focusVisibleRing};

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
		color: CanvasText;

		&[data-active='true'] {
			border-color: Highlight;
			outline: 2px solid Highlight;
		}
	}
`;

export const ShortcutHint = styled.p`
	display: none;
	margin: 0;
	font-size: 0.75rem;
	color: ${themeColor('text-2')};
	text-align: center;

	@media (min-width: 640px) {
		display: block;
	}
`;
