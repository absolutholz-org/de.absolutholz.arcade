import type { ReactNode } from 'react';

export interface VictoryStatItem {
	label: string;
	value: ReactNode;
}

export interface VictoryDialogProps {
	/** Unique HTML ID for accessibility */
	id?: string;
	/** Whether the dialog modal is visible */
	isOpen: boolean;
	/** Callback when dialog is closed or canceled */
	onClose: () => void;
	/** Dialog title (e.g. "Puzzle Solved!", "Congratulations!") */
	title?: string;
	/** Optional congratulatory or completion description message */
	message?: string;
	/** Whether to render the header close button (default: true) */
	showCloseButton?: boolean;

	/** Elapsed time in seconds to display in time card */
	elapsedSeconds?: number;
	/** Accessible/visible label for the time card (defaults to "Time") */
	timeLabel?: string;

	/** Number of moves to display in moves card */
	movesCount?: number;
	/** Accessible/visible label for moves (defaults to "Moves") */
	movesLabel?: string;

	/** Arbitrary custom stat cards */
	stats?: VictoryStatItem[];

	/** Whether this score/time is a new personal record */
	isNewBestTime?: boolean;
	/** Custom text or badge label for best time (e.g. "New Best Time!") */
	bestTimeText?: string;

	/** Next puzzle action */
	hasNextPuzzle?: boolean;
	onNextPuzzle?: () => void;
	nextPuzzleLabel?: string;

	/** Play again action */
	onPlayAgain?: () => void;
	playAgainLabel?: string;

	/** Lobby action (either link href or callback) */
	lobbyHref?: string;
	onLobby?: () => void;
	lobbyLabel?: string;

	/** Auxiliary action slot rendered below the split button row */
	secondaryActions?: ReactNode;

	/** Slot for custom game-specific visual content (e.g. Nonogram solved pixel art preview) */
	children?: ReactNode;
}
