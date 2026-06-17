import { createContext, useContext } from 'react';
import type { AccordionVariant } from './_Accordion.types';

export interface AccordionGroupContextValue {
	groupName?: string;
	variant?: AccordionVariant;
}

export const AccordionGroupContext = createContext<AccordionGroupContextValue>(
	{},
);

/**
 * Custom hook to retrieve parent Accordion context configuration.
 */
export function useAccordionGroup() {
	return useContext(AccordionGroupContext);
}
