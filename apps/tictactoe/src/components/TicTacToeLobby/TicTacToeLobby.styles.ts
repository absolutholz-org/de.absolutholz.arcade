import { styled } from '@linaria/react';

export const FormContainer = styled.section`
	display: flex;
	flex-direction: column;
	gap: var(--space-lg);
	width: 100%;
	max-width: 28rem;
	margin-inline: auto;
`;

export const ControlWrapper = styled.div`
	width: 100%;
	max-width: 24rem;
	margin-inline: auto;
`;

export const OrDivider = styled.div`
	display: flex;
	align-items: center;
	gap: var(--space-sm);
	width: 100%;
	color: var(--color-text-muted);
	font-size: var(--text-sm, 0.875rem);
	text-transform: uppercase;
	letter-spacing: 0.05em;

	&::before,
	&::after {
		content: '';
		flex: 1;
		height: 1px;
		background-color: var(--color-border-subtle, var(--color-border, currentColor));
		opacity: 0.35;
	}
`;
