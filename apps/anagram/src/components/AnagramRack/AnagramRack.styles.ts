import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PlayArea = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	max-width: 38rem;
	margin: 0 auto;
`;

export const StagedTray = styled.fieldset`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
	min-height: 4.25rem;
	margin: 0;
	padding: 0.5rem 0.75rem;
	border-radius: var(--radius-md);
	border: 1px solid ${themeColor('container-2')};
	background-color: ${themeColor('container-1')};

	& button {
		min-width: 3rem;
		font-size: 1.25rem;
		font-weight: 700;
	}
`;

export const FeedbackBanner = styled.output`
	display: block;
	min-height: 1.375rem;
	font-size: 0.875rem;
	font-weight: 600;
	text-align: center;
	color: ${themeColor('text-2')};

	&[data-kind='accepted'] {
		color: ${themeColor('accent')};
	}
`;

export const RackRow = styled.fieldset`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
	min-height: 3.75rem;
	margin: 0;
	padding: 0;
	border: 0;

	& button {
		min-width: 3.25rem;
		font-size: 1.375rem;
		font-weight: 700;
	}
`;
