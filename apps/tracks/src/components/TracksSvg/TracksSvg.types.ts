import type { Direction, TrackType } from '../../engine/types.js';

export interface TrackTileProps {
	isFixed?: boolean;
	isError?: boolean;
	isVictory?: boolean;
	className?: string;
}

export interface TrackGateProps {
	variant: 'start' | 'end';
	side: Direction;
	label?: string;
	className?: string;
}

export interface CellMarkerProps {
	isError?: boolean;
	className?: string;
}

export interface GhostTrackProps {
	track?: TrackType;
	className?: string;
}

export interface TrainLocomotiveProps {
	direction?: Direction;
	exitTo?: Direction;
	className?: string;
}
