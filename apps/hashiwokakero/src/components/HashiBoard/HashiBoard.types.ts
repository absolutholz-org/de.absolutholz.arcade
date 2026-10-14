import type { KeyboardEvent } from 'react';
import type { BoardState, Island, IslandEvaluation } from '../../engine/types.js';

export interface HashiBoardProps {
	board: BoardState;
	selectedIslandId: string | null;
	focusedIslandId: string | null;
	highlightSatisfied: boolean;
	highlightOverflow: boolean;
	getIslandEvaluation: (islandId: string) => IslandEvaluation;
	onIslandClick: (island: Island) => void;
	onIslandFocus: (island: Island) => void;
	onIslandKeyDown: (e: KeyboardEvent, island: Island) => void;
	onBridgeClick: (fromId: string, toId: string) => void;
}
