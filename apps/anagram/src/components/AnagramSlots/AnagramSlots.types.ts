export interface AnagramSlotsProps {
	words: readonly string[];
	foundWords: readonly string[];
	isRevealed: boolean;
	onSelectWord?: (word: string) => void;
	isDisabled?: boolean;
}
