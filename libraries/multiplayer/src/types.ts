import type { Timestamp } from 'firebase/firestore';

export type PlayerRole = 'host' | 'guest';

export type RoomPhase = 'waiting' | 'active' | 'completed' | 'abandoned';

export type RoomConnectionStatus =
	| 'idle'
	| 'initializing'
	| 'waiting'
	| 'active'
	| 'completed'
	| 'abandoned'
	| 'room-full'
	| 'not-found'
	| 'error';

export interface RoomParticipant {
	readonly uid: string;
	readonly name: string;
	readonly role: PlayerRole;
	readonly mark: 'X' | 'O';
	readonly joinedAt: number;
	readonly lastSeenAt: number;
}

export interface CloudRoomDocument<TState> {
	readonly roomId: string;
	readonly gameId: string;
	readonly phase: RoomPhase;
	readonly version: number;
	readonly currentTurnUid: string | null;
	readonly rematchRequestedBy: string | null;
	readonly closedBy: string | null;
	readonly participantUids: readonly string[];
	readonly host: RoomParticipant;
	readonly guest: RoomParticipant | null;
	readonly gameState: TState;
	readonly createdAt: number;
	readonly updatedAt: number;
	readonly expiresAt: Timestamp;
}
