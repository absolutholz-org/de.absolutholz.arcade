import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';
import { themeColor } from '../../styles/theme/theme.utils';

export const Tooltip = styled.div`
	background-color: ${themeColor('text-1')};
	border: none;
	color: ${themeColor('surface')};

	/* Baseline hidden state */
	display: none;
	font-weight: 500;

	/* Reset positioning to be controlled by JS */
	inset: auto;
	margin: 0;
	max-width: 15rem;
	opacity: 0;
	padding: ${space('xs')} ${space('md')};
	position: fixed;
	transform: translateY(4px);

	/* Entry and exit transitions */
	transition:
		opacity 0.15s ease-out,
		transform 0.15s ease-out,
		display 0.15s ease-out allow-discrete,
		overlay 0.15s ease-out allow-discrete;
	width: fit-content;
	z-index: 50;

	/* Native API state and our fallback state */
	&:popover-open,
	&.fallback-open {
		display: block;
		opacity: 1;
		transform: translateY(0);
	}

	/* Starting style for entry transition */
	@starting-style {
		&:popover-open {
			opacity: 0;
			transform: translateY(4px);
		}
	}
`;
