import { resources } from '../config/i18n.js';
import { DEFAULT_LANGUAGE } from '../constants/languages.js';
import type { TaxonomySchema, TaxonomyTranslationContract } from '../schemas/taxonomy.schema.js';
import type { SupportedLanguageCode } from '../types/i18n.types.js';
import { isSupportedLanguage } from './detection.js';

export type TaxonomyCategoryKey = keyof TaxonomySchema['categories'];
export type TaxonomyFacetKey = keyof TaxonomySchema['tags'];
export type TaxonomyTagKey<F extends TaxonomyFacetKey = TaxonomyFacetKey> = keyof TaxonomySchema['tags'][F] & string;

function getTaxonomyDictionary(lang?: SupportedLanguageCode): TaxonomyTranslationContract {
	const activeLang = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
	return resources[activeLang]?.taxonomy ?? resources.en.taxonomy;
}

/**
 * Resolves the localized display label for a primary or secondary game category.
 */
export function getCategoryLabel(category: TaxonomyCategoryKey, lang?: SupportedLanguageCode): string {
	const dict = getTaxonomyDictionary(lang);
	return dict.categories[category] ?? resources.en.taxonomy.categories[category];
}

/**
 * Resolves the localized display label for a specific taxonomy tag within a given facet.
 */
export function getTagLabel<F extends TaxonomyFacetKey>(
	facet: F,
	tag: TaxonomyTagKey<F>,
	lang?: SupportedLanguageCode,
): string {
	const dict = getTaxonomyDictionary(lang);
	const facetDict = dict.tags[facet] as Readonly<Record<string, string>>;
	const enFacetDict = resources.en.taxonomy.tags[facet] as Readonly<Record<string, string>>;
	return facetDict[tag] ?? enFacetDict[tag];
}

/**
 * Resolves the localized ARIA label for the game attributes tag list.
 */
export function getGameAttributesAriaLabel(lang?: SupportedLanguageCode): string {
	const dict = getTaxonomyDictionary(lang);
	return dict.aria.gameAttributes ?? resources.en.taxonomy.aria.gameAttributes;
}

/**
 * Resolves any localized taxonomy label by category slug or facet/tag pair.
 */
export function getTaxonomyLabel(category: TaxonomyCategoryKey, lang?: SupportedLanguageCode): string;
export function getTaxonomyLabel<F extends TaxonomyFacetKey>(
	facet: F,
	tag: TaxonomyTagKey<F>,
	lang?: SupportedLanguageCode,
): string;
export function getTaxonomyLabel(
	categoryOrFacet: TaxonomyCategoryKey | TaxonomyFacetKey,
	langOrTag?: SupportedLanguageCode | string,
	maybeLang?: SupportedLanguageCode,
): string {
	const dict = getTaxonomyDictionary(
		maybeLang ?? (langOrTag && isSupportedLanguage(langOrTag) ? langOrTag : undefined),
	);

	if (categoryOrFacet in dict.categories) {
		return getCategoryLabel(
			categoryOrFacet as TaxonomyCategoryKey,
			langOrTag && isSupportedLanguage(langOrTag) ? langOrTag : undefined,
		);
	}

	const facet = categoryOrFacet as TaxonomyFacetKey;
	const tag = langOrTag as TaxonomyTagKey<typeof facet>;
	return getTagLabel(facet, tag, maybeLang);
}
