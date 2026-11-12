export interface TentsControlsProps {
	inputMode: 'tent' | 'grass';
	onToggleMode: (mode: 'tent' | 'grass') => void;
	onHint?: () => void;
}
