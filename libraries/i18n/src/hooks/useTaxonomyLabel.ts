import { useCallback, useMemo } from 'react';
import type { SupportedLanguageCode } from '../types/i18n.types.js';
import {
	type TaxonomyCategoryKey,
	type TaxonomyFacetKey,
	type TaxonomyTagKey,
	getCategoryLabel,
	getGameAttributesAriaLabel,
	getTagLabel,
} from '../utils/taxonomy.js';
import { useI18n } from './useI18n.js';

export interface UseTaxonomyLabelsReturn {
	readonly language: SupportedLanguageCode;
	readonly getCategory: (category: TaxonomyCategoryKey) => string;
	readonly getTag: <F extends TaxonomyFacetKey>(facet: F, tag: TaxonomyTagKey<F>) => string;
	readonly gameAttributesAriaLabel: string;
}

/**
 * Idiomatic React hook providing type-safe resolvers for localized taxonomy
 * categories, facet tags, and accessible attribute labels.
 */
export function useTaxonomyLabel(): UseTaxonomyLabelsReturn {
	const { language } = useI18n('taxonomy');

	const getCategory = useCallback(
		(category: TaxonomyCategoryKey): string => getCategoryLabel(category, language),
		[language],
	);

	const getTag = useCallback(
		<F extends TaxonomyFacetKey>(facet: F, tag: TaxonomyTagKey<F>): string => getTagLabel(facet, tag, language),
		[language],
	);

	const gameAttributesAriaLabel = useMemo(() => getGameAttributesAriaLabel(language), [language]);

	return {
		language,
		getCategory,
		getTag,
		gameAttributesAriaLabel,
	};
}
