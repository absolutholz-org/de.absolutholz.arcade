import type { KeyboardEvent } from 'react';
import type { Island, IslandEvaluation } from '../../engine/types.js';

export interface HashiIslandProps {
	island: Island;
	evaluation: IslandEvaluation;
	isSelected: boolean;
	isFocused: boolean;
	highlightSatisfied: boolean;
	highlightOverflow: boolean;
	cellSpacing: number;
	padding: number;
	onClick: (island: Island) => void;
	onFocus: (island: Island) => void;
	onKeyDown: (e: KeyboardEvent, island: Island) => void;
}
