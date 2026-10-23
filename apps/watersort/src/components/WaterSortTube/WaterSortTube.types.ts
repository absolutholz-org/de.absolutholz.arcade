import type { ColorId, Tube } from '../../engine/types.js';

export interface WaterSortTubeProps {
	index: number;
	tube: Tube;
	isSelected: boolean;
	isSourceCandidate: boolean;
	showPatterns: boolean;
	fluidAnimations: boolean;
	onSelect: (index: number) => void;
}
