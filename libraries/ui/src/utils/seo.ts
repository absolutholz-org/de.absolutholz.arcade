export interface PageTitleOptions {
	subject?: string; // Specific view/page name (e.g., "Medals", "Settings", "How to Play", "Imprint")
	action?: string; // Secondary variant/action (e.g., "Daily", "Hard")
	scope?: string; // Enclosing game or context (e.g., "Sudoku", "Minesweeper")
	isPlaySession?: boolean; // True for the active gameplay screen
	brand?: string; // Defaults to "Arcade"
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
