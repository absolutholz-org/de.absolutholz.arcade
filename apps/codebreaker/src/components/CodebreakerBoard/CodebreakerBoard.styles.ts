import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardFrame = styled.section`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 100%;
	max-width: 28rem;
	margin: 0 auto;
	padding: 0.75rem;
	border-radius: 1rem;
	background-color: ${themeColor('container-1')};
	border: 0.0625rem solid color-mix(in oklch, ${themeColor('text-1')} 14%, transparent);

	&[data-paused='true'] {
		opacity: 0.25;
		filter: blur(0.375rem);
		pointer-events: none;
		user-select: none;
	}

	@media (forced-colors: active) {
		border: 0.125rem solid buttonborder;
	}
`;

export const SecretBanner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 0.5rem 0.75rem;
	border-radius: 0.75rem;
	background-color: ${themeColor('container-2')};
	border: 0.0625rem solid color-mix(in oklch, ${themeColor('text-1')} 14%, transparent);

	@media (forced-colors: active) {
		border: 0.125rem solid buttonborder;
	}
`;

export const SecretLabel = styled.span`
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: ${themeColor('text-2')};
`;

export const SecretSlots = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
`;

export const HiddenPeg = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.875rem;
	height: 1.875rem;
	border-radius: 999rem;
	background-color: ${themeColor('surface')};
	border: 0.125rem dashed color-mix(in oklch, ${themeColor('text-2')} 45%, transparent);
	color: ${themeColor('text-2')};
	font-size: 0.875rem;
	font-weight: 800;

	@media (forced-colors: active) {
		border: 0.125rem dashed buttonborder;
		color: canvastext;
	}
`;

export const RowsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	max-height: min(52vh, 27rem);
	overflow-y: auto;
	padding: 0.125rem;
`;

export const GuessRowEl = styled.div`
	display: grid;
	grid-template-columns: 1.625rem 1fr auto;
	align-items: center;
	gap: 0.5rem;
	padding: 0.375rem 0.5rem;
	border-radius: 0.75rem;
	background-color: ${themeColor('surface')};
	border: 0.0625rem solid transparent;

	&[data-state='active'] {
		border-color: ${themeColor('accent')};
		background-color: ${themeColor('surface')};
		box-shadow: 0 0 0 0.0625rem ${themeColor('accent')};
	}

	&[data-state='future'] {
		opacity: 0.48;
	}

	&[data-conflict='true'] {
		border-color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.2 25));
		box-shadow: 0 0 0 0.125rem light-dark(oklch(0.55 0.22 25 / 0.3), oklch(0.68 0.2 25 / 0.35));
	}

	@media (forced-colors: active) {
		border: 0.0625rem solid buttonborder;

		&[data-state='active'] {
			border: 0.125rem solid highlight;
			box-shadow: none;
		}

		&[data-conflict='true'] {
			border: 0.1875rem dashed mark;
			box-shadow: none;
		}
	}
`;

export const RowIndex = styled.span`
	font-size: 0.75rem;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	text-align: center;
	color: ${themeColor('text-2')};
`;

export const PegsTrack = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
`;

export const SlotButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.75rem;
	height: 2.75rem;
	padding: 0;
	border-radius: 999rem;
	border: 0.125rem solid color-mix(in oklch, ${themeColor('text-2')} 38%, transparent);
	background-color: ${themeColor('container-1')};
	cursor: pointer;
	transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;

	&[data-selected='true'] {
		border-color: ${themeColor('accent')};
		box-shadow: 0 0 0 0.1875rem light-dark(oklch(0.55 0.18 255 / 0.28), oklch(0.72 0.16 255 / 0.35));
	}

	&[data-hinted='true'] {
		border-color: light-dark(oklch(0.52 0.18 148), oklch(0.72 0.17 148));
		box-shadow: 0 0 0 0.1875rem light-dark(oklch(0.52 0.18 148 / 0.32), oklch(0.72 0.17 148 / 0.38));
	}

	&:focus-visible {
		outline: 0.1875rem solid ${themeColor('accent')};
		outline-offset: 0.125rem;
	}

	&:disabled {
		cursor: default;
	}

	@media (forced-colors: active) {
		border: 0.125rem solid buttonborder;
		background-color: canvas;

		&[data-selected='true'] {
			border: 0.1875rem solid highlight;
			box-shadow: none;
		}
	}
`;

export const StaticSlot = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.375rem;
	height: 2.375rem;
	border-radius: 999rem;
	border: 0.0625rem solid color-mix(in oklch, ${themeColor('text-1')} 14%, transparent);
	background-color: ${themeColor('container-1')};
`;

export const EmptySocket = styled.span`
	width: 0.75rem;
	height: 0.75rem;
	border-radius: 999rem;
	background-color: color-mix(in oklch, ${themeColor('text-2')} 38%, transparent);
	opacity: 0.6;

	@media (forced-colors: active) {
		background-color: buttonborder;
	}
`;

export const FeedbackCluster = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 0.875rem);
	gap: 0.25rem;
	padding: 0.25rem;
	border-radius: 0.5rem;
	background-color: ${themeColor('container-1')};
	border: 0.0625rem solid color-mix(in oklch, ${themeColor('text-1')} 14%, transparent);
	justify-items: center;
	align-items: center;

	&[data-cols='3'] {
		grid-template-columns: repeat(3, 0.875rem);
	}

	@media (forced-colors: active) {
		border: 0.0625rem solid buttonborder;
	}
`;

export const FeedbackPeg = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 0.875rem;
	height: 0.875rem;
	border-radius: 999rem;

	&[data-kind='exact'] {
		background-color: light-dark(oklch(0.2 0.02 260), oklch(0.95 0.01 260));
		border: 0.125rem solid light-dark(oklch(0.15 0.02 260), oklch(0.98 0.01 260));
	}

	&[data-kind='partial'] {
		background-color: transparent;
		border: 0.1875rem solid light-dark(oklch(0.45 0.16 55), oklch(0.78 0.16 55));
	}

	&[data-kind='empty'] {
		background-color: transparent;
		border: 0.0625rem dashed color-mix(in oklch, ${themeColor('text-2')} 40%, transparent);
		opacity: 0.5;
	}

	@media (forced-colors: active) {
		&[data-kind='exact'] {
			background-color: highlight;
			border: 0.125rem solid highlight;
		}

		&[data-kind='partial'] {
			background-color: canvas;
			border: 0.1875rem solid canvastext;
		}

		&[data-kind='empty'] {
			background-color: canvas;
			border: 0.0625rem dotted buttonborder;
		}
	}
`;
