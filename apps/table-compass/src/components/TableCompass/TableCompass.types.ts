import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export type PickMode = 'first-player' | 'turn-order';
export type Direction = 'cw' | 'ccw';
export type AppPhase = 'pick' | 'naming' | 'compass';

export interface Seat {
	readonly id: string;
	readonly playerConfigIndex: number;
	name: string;
	readonly x: number; // Normalized coordinate [0..1]
	readonly y: number; // Normalized coordinate [0..1]
	readonly angleDeg: number; // 0..360 degrees relative to arena center
	turnRank?: number; // 1..N
	isStarter?: boolean;
}

export interface TouchPoint {
	readonly pointerId: number;
	readonly x: number; // Client pixel X relative to arena
	readonly y: number; // Client pixel Y relative to arena
	readonly playerConfigIndex: number;
}

export interface TableCompassState {
	phase: AppPhase;
	pickMode: PickMode;
	direction: Direction;
	seats: Seat[];
	activeSeatIndex: number;
	turnCount: number;
}

export interface TableCompassProps {
	lang: SupportedLanguageCode;
	className?: string;
}
