import { styled } from '@linaria/react';

export const ConsentBannerRoot = styled.aside`
	position: fixed;
	bottom: 1.5rem;
	left: 1.5rem;
	right: 1.5rem;
	margin: 0 auto;
	max-width: 48rem;
	z-index: 1000;
	background-color: var(--color-surface);
	color: var(--color-text-1);
	border: 1px solid var(--color-container-2);
	border-radius: var(--radius-lg, 0.75rem);
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
	padding: 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;

	@media (min-width: 640px) {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
`;

export const ConsentBannerContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
`;

export const ConsentBannerTitle = styled.h2`
	font-size: 1.125rem;
	font-weight: 700;
	margin: 0;
	line-height: 1.4;
	color: var(--color-text-1);
`;

export const ConsentBannerDescription = styled.p`
	font-size: 0.875rem;
	margin: 0;
	line-height: 1.5;
	color: var(--color-text-2);
`;

export const ConsentBannerActions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	flex-shrink: 0;
	width: 100%;

	@media (min-width: 640px) {
		width: auto;
		min-width: 13rem;
	}

	& > * {
		width: 100%;
		justify-content: center;
	}
`;
