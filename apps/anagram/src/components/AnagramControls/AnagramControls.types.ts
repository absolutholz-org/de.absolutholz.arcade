export interface AnagramControlsProps {
	canSubmit: boolean;
	isDisabled: boolean;
	isEnded: boolean;
	hasClearedBaseline: boolean;
	showReveal: boolean;
	onShuffle: () => void;
	onClear: () => void;
	onSubmit: () => void;
	onReveal: () => void;
	onNewRound: () => void;
}
