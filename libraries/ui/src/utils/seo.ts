import { type GameId, type GameMetadata, getGame, isGameId } from '@arcade/lib-games';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { getGameDescription, getGameTitle } from '@arcade/lib-i18n/utils/gameTitle';
import { getCategoryLabel, getTagLabel } from '@arcade/lib-i18n/utils/taxonomy';

export interface PageTitleOptions {
	subject?: string; // Specific view/page name (e.g., "Medals", "Settings", "How to Play", "Imprint")
	action?: string; // Secondary variant/action (e.g., "Daily", "Hard")
	scope?: string; // Enclosing game or context (e.g., "Sudoku", "Minesweeper")
	isPlaySession?: boolean; // True for the active gameplay screen
	brand?: string; // Defaults to "Arcade"
}

export type VideoGamePlayMode = 'SinglePlayer' | 'MultiPlayer';

export interface VideoGameJsonLd {
	readonly '@context': 'https://schema.org';
	readonly '@type': 'VideoGame';
	readonly name: string;
	readonly description: string;
	readonly applicationCategory: 'Game';
	readonly gamePlatform: readonly ['Web Browser'];
	readonly genre: readonly string[];
	readonly playMode: readonly VideoGamePlayMode[];
}

export interface BuildGameSeoOptions {
	readonly game: GameId | GameMetadata;
	readonly lang?: SupportedLanguageCode;
	readonly pageTitle?: string;
	readonly pageDescription?: string;
}

export interface GameSeoMetadata {
	readonly gameId: GameId;
	readonly title: string;
	readonly description: string;
	readonly keywords: string;
	readonly openGraph: {
		readonly title: string;
		readonly description: string;
		readonly type: 'website';
	};
	readonly jsonLd: VideoGameJsonLd;
	readonly jsonLdScript: string;
}

export function formatPageTitle({ subject, action, scope, isPlaySession, brand = 'Arcade' }: PageTitleOptions): string {
	const actionPrefix = action ? `${action} – ` : '';

	// No subject and no scope: ${brand} – Logic & Puzzle Games
	if (!subject && !scope) {
		return `${brand} – Logic & Puzzle Games`;
	}

	// isPlaySession with scope: ${action ? `${action} – ` : ''}Play ${scope} | ${brand}
	if (isPlaySession && scope) {
		return `${actionPrefix}Play ${scope} | ${brand}`;
	}

	// subject and scope (Game subpages): ${action ? `${action} – ` : ''}${subject} – ${scope} | ${brand}
	if (subject && scope) {
		return `${actionPrefix}${subject} – ${scope} | ${brand}`;
	}

	// scope only (Landing/Overview): ${scope} | ${brand}
	if (scope && !subject) {
		return `${scope} | ${brand}`;
	}

	// subject only (Hub/global subpages & tools): ${action ? `${action} – ` : ''}${subject} | ${brand}
	if (subject && !scope) {
		return `${actionPrefix}${subject} | ${brand}`;
	}

	return brand;
}

/**
 * Extracts a registered GameId from a URL or pathname when its root segment matches a known game.
 */
export function resolveGameIdFromPath(pathOrUrl?: string | null): GameId | undefined {
	if (!pathOrUrl) {
		return undefined;
	}

	let pathname = pathOrUrl;
	if (pathOrUrl.includes('://')) {
		try {
			pathname = new URL(pathOrUrl).pathname;
		} catch {
			return undefined;
		}
	}

	const firstSegment = pathname.split('/').find(Boolean);
	return isGameId(firstSegment) ? firstSegment : undefined;
}

/**
 * Safely serializes JSON-LD payloads for inline `<script type="application/ld+json">` tags,
 * escaping HTML-sensitive characters and line terminators.
 */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

function resolveGameDefinition(gameOrId: GameId | GameMetadata): GameMetadata {
	return typeof gameOrId === 'string' ? getGame(gameOrId) : gameOrId;
}

/**
 * Builds a Schema.org `VideoGame` JSON-LD structure from a game's taxonomy and localized strings.
 */
export function buildVideoGameJsonLd(gameOrId: GameId | GameMetadata, lang?: SupportedLanguageCode): VideoGameJsonLd {
	const metadata = resolveGameDefinition(gameOrId);
	const name = getGameTitle(metadata.i18nNamespace, lang);
	const description = getGameDescription(metadata.i18nNamespace, lang);

	const primaryCategoryLabel = getCategoryLabel(metadata.category.primary, lang);
	const mechanicLabels = metadata.tags.mechanics.map((tag) => getTagLabel('mechanics', tag, lang));
	const genre = Array.from(new Set([primaryCategoryLabel, ...mechanicLabels].filter(Boolean)));

	const playMode: VideoGamePlayMode[] = ['SinglePlayer'];
	if (metadata.tags.modes.includes('pass-and-play') || metadata.tags.modes.includes('multiplayer-turn-based')) {
		playMode.push('MultiPlayer');
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'VideoGame',
		name,
		description,
		applicationCategory: 'Game',
		gamePlatform: ['Web Browser'],
		genre,
		playMode,
	};
}

/**
 * Resolves full game page SEO metadata including localized keywords, Open Graph properties,
 * and escaped Schema.org `VideoGame` JSON-LD structured data.
 */
export function buildGameSeoMetadata({ game, lang, pageTitle, pageDescription }: BuildGameSeoOptions): GameSeoMetadata {
	const metadata = resolveGameDefinition(game);
	const localizedTitle = getGameTitle(metadata.i18nNamespace, lang);
	const localizedDescription = getGameDescription(metadata.i18nNamespace, lang);

	const keywordLabels = [
		getCategoryLabel(metadata.category.primary, lang),
		...(metadata.category.secondary ? [getCategoryLabel(metadata.category.secondary, lang)] : []),
		...metadata.tags.mechanics.map((tag) => getTagLabel('mechanics', tag, lang)),
		...metadata.tags.inputs.map((tag) => getTagLabel('inputs', tag, lang)),
		...metadata.tags.pacing.map((tag) => getTagLabel('pacing', tag, lang)),
		...metadata.tags.modes.map((tag) => getTagLabel('modes', tag, lang)),
		...metadata.tags.sessionLength.map((tag) => getTagLabel('sessionLength', tag, lang)),
	];
	const keywords = Array.from(new Set(keywordLabels.filter(Boolean))).join(', ');

	const jsonLd = buildVideoGameJsonLd(metadata, lang);

	return {
		gameId: metadata.id,
		title: localizedTitle,
		description: localizedDescription,
		keywords,
		openGraph: {
			title: pageTitle?.trim() || localizedTitle,
			description: pageDescription?.trim() || localizedDescription,
			type: 'website',
		},
		jsonLd,
		jsonLdScript: serializeJsonLd(jsonLd),
	};
}
