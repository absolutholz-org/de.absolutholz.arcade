export interface ConsentDialogProps {
	readonly id?: string;
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly isAuthenticated?: boolean;
}
