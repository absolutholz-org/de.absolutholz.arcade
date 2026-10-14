import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ControlsContainer = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin-top: 1rem;
`;

export const MainBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	padding: 0.5rem 1rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const ActionButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	height: 2.25rem;
	padding: 0 0.875rem;
	border-radius: var(--radius-sm);
	border: 1px solid ${themeColor('container-2')};
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 150ms ease, opacity 150ms ease;

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
	}

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
`;
