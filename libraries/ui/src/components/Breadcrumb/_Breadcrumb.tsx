import type { ElementType, ReactNode } from 'react';
import { useBreadcrumb } from './_Breadcrumb.hooks';
import * as S from './_Breadcrumb.styles';
import type { BreadcrumbProps, ProcessedBreadcrumbItem } from './_Breadcrumb.types';

function renderBreadcrumbItem(item: ProcessedBreadcrumbItem): ReactNode {
	const isHome = Boolean(item.isHome);
	const accessibleName =
		item['aria-label'] || (typeof item.resolvedLabel === 'string' ? item.resolvedLabel : undefined);

	const itemContent = isHome ? 'Arcade Home' : item.resolvedLabel;

	// The current page is always rendered as non-interactive text per WCAG and W3C APG best practice
	if (item.isCurrent) {
		return (
			<S.Breadcrumb_Span
				aria-current="page"
				aria-label={isHome ? accessibleName : item['aria-label']}
				data-home={isHome ? 'true' : undefined}
			>
				{itemContent}
			</S.Breadcrumb_Span>
		);
	}

	return (
		<S.Breadcrumb_Link
			href={item.href}
			aria-label={isHome ? accessibleName : item['aria-label']}
			data-home={isHome ? 'true' : undefined}
		>
			{itemContent}
		</S.Breadcrumb_Link>
	);
}

/**
 * Breadcrumb component providing hierarchical secondary navigation based on
 * W3C WAI-ARIA Authoring Practices Guide (APG) specifications.
 * Uses the authentic Arcade controller Logo for home navigation and slash separators.
 */
export function Breadcrumb<C extends ElementType = 'nav'>({
	as,
	items,
	homeHref,
	homeLabel,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
}: BreadcrumbProps<C>) {
	const Component = as || 'nav';
	const { items: processedItems, resolvedAriaLabel } = useBreadcrumb({
		items,
		homeHref,
		homeLabel,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
	});

	// Breadcrumbs require at least two items (a parent/root and the current page) to form a meaningful trail
	if (processedItems.length <= 1) {
		return null;
	}

	return (
		<S.Breadcrumb as={Component} aria-label={resolvedAriaLabel} aria-labelledby={ariaLabelledBy}>
			<S.Breadcrumb_List role="list">
				{processedItems.map((item, index) => {
					const isLast = index === processedItems.length - 1;
					return (
						<S.Breadcrumb_ListItem key={item.key}>
							{renderBreadcrumbItem(item)}
							{!isLast && <S.Breadcrumb_Separator aria-hidden="true">/</S.Breadcrumb_Separator>}
						</S.Breadcrumb_ListItem>
					);
				})}
			</S.Breadcrumb_List>
		</S.Breadcrumb>
	);
}
