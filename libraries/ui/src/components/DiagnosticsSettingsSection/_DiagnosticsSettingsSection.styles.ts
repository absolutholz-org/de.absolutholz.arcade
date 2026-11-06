import { styled } from '@linaria/react';

/** No shared native-select primitive exists in the library yet; this is the only custom element. */
export const Select = styled.select`
	background-color: var(--color-container-1);
	color: var(--color-text-1);
	border: 1px solid var(--color-container-2);
	border-radius: var(--radius-md);
	padding: 0.375rem 0.75rem;
	font-size: 0.875rem;
	font-weight: 500;
	min-height: 2.25rem;
	cursor: pointer;

	&:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
`;
