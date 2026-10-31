import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const statusBar = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	width: 100%;
`;

export const statusMetric = css`
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-text-primary);

	&[data-solved='true'] {
		color: var(--color-status-success, var(--color-success));
	}
`;

export const boardArea = css`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin: 0 auto;
	padding: 0.5rem;
`;

export const ControlsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 0;
	width: 100%;
`;

export const RulesContainer = styled.div`
	padding: 1rem;
	max-height: 60vh;
	overflow-y: auto;
`;
