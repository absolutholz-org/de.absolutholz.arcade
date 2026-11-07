import type { GameId, GameMetadata } from './types.js';

/**
 * High-level genre categories for primary and optional secondary game classification.
 * Adheres to ADR 0009.
 */
export const GAME_CATEGORIES = Object.freeze([
	'logic-deduction',
	'spatial-puzzle',
	'word-trivia',
	'casual-sorting',
	'card-board',
	'party-duel',
] as const);

export type GameCategory = (typeof GAME_CATEGORIES)[number];

/**
 * Primary and optional secondary category assignment for a game.
 * When `secondary` is provided, it must differ from `primary`.
 */
export interface GameCategoryAssignment {
	readonly primary: GameCategory;
	readonly secondary?: GameCategory;
}

/**
 * Core gameplay and puzzle mechanics tags.
 */
export const MECHANIC_TAGS = Object.freeze([
	'grid-based',
	'pathfinding',
	'deduction',
	'sorting',
	'pattern-recognition',
	'color-matching',
	'number-logic',
	'word-forming',
	'graph-topology',
	'tile-rotation',
	'hazard-avoidance',
	'memory-recall',
	'hand-management',
	'alignment-capture',
] as const);

export type GameMechanicTag = (typeof MECHANIC_TAGS)[number];

/**
 * Supported player input modalities and WCAG 2.2 interaction indicators.
 *
 * - `touch-optimized`: Touch targets and controls designed for mobile/tablet screens (WCAG 2.2 AA).
 * - `keyboard-controls`: Full physical keyboard navigation and action bindings.
 * - `drag-and-drop`: Supports or centers on pointer drag/swipe gestures.
 * - `tap-only`: Playable via discrete single-tap/click pointer actions without dragging (WCAG 2.2 SC 2.5.7).
 * - `dual-mode-toggle`: On-screen primary/secondary mark toggle (e.g. Reveal/Flag, Fill/Cross, Digit/Notes).
 * - `direct-typing`: Accepts direct alphanumeric character key entry.
 */
export const INPUT_TAGS = Object.freeze([
	'touch-optimized',
	'keyboard-controls',
	'drag-and-drop',
	'tap-only',
	'dual-mode-toggle',
	'direct-typing',
] as const);

export type GameInputTag = (typeof INPUT_TAGS)[number];

/**
 * Session pacing, clock pressure, error punishment, and move recovery tags.
 */
export const PACING_TAGS = Object.freeze([
	'zen-untimed',
	'speedrun-timer',
	'mistake-penalty',
	'undo-friendly',
	'countdown-arcade',
	'move-efficiency',
	'turn-paced',
] as const);

export type GamePacingTag = (typeof PACING_TAGS)[number];

/**
 * Player topology, replayability model, and challenge mode tags.
 */
export const MODE_TAGS = Object.freeze([
	'single-player',
	'pass-and-play',
	'multiplayer-turn-based',
	'daily-challenge',
	'procedural-endless',
	'curated-levels',
	'vs-ai',
] as const);

export type GameModeTag = (typeof MODE_TAGS)[number];

/**
 * Typical round or puzzle session length buckets across supported difficulty tiers.
 */
export const SESSION_LENGTH_TAGS = Object.freeze(['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'] as const);

export type GameSessionLengthTag = (typeof SESSION_LENGTH_TAGS)[number];

/**
 * Canonical tag facet keys composing `TaxonomyTags`.
 */
export const TAXONOMY_FACETS = Object.freeze(['mechanics', 'inputs', 'pacing', 'modes', 'sessionLength'] as const);

export type TaxonomyFacet = (typeof TAXONOMY_FACETS)[number];

/**
 * Strongly typed multi-faceted tag structure assigned to every game.
 * Each facet must contain at least one unique tag from its canonical vocabulary.
 */
export interface TaxonomyTags {
	readonly mechanics: readonly GameMechanicTag[];
	readonly inputs: readonly GameInputTag[];
	readonly pacing: readonly GamePacingTag[];
	readonly modes: readonly GameModeTag[];
	readonly sessionLength: readonly GameSessionLengthTag[];
}

/**
 * Exhaustive compile-time lookup table verifying `isGameId` stays synchronized with `GameId`.
 */
const GAME_ID_LOOKUP = {
	sudoku: true,
	minesweeper: true,
	nonogram: true,
	'star-battle': true,
	bridges: true,
	tracks: true,
	tents: true,
	anagram: true,
	'liquid-sort': true,
	untangle: true,
	net: true,
	'color-flood': true,
	'dice-bingo': true,
	pentominoes: true,
} as const satisfies Readonly<Record<GameId, true>>;

const CATEGORY_SET: ReadonlySet<string> = new Set(GAME_CATEGORIES);
const MECHANIC_TAG_SET: ReadonlySet<string> = new Set(MECHANIC_TAGS);
const INPUT_TAG_SET: ReadonlySet<string> = new Set(INPUT_TAGS);
const PACING_TAG_SET: ReadonlySet<string> = new Set(PACING_TAGS);
const MODE_TAG_SET: ReadonlySet<string> = new Set(MODE_TAGS);
const SESSION_LENGTH_TAG_SET: ReadonlySet<string> = new Set(SESSION_LENGTH_TAGS);

export function isGameId(value: unknown): value is GameId {
	return typeof value === 'string' && Object.hasOwn(GAME_ID_LOOKUP, value);
}

export function isGameCategory(value: unknown): value is GameCategory {
	return typeof value === 'string' && CATEGORY_SET.has(value);
}

export function isGameMechanicTag(value: unknown): value is GameMechanicTag {
	return typeof value === 'string' && MECHANIC_TAG_SET.has(value);
}

export function isGameInputTag(value: unknown): value is GameInputTag {
	return typeof value === 'string' && INPUT_TAG_SET.has(value);
}

export function isGamePacingTag(value: unknown): value is GamePacingTag {
	return typeof value === 'string' && PACING_TAG_SET.has(value);
}

export function isGameModeTag(value: unknown): value is GameModeTag {
	return typeof value === 'string' && MODE_TAG_SET.has(value);
}

export function isGameSessionLengthTag(value: unknown): value is GameSessionLengthTag {
	return typeof value === 'string' && SESSION_LENGTH_TAG_SET.has(value);
}

/**
 * Field-level diagnostic entry produced by `validateGameMetadata` or `validateGameRegistry`.
 */
export interface TaxonomyValidationIssue {
	readonly path: string;
	readonly message: string;
}

/**
 * Structured outcome of validating a `GameMetadata` manifest or registry map.
 */
export interface TaxonomyValidationResult {
	readonly valid: boolean;
	readonly issues: readonly TaxonomyValidationIssue[];
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyTrimmedString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0 && value.trim() === value;
}

function validateTagFacet(
	rawList: unknown,
	facetPath: string,
	guard: (item: unknown) => boolean,
	issues: TaxonomyValidationIssue[],
): void {
	if (!Array.isArray(rawList)) {
		issues.push({
			path: facetPath,
			message: 'Expected an array of taxonomy tags.',
		});
		return;
	}

	if (rawList.length === 0) {
		issues.push({
			path: facetPath,
			message: 'Facet array must contain at least one tag.',
		});
		return;
	}

	const seen = new Set<string>();
	for (let index = 0; index < rawList.length; index += 1) {
		const item = rawList[index];
		const itemPath = `${facetPath}[${index}]`;
		if (!guard(item)) {
			issues.push({
				path: itemPath,
				message: `Invalid taxonomy tag "${String(item)}".`,
			});
			continue;
		}
		const tagValue = item as string;
		if (seen.has(tagValue)) {
			issues.push({
				path: itemPath,
				message: `Duplicate taxonomy tag "${tagValue}" in facet.`,
			});
		}
		seen.add(tagValue);
	}
}

/**
 * Validates an arbitrary candidate value against the ADR 0009 `GameMetadata` contract
 * and domain invariants (distinct primary/secondary categories, non-empty unique tag facets,
 * canonical route and i18nNamespace alignment).
 */
export function validateGameMetadata(candidate: unknown, pathPrefix = ''): TaxonomyValidationResult {
	const prefix = pathPrefix ? `${pathPrefix}.` : '';
	const issues: TaxonomyValidationIssue[] = [];

	if (!isPlainRecord(candidate)) {
		return {
			valid: false,
			issues: Object.freeze([
				{
					path: pathPrefix || '<root>',
					message: 'Expected a non-null GameMetadata object.',
				},
			]),
		};
	}

	const { id, route, assets, i18nNamespace, category, tags } = candidate;

	if (!isGameId(id)) {
		issues.push({
			path: `${prefix}id`,
			message: `Invalid or unregistered GameId "${String(id)}".`,
		});
	}

	if (isGameId(id)) {
		const expectedRoute = `/${id}`;
		if (route !== expectedRoute) {
			issues.push({
				path: `${prefix}route`,
				message: `Expected route "${expectedRoute}", received "${String(route)}".`,
			});
		}
		if (i18nNamespace !== id) {
			issues.push({
				path: `${prefix}i18nNamespace`,
				message: `Expected i18nNamespace "${id}", received "${String(i18nNamespace)}".`,
			});
		}
	} else {
		if (typeof route !== 'string' || !route.startsWith('/')) {
			issues.push({
				path: `${prefix}route`,
				message: 'Expected route beginning with "/".',
			});
		}
		if (!isNonEmptyTrimmedString(i18nNamespace)) {
			issues.push({
				path: `${prefix}i18nNamespace`,
				message: 'Expected non-empty i18nNamespace.',
			});
		}
	}

	if (!isPlainRecord(assets)) {
		issues.push({
			path: `${prefix}assets`,
			message: 'Expected an assets object.',
		});
	} else {
		if (!isNonEmptyTrimmedString(assets.icon)) {
			issues.push({
				path: `${prefix}assets.icon`,
				message: 'Expected a non-empty icon string.',
			});
		}
		if (assets.heroImage !== undefined && !isNonEmptyTrimmedString(assets.heroImage)) {
			issues.push({
				path: `${prefix}assets.heroImage`,
				message: 'Expected heroImage to be a non-empty trimmed string when defined.',
			});
		}
		if (assets.backgroundImage !== undefined && !isNonEmptyTrimmedString(assets.backgroundImage)) {
			issues.push({
				path: `${prefix}assets.backgroundImage`,
				message: 'Expected backgroundImage to be a non-empty trimmed string when defined.',
			});
		}
	}

	if (!isPlainRecord(category)) {
		issues.push({
			path: `${prefix}category`,
			message: 'Expected a category assignment object ({ primary, secondary? }).',
		});
	} else {
		if (!isGameCategory(category.primary)) {
			issues.push({
				path: `${prefix}category.primary`,
				message: `Invalid primary GameCategory "${String(category.primary)}".`,
			});
		}
		if (category.secondary !== undefined) {
			if (!isGameCategory(category.secondary)) {
				issues.push({
					path: `${prefix}category.secondary`,
					message: `Invalid secondary GameCategory "${String(category.secondary)}".`,
				});
			} else if (category.secondary === category.primary) {
				issues.push({
					path: `${prefix}category.secondary`,
					message: `Secondary category "${category.secondary}" must differ from primary category.`,
				});
			}
		}
	}

	if (!isPlainRecord(tags)) {
		issues.push({
			path: `${prefix}tags`,
			message: 'Expected a TaxonomyTags object.',
		});
	} else {
		validateTagFacet(tags.mechanics, `${prefix}tags.mechanics`, isGameMechanicTag, issues);
		validateTagFacet(tags.inputs, `${prefix}tags.inputs`, isGameInputTag, issues);
		validateTagFacet(tags.pacing, `${prefix}tags.pacing`, isGamePacingTag, issues);
		validateTagFacet(tags.modes, `${prefix}tags.modes`, isGameModeTag, issues);
		validateTagFacet(tags.sessionLength, `${prefix}tags.sessionLength`, isGameSessionLengthTag, issues);
	}

	return {
		valid: issues.length === 0,
		issues: Object.freeze(issues),
	};
}

/**
 * TypeScript type guard checking whether an unknown value conforms to `GameMetadata`.
 */
export function isValidGameMetadata(candidate: unknown): candidate is GameMetadata {
	return validateGameMetadata(candidate).valid;
}

/**
 * Runtime assertion narrowing `candidate` to `GameMetadata` or throwing a `TypeError`
 * detailing all schema violations.
 */
export function assertValidGameMetadata(candidate: unknown): asserts candidate is GameMetadata {
	const result = validateGameMetadata(candidate);
	if (!result.valid) {
		const summary = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ');
		throw new TypeError(`Invalid GameMetadata contract: ${summary}`);
	}
}

/**
 * Validates the complete `GAME_REGISTRY` map, ensuring every registered `GameId` is present,
 * no unknown keys exist, and each manifest satisfies `validateGameMetadata` with matching key/id.
 */
export function validateGameRegistry(registry: unknown): TaxonomyValidationResult {
	if (!isPlainRecord(registry)) {
		return {
			valid: false,
			issues: Object.freeze([
				{
					path: '<registry>',
					message: 'Expected GAME_REGISTRY to be a non-null record object.',
				},
			]),
		};
	}

	const issues: TaxonomyValidationIssue[] = [];

	for (const expectedId of Object.keys(GAME_ID_LOOKUP)) {
		if (!Object.hasOwn(registry, expectedId)) {
			issues.push({
				path: expectedId,
				message: `Missing required GameId "${expectedId}" in registry.`,
			});
		}
	}

	for (const [key, entry] of Object.entries(registry)) {
		if (!isGameId(key)) {
			issues.push({
				path: key,
				message: `Unknown registry key "${key}" is not a valid GameId.`,
			});
		}
		if (isPlainRecord(entry) && entry.id !== key) {
			issues.push({
				path: `${key}.id`,
				message: `Registry entry id "${String(entry.id)}" does not match registry key "${key}".`,
			});
		}
		const entryResult = validateGameMetadata(entry, key);
		issues.push(...entryResult.issues);
	}

	return {
		valid: issues.length === 0,
		issues: Object.freeze(issues),
	};
}

/**
 * Options for querying games by category.
 */
export interface CategoryQueryOptions {
	/**
	 * When true, games that have the category as either primary or secondary are included.
	 * When false (default), only games where the category is primary are returned.
	 */
	readonly includeSecondary?: boolean;
}

/**
 * Non-empty category entry containing its category slug and all registered games.
 */
export interface ActiveCategoryEntry {
	readonly category: GameCategory;
	readonly games: readonly [GameMetadata, ...GameMetadata[]];
}

/**
 * Retrieves all games belonging to a specific category from a given list of games.
 */
export function getGamesByCategory(
	category: GameCategory,
	games: readonly GameMetadata[],
	options: CategoryQueryOptions = {},
): readonly GameMetadata[] {
	const { includeSecondary = false } = options;
	return games.filter((game) =>
		includeSecondary
			? game.category.primary === category || game.category.secondary === category
			: game.category.primary === category,
	);
}

/**
 * Returns all active categories that have at least one registered game from the given games,
 * ordered by canonical GAME_CATEGORIES order.
 */
export function getActiveCategories(
	games: readonly GameMetadata[],
	options: CategoryQueryOptions = {},
): readonly ActiveCategoryEntry[] {
	const activeCategories: ActiveCategoryEntry[] = [];

	for (const category of GAME_CATEGORIES) {
		const matchingGames = getGamesByCategory(category, games, options);
		const [firstGame, ...restGames] = matchingGames;
		if (firstGame) {
			activeCategories.push({
				category,
				games: [firstGame, ...restGames],
			});
		}
	}

	return activeCategories;
}
