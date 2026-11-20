import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const KeypadContainer = styled.div`
	width: 100%;
	max-width: 32rem;
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	user-select: none;
`;

export const ActionsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
`;

export const ModeButton = styled.button`
	flex: 1 1 0;
	min-height: 3.25rem;
	min-width: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.375rem 0.25rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	cursor: pointer;
	touch-action: manipulation;
	transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, opacity 150ms ease;

	> span {
		font-size: 0.6875rem;
		font-weight: 600;
		line-height: 1.1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		padding: 0 0.125rem;
		text-align: center;
	}

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
	}

	&:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	&[data-active='true'] {
		background-color: ${themeColor('accent')};
		color: ${themeColor('accent-contrast')};
		border-color: ${themeColor('accent')};

		> span {
			color: ${themeColor('accent-contrast')};
		}
	}

	${focusVisibleRing}

	@media (min-width: 640px) {
		flex-direction: row;
		max-width: 11rem;
		min-height: 2.75rem;
		gap: 0.375rem;
		padding: 0.5rem;

		> span {
			font-size: 0.8125rem;
		}
	}

	@media (forced-colors: active) {
		border: 1px solid ButtonBorder;

		&[data-active='true'] {
			background-color: Highlight;
			color: HighlightText;
			border-color: Highlight;
		}
	}
`;

export const DigitsRow = styled.div`
	display: grid;
	width: 100%;
	gap: 0.375rem;

	&[data-size='4'] {
		grid-template-columns: repeat(4, 1fr);
	}

	&[data-size='5'] {
		grid-template-columns: repeat(5, 1fr);
	}

	&[data-size='6'] {
		grid-template-columns: repeat(6, 1fr);
	}

	&[data-size='7'] {
		grid-template-columns: repeat(7, 1fr);
	}
`;

export const DigitButton = styled.button`
	min-height: 2.875rem;
	min-width: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.125rem;
	padding: 0.25rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-variant-numeric: tabular-nums;
	cursor: pointer;
	touch-action: manipulation;
	transition: background-color 140ms ease, transform 100ms ease, opacity 140ms ease;

	> span:first-child {
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1;
	}

	> [data-slot='count'] {
		font-size: 0.625rem;
		font-weight: 600;
		color: ${themeColor('text-2')};
		line-height: 1;
	}

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-1')};
		transform: translateY(-1px);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&[data-complete='true'] {
		opacity: 0.35;
	}

	&:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	${focusVisibleRing}

	@media (forced-colors: active) {
		border: 1px solid ButtonBorder;
	}
`;
