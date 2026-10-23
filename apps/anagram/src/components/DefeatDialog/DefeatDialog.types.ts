export interface DefeatDialogProps {
	isOpen: boolean;
	foundCount: number;
	totalCount: number;
	onPlayAgain: () => void;
	onClose: () => void;
}
