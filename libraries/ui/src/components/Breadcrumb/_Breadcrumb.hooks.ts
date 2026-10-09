import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useMemo } from 'react';
import type {
	BreadcrumbItem,
	ProcessedBreadcrumbItem,
	UseBreadcrumbOptions,
	UseBreadcrumbReturn,
} from './_Breadcrumb.types';

/**
 * Hook managing breadcrumb item resolution, automatic Arcade home link injection,
 * current page detection, and localized ARIA landmark labeling.
 */
export function useBreadcrumb({
	items = [],
	homeHref,
	homeLabel,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
}: UseBreadcrumbOptions): UseBreadcrumbReturn {
	const { t } = useI18n();

	const resolvedAriaLabel = ariaLabel || (ariaLabelledBy ? undefined : t('navigation.breadcrumb'));

	const processedItems = useMemo<ProcessedBreadcrumbItem[]>(() => {
		const rawItems: BreadcrumbItem[] = [...items];
		const hasExplicitHome = rawItems.some((item) => item.isHome);

		// Prepend Arcade home link if homeHref is provided and no item already claims isHome
		if (homeHref && !hasExplicitHome) {
			rawItems.unshift({
				href: homeHref,
				isHome: true,
				label: homeLabel,
			});
		}

		if (rawItems.length === 0) {
			return [];
		}

		// Check if any item explicitly designates itself as current
		const explicitCurrentIndex = rawItems.findIndex((item) => item.isCurrent);
		const defaultCurrentIndex = rawItems.length - 1;
		const targetCurrentIndex = explicitCurrentIndex !== -1 ? explicitCurrentIndex : defaultCurrentIndex;

		const defaultHomeText = homeLabel || t('navigation.home');

		return rawItems.map((item, index) => {
			const isHome = Boolean(item.isHome);
			const isCurrent = index === targetCurrentIndex;
			const resolvedLabel = isHome ? item.label || defaultHomeText : item.label;

			return {
				...item,
				key: `breadcrumb-item-${index}`,
				isHome,
				isCurrent,
				resolvedLabel,
			};
		});
	}, [items, homeHref, homeLabel, t]);

	return {
		items: processedItems,
		resolvedAriaLabel,
	};
}
