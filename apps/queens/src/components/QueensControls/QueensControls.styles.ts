import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ControlsContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
`;

export const ModeRow = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	max-width: 20rem;

	> div {
		width: 100%;
	}
`;

export const ActionsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 20rem;
	gap: 0.5rem;
`;

export const ActionButton = styled.button`
	flex: 1 1 0;
	min-height: 3.25rem;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.375rem 0.125rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	touch-action: manipulation;
	transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease;

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

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	@media (min-width: 640px) {
		flex-direction: row;
		min-height: 2.75rem;
		gap: 0.375rem;
		padding: 0.5rem;

		> span {
			font-size: 0.8125rem;
		}
	}
`;
