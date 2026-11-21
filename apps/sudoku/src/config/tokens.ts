export const SUDOKU_TOKEN_MODES = ['numbers', 'shapes', 'emojis'] as const;

export type SudokuTokenMode = (typeof SUDOKU_TOKEN_MODES)[number];

export type SudokuTokenTuple = readonly [string, string, string, string, string, string, string, string, string];

export const SUDOKU_TOKEN_SETS: Record<SudokuTokenMode, SudokuTokenTuple> = {
	numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
	shapes: ['●', '▲', '■', '◆', '★', '✚', '⬟', '✖', '✦'],
	emojis: ['🍎', '🍋', '🍇', '🌸', '☀️', '🌙', '⭐', '💎', '🔥'],
};

export function isSudokuTokenMode(value: unknown): value is SudokuTokenMode {
	return typeof value === 'string' && (SUDOKU_TOKEN_MODES as readonly string[]).includes(value);
}

/**
 * Formats a Sudoku digit (1–9) into its display token for the active token mode.
 */
export function formatSudokuToken(digit: number, mode: SudokuTokenMode = 'numbers'): string {
	const tokens = SUDOKU_TOKEN_SETS[mode] ?? SUDOKU_TOKEN_SETS.numbers;
	return tokens[digit - 1] ?? String(digit);
}
