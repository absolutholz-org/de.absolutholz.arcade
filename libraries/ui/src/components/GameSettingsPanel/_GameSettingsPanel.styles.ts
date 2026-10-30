import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;

	&[data-mode='compact'] {
		gap: 1.25rem;
	}

	&[data-mode='detailed'] {
		gap: 2.5rem;
	}
`;

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;

	&[data-variant='danger'] {
		border-radius: ${radiusScale.lg};
		border: 1px solid light-dark(oklch(0.85 0.1 25), oklch(0.35 0.1 25));
		background: light-dark(oklch(0.98 0.02 25), oklch(0.15 0.03 25));
		padding: 1.25rem;
	}
`;

export const SectionHeader = styled.header`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;

	h2,
	h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		line-height: 1.3;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		color: ${themeColor('text-2')};
		line-height: 1.4;
	}
`;

export const FieldList = styled.fieldset`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	border: none;
	padding: 0;
	margin: 0;
`;

export const FieldItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0.875rem 1rem;
	border-radius: ${radiusScale.md};
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};

	&[data-control='boolean'] {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	&[data-mode='compact'] {
		background: transparent;
		border: none;
		padding: 0.25rem 0;
		border-bottom: 1px solid ${themeColor('container-1')};
		border-radius: 0;

		&:last-child {
			border-bottom: none;
		}
	}
`;

export const FieldMeta = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	flex: 1;
	min-width: 0;
`;

export const FieldLabel = styled.span`
	font-size: 0.9375rem;
	font-weight: 600;
	color: ${themeColor('text-1')};
	line-height: 1.3;
`;

export const FieldDescription = styled.p`
	margin: 0;
	font-size: 0.8125rem;
	color: ${themeColor('text-2')};
	line-height: 1.4;
`;

export const ControlContainer = styled.div`
	display: flex;
	align-items: center;
	flex-shrink: 0;

	&[data-control='segmented'] {
		width: 100%;
	}

	&[data-control='select'] {
		width: 100%;
		max-width: 16rem;
	}
`;

export const AppearanceGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1.25rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	}
`;

export const AppearanceCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem;
	border-radius: ${radiusScale.md};
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};

	h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: ${themeColor('text-1')};
	}

	p {
		margin: 0;
		font-size: 0.8125rem;
		color: ${themeColor('text-2')};
	}
`;

export const DangerZone = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	@media (min-width: 640px) {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
`;

export const DangerButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.625rem 1.25rem;
	font-size: 0.875rem;
	font-weight: 600;
	border-radius: ${radiusScale.md};
	border: 1px solid light-dark(oklch(0.6 0.22 25), oklch(0.68 0.2 25));
	background: light-dark(oklch(0.6 0.22 25), oklch(0.65 0.2 25));
	color: #ffffff;
	cursor: pointer;
	min-height: 2.5rem;
	min-width: 24px;
	user-select: none;
	transition: background-color 120ms ease, opacity 120ms ease;

	&:hover:not(:disabled) {
		background: light-dark(oklch(0.55 0.24 25), oklch(0.7 0.22 25));
	}

	&:focus-visible {
		outline: 2px solid light-dark(oklch(0.6 0.22 25), oklch(0.68 0.2 25));
		outline-offset: 2px;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;
