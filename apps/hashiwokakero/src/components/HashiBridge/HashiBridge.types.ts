import type { Bridge, Island } from '../../engine/types.js';

export interface HashiBridgeProps {
	bridge: Bridge;
	fromIsland: Island;
	toIsland: Island;
	cellSpacing: number;
	padding: number;
	onClick?: (fromId: string, toId: string) => void;
}
