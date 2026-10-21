import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ControlsContainer = styled.div`
	width: 100%;
	max-width: 36rem;
	margin: 1rem auto 0;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

export const StatsBar = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: 0.75rem;
	padding: 0.625rem 1rem;
`;

export const StatItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.125rem;
`;

export const StatLabel = styled.span`
	font-size: 0.75rem;
	color: ${themeColor('text-3')};
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const StatValue = styled.span`
	font-size: 1.125rem;
	font-weight: 700;
	color: ${themeColor('text-1')};
`;

export const ButtonRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.75rem;
`;

export const ActionButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.625rem 1.25rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	border: 1px solid ${themeColor('container-2')};
	background: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
	transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;

	&:hover:not(:disabled) {
		background: ${themeColor('container-2')};
		transform: translateY(-1px);
	}

	&:disabled {
		opacity: 0.4;
		cursor: default;
	}

	&[data-variant='primary'] {
		background: ${themeColor('accent')};
		color: #ffffff;
		border-color: transparent;

		&:hover:not(:disabled) {
			opacity: 0.92;
		}
	}
`;

export const StatusBanner = styled.div`
	padding: 0.75rem 1rem;
	border-radius: 0.625rem;
	text-align: center;
	font-weight: 600;
	font-size: 0.9375rem;

	&[data-status='won'] {
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
		border: 1px solid #10b981;
	}

	&[data-status='stuck'] {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
		border: 1px solid #f59e0b;
	}

	&[data-status='ready'] {
		background: ${themeColor('container-1')};
		color: ${themeColor('text-1')};
		border: 1px dashed ${themeColor('container-2')};
	}
`;
