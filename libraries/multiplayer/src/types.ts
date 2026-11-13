export type PlayerRole = 'host' | 'guest';

export type ConnectionStatus = 'idle' | 'connecting' | 'waiting' | 'connected' | 'disconnected' | 'error';

export interface RoomUser {
	readonly peerId: string;
	readonly name: string;
	readonly role: PlayerRole;
	readonly mark: 'X' | 'O';
	readonly isConnected: boolean;
}

export interface RoomState<TState> {
	readonly roomId: string;
	readonly gameState: TState;
	readonly users: readonly RoomUser[];
}

export type P2PMessage<TState, TAction> =
	| {
			readonly type: 'JOIN_ROOM';
			readonly payload: {
				readonly name: string;
				readonly peerId: string;
			};
	  }
	| {
			readonly type: 'GAME_ACTION';
			readonly payload: {
				readonly action: TAction;
				readonly senderPeerId: string;
			};
	  }
	| {
			readonly type: 'SYNC_STATE';
			readonly payload: RoomState<TState>;
	  }
	| {
			readonly type: 'HEARTBEAT';
			readonly timestamp: number;
	  };
