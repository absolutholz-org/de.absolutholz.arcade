import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const SlotsCard = styled.section`
	width: 100%;
	max-width: 38rem;
	margin: 0 auto;
	padding: 0.75rem 1rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

export const LengthGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	> h3 {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: ${themeColor('text-2')};
	}

	> ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
`;

export const SlotItem = styled.li`
	display: inline-flex;
`;

export const SlotPlaceholder = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2rem;
	padding: 0.25rem 0.625rem;
	border-radius: var(--radius-sm);
	border: 1px dashed ${themeColor('container-2')};
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-2')};
	font-family: ui-monospace, monospace;
	font-size: 0.9375rem;
	font-weight: 600;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	user-select: none;
`;

export const SlotButton = styled.button`
	margin: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2rem;
	padding: 0.25rem 0.625rem;
	border-radius: var(--radius-sm);
	border: 1px solid ${themeColor('accent')};
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	font-family: ui-monospace, monospace;
	font-size: 0.9375rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	cursor: pointer;
	touch-action: manipulation;
	transition:
		background-color 150ms ease,
		border-color 150ms ease,
		transform 100ms ease;

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
		border-color: oklch(from ${themeColor('accent')} calc(l + 0.05) c h);
	}

	&:active:not(:disabled) {
		transform: scale(0.96);
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	&:disabled {
		cursor: default;
		opacity: 0.75;
	}

	&[data-state='revealed'] {
		border-color: ${themeColor('container-2')};
		font-style: italic;
		opacity: 0.75;
	}
`;
