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

export const Slot = styled.li`
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

	&[data-state='found'] {
		border-style: solid;
		border-color: ${themeColor('accent')};
		color: ${themeColor('text-1')};
		font-weight: 700;
	}

	&[data-state='revealed'] {
		border-style: solid;
		font-style: italic;
		opacity: 0.75;
	}
`;
