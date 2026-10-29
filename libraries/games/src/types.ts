/**
 * Canonical identifiers for all games in the Arcade monorepo.
 */
export type GameId =
	| 'sudoku'
	| 'minesweeper'
	| 'nonogram'
	| 'queens'
	| 'bridges'
	| 'tracks'
	| 'tents'
	| 'anagram'
	| 'watersort'
	| 'solonoble';

/**
 * Visual and media assets associated with a game.
 */
export interface GameAssets {
	/**
	 * Primary emoji icon representing the game (e.g. 🔢, 💣, 🎨, 👑, 🌉, 🚂).
	 * Used for offline lists, badges, and quick teaser previews.
	 */
	readonly icon: string;
	/**
	 * Path or identifier for hero banner artwork.
	 */
	readonly heroImage?: string;
	/**
	 * Path or identifier for thematic background or wallpaper patterns.
	 */
	readonly backgroundImage?: string;
}

/**
 * Definition representing a game in the Arcade monorepo.
 */
export interface GameDefinition {
	/**
	 * Unique identifier matching the game's route segment and storage namespace.
	 */
	readonly id: GameId;
	/**
	 * Default fallback display name.
	 */
	readonly name: string;
	/**
	 * Root route for the game application.
	 */
	readonly route: `/${GameId}`;
	/**
	 * Visual assets representing the game.
	 */
	readonly assets: GameAssets;
	/**
	 * Translation namespace in `@arcade/lib-i18n`.
	 */
	readonly i18nNamespace: GameId;
}
