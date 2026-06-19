import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';
import { themeColor } from '../../styles/theme/theme.utils';

export const Tooltip = styled.div`
	background-color: ${themeColor('container-1')};
	border: none;
	color: ${themeColor('text-1')};

	/* Baseline hidden state */
	display: none;
	font-weight: 500;

	/* Reset positioning to be controlled by JS */
	inset: auto;
	margin: 0;
	padding: ${space('xs')} ${space('md')};
	position: fixed;
	white-space: nowrap;
	z-index: 50;

	/* Native API state and our fallback state */
	&:popover-open,
	&.fallback-open {
		animation: popoverFadeIn 0.15s ease-out forwards;
		display: block;
	}

	@keyframes popoverFadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;
