import type { GuessResult } from '../../engine/validator.js';
import type { RackTile } from '../AnagramGame/AnagramGame.types.js';

export interface AnagramRackProps {
	tiles: RackTile[];
	stagedIds: number[];
	isDisabled: boolean;
	feedbackMessage: string;
	feedbackKind: GuessResult | 'idle';
	onStageTile: (id: number) => void;
	onRecallTile: (id: number) => void;
}
