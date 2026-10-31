export interface GameSegmentedOption {
	/** 'all' or specific game identifier slug ('sudoku', etc.) */
	id: string;
	/** Localized display label for the game tab */
	label: string;
	/** Optional emoji icon or visual identifier */
	icon?: string;
}

export interface GameSegmentedControlProps {
	/** Array of game options to display in horizontal tab bar */
	options: readonly GameSegmentedOption[];
	/** Currently active option identifier */
	selectedId: string;
	/** Callback invoked when a game option is selected */
	onSelect: (id: string) => void;
	/** Accessible name for the tablist */
	ariaLabel?: string;
}
