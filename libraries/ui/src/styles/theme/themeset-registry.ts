import { DEFAULT_THEMESET_ID, THEMESET_IDS, type ThemesetId } from './theme.constants';
import { themesetBuckeyePrideCss, themesetBuckeyePrideProps } from './themeset-buckeye-pride.css';
import { themesetChristmasCss, themesetChristmasProps } from './themeset-christmas.css';
import { themesetClevelandGridironCss, themesetClevelandGridironProps } from './themeset-cleveland-gridiron.css';
import { themesetEasterCss, themesetEasterProps } from './themeset-easter.css';
import { themesetFastFoodFunCss, themesetFastFoodFunProps } from './themeset-fast-food-fun.css';
import { themesetGermanyCss, themesetGermanyProps } from './themeset-germany.css';
import { themesetHalloweenCss, themesetHalloweenProps } from './themeset-halloween.css';
import { themesetJuly4thCss, themesetJuly4thProps } from './themeset-july4th.css';
import { themesetStPatricksCss, themesetStPatricksProps } from './themeset-stpatricks.css';

export type NonBaseThemesetId = Exclude<ThemesetId, 'base'>;

interface ThemesetEntry {
	css: string;
	props: Record<string, string>;
}

const NON_BASE_THEMESETS: Record<NonBaseThemesetId, ThemesetEntry> = {
	christmas: { css: themesetChristmasCss, props: themesetChristmasProps },
	easter: { css: themesetEasterCss, props: themesetEasterProps },
	'fast-food-fun': { css: themesetFastFoodFunCss, props: themesetFastFoodFunProps },
	july4th: { css: themesetJuly4thCss, props: themesetJuly4thProps },
	stpatricks: { css: themesetStPatricksCss, props: themesetStPatricksProps },
	'cleveland-gridiron': { css: themesetClevelandGridironCss, props: themesetClevelandGridironProps },
	'buckeye-pride': { css: themesetBuckeyePrideCss, props: themesetBuckeyePrideProps },
	germany: { css: themesetGermanyCss, props: themesetGermanyProps },
	halloween: { css: themesetHalloweenCss, props: themesetHalloweenProps },
};

const PREVIEW_TOKEN_KEYS = [
	'--theme-primary-surface',
	'--theme-primary-container-1',
	'--theme-primary-accent',
	'--theme-primary-accent-secondary',
] as const;

export const NON_BASE_THEMESET_IDS: readonly NonBaseThemesetId[] = THEMESET_IDS.filter(
	(id): id is NonBaseThemesetId => id !== DEFAULT_THEMESET_ID,
);

export function isThemesetId(value: string | null | undefined): value is ThemesetId {
	return Boolean(value && (THEMESET_IDS as readonly string[]).includes(value));
}

export function isNonBaseThemesetId(value: string | null | undefined): value is NonBaseThemesetId {
	return isThemesetId(value) && value !== DEFAULT_THEMESET_ID;
}

/**
 * Builds the standalone CSS stylesheet for a single non-base themeset.
 * Returns null for 'base' since base tokens are inlined in global.css.ts.
 */
export function buildThemesetStylesheet(id: string): string | null {
	if (!isNonBaseThemesetId(id)) {
		return null;
	}
	const entry = NON_BASE_THEMESETS[id];
	return `:root[data-themeset='${id}'],\n[data-themeset='${id}'] {\n${entry.css}\n}\n`;
}

/**
 * Builds a minimal CSS stylesheet containing only the 4 preview swatch tokens
 * for every non-base themeset, scoped to `[data-themeset-swatch][data-themeset='...']`
 * so it never interferes with the active document-level themeset.
 */
export function buildThemesPreviewStylesheet(): string {
	return NON_BASE_THEMESET_IDS.map((id) => {
		const { props } = NON_BASE_THEMESETS[id];
		const declarations = PREVIEW_TOKEN_KEYS.map((key) => (props[key] ? `\t${key}: ${props[key]};` : null))
			.filter(Boolean)
			.join('\n');
		return `[data-themeset-swatch][data-themeset='${id}'] {\n${declarations}\n}`;
	}).join('\n\n');
}
