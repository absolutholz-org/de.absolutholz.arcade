import { useId } from 'react';
import { AccordionGroupContext, useAccordionGroup } from './_Accordion.hooks';
import * as S from './_Accordion.styles';
import type { AccordionItemProps, AccordionProps } from './_Accordion.types';

/**
 * Accordion container component that manages layout spacing and group exclusivity context.
 */
export function Accordion({
	variant = 'ghost',
	gap = 'none',
	exclusive = true,
	children,
}: AccordionProps) {
	const autoId = useId();
	const groupName = exclusive ? `accordion-group-${autoId}` : undefined;

	return (
		<AccordionGroupContext.Provider value={{ groupName, variant }}>
			<S.AccordionContainer $gap={gap}>{children}</S.AccordionContainer>
		</AccordionGroupContext.Provider>
	);
}

/**
 * Native disclosure AccordionItem component using standard details/summary elements.
 */
export function AccordionItem({
	title,
	defaultOpen = false,
	name,
	children,
}: AccordionItemProps) {
	const { groupName, variant = 'ghost' } = useAccordionGroup();
	const detailsName = name || groupName;

	return (
		<S.Details open={defaultOpen} name={detailsName} $variant={variant}>
			<S.Summary>
				<S.SummaryContent>{title}</S.SummaryContent>
				<S.ChevronIcon viewBox="0 0 24 24">
					<polyline points="6 9 12 15 18 9" />
				</S.ChevronIcon>
			</S.Summary>
			<S.ContentPanel>{children}</S.ContentPanel>
		</S.Details>
	);
}
