import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const boardArea = css`
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	min-height: 0;
	min-width: 0;
	width: 100%;
	padding: 0;
	overflow: hidden;
`;

export const statusBar = css`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--space-lg);
	padding-inline: 0;
	padding-block: 0;
	width: 100%;
	background-color: transparent;
`;

export const statusMetric = css`
	display: inline-flex;
	align-items: center;
	gap: var(--space-2xs);
	font-size: var(--font-size-md);
	font-weight: var(--font-weight-medium);
	color: var(--color-text-1);
	font-variant-numeric: tabular-nums;

	svg {
		width: 1.125em;
		height: 1.125em;
		color: var(--color-text-2);
	}
`;

export const ControlsContainer = styled.div`
	width: 100%;
	max-width: 34rem;
	margin-top: var(--space-md);
	margin-inline: auto;
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
