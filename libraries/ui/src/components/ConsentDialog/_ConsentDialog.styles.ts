import { styled } from '@linaria/react';

export const DialogBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
`;

export const TierBadgeContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	border-radius: var(--radius-md, 0.5rem);
	font-size: 0.875rem;

	> span:first-child {
		color: var(--color-text-2);
		font-weight: 500;
	}
`;

export const TierBadge = styled.span`
	font-weight: 700;
	color: var(--color-accent);
`;

export const PreferenceCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem;
	border: 1px solid var(--color-container-2);
	border-radius: var(--radius-md, 0.5rem);
`;

export const CardHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
`;

export const CardTitle = styled.h3`
	font-size: 0.9375rem;
	font-weight: 600;
	margin: 0;
	color: var(--color-text-1);
`;

export const CardBadge = styled.span`
	font-size: 0.75rem;
	font-weight: 500;
	padding: 0.125rem 0.5rem;
	background-color: var(--color-container-2);
	border-radius: var(--radius-sm, 0.25rem);
	color: var(--color-text-2);
`;

export const CardDescription = styled.p`
	font-size: 0.8125rem;
	line-height: 1.45;
	margin: 0;
	color: var(--color-text-2);
`;

export const CardHint = styled.span`
	display: block;
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--color-accent);
	margin-top: 0.25rem;
`;

export const WarningBox = styled.div`
	padding: 1rem;
	background-color: var(--color-container-1);
	border: 1px solid var(--color-accent);
	border-radius: var(--radius-md, 0.5rem);
	color: var(--color-text-1);
	font-size: 0.875rem;
	line-height: 1.45;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

export const WarningActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
`;
