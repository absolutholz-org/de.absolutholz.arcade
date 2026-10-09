import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
	max-width: 48rem;
	margin: 0 auto;
`;

export const SummaryGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
	gap: 1rem;

	.summary-card {
		background: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};
		border-radius: var(--radius-md, 0.5rem);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.25rem;

		.summary-value {
			font-size: 2rem;
			font-weight: 700;
			color: ${themeColor('accent')};
			line-height: 1.1;
		}

		.summary-label {
			font-size: 0.875rem;
			color: ${themeColor('text-2')};
		}
	}
`;

export const BreakdownSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	h2 {
		font-size: 1.25rem;
		color: ${themeColor('text-1')};
	}
`;

export const BreakdownGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	gap: 1rem;

	.tier-card {
		background: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};
		border-radius: var(--radius-md, 0.5rem);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		.tier-title {
			font-size: 1rem;
			font-weight: 600;
			color: ${themeColor('text-1')};
			border-bottom: 1px solid ${themeColor('container-2')};
			padding-bottom: 0.5rem;
		}

		.tier-rows {
			display: flex;
			flex-direction: column;
			gap: 0.375rem;
			font-size: 0.875rem;

			.tier-row {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.label {
					color: ${themeColor('text-2')};
				}

				.value {
					font-weight: 600;
					color: ${themeColor('text-1')};
				}
			}
		}
	}
`;

export const Actions = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 1rem;
`;
