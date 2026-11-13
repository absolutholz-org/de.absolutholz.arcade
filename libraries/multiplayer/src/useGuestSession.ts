import type { DataConnection, Peer as PeerInstance } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getIceServers } from './iceServers.js';
import { getOrCreatePersistentPeerId, toPeerId } from './roomCode.js';
import type { ConnectionStatus, P2PMessage, RoomState } from './types.js';

export interface UseGuestSessionOptions<TState> {
	readonly roomId: string;
	readonly guestName: string;
	readonly initialGameState: TState;
	readonly enabled?: boolean;
}

export interface UseGuestSessionReturn<TState, TAction> {
	readonly roomState: RoomState<TState>;
	readonly status: ConnectionStatus;
	readonly error: string | null;
	readonly isConnected: boolean;
	readonly lastHeartbeatAt: number | null;
	readonly sendAction: (action: TAction) => void;
	readonly reconnect: () => void;
}

export function useGuestSession<TState, TAction>({
	roomId,
	guestName,
	initialGameState,
	enabled = true,
}: UseGuestSessionOptions<TState>): UseGuestSessionReturn<TState, TAction> {
	const [persistentId] = useState<string>(() => getOrCreatePersistentPeerId());
	const [reconnectCount, setReconnectCount] = useState<number>(0);

	const [roomState, setRoomState] = useState<RoomState<TState>>(() => ({
		roomId,
		gameState: initialGameState,
		users: [
			{
				peerId: persistentId,
				name: guestName.trim() || 'Player 2',
				role: 'guest',
				mark: 'O',
				isConnected: false,
			},
		],
	}));
	const [status, setStatus] = useState<ConnectionStatus>(enabled ? 'connecting' : 'idle');
	const [error, setError] = useState<string | null>(null);
	const [lastHeartbeatAt, setLastHeartbeatAt] = useState<number | null>(null);

	const connRef = useRef<DataConnection | null>(null);
	const guestNameRef = useRef(guestName);
	guestNameRef.current = guestName;

	useEffect(() => {
		if (!enabled || !roomId || reconnectCount < 0 || typeof window === 'undefined') {
			return;
		}

		setStatus('connecting');
		setError(null);

		let isCancelled = false;
		let peerInstance: PeerInstance | null = null;

		void import('peerjs')
			.then((peerModule) => {
				if (isCancelled) return;
				const PeerCtor = peerModule.Peer ?? peerModule.default;
				const peer = new PeerCtor(persistentId, {
					config: {
						iceServers: getIceServers(),
						iceTransportPolicy: 'all',
					},
				});
				peerInstance = peer;

				peer.on('open', () => {
					if (isCancelled) return;
					const hostPeerId = toPeerId(roomId);
					const conn = peer.connect(hostPeerId, { reliable: true });
					connRef.current = conn;

					conn.on('open', () => {
						if (isCancelled) return;
						setStatus('connected');
						setError(null);
						const joinMessage: P2PMessage<TState, TAction> = {
							type: 'JOIN_ROOM',
							payload: {
								name: guestNameRef.current.trim() || 'Player 2',
								peerId: persistentId,
							},
						};
						conn.send(joinMessage);
					});

					conn.on('data', (rawData) => {
						if (isCancelled) return;
						const message = rawData as P2PMessage<TState, TAction> | null;
						if (!message || typeof message !== 'object' || !('type' in message)) {
							return;
						}

						if (message.type === 'SYNC_STATE') {
							setRoomState(message.payload);
							setStatus('connected');
						} else if (message.type === 'HEARTBEAT') {
							setLastHeartbeatAt(message.timestamp);
						}
					});

					const handleCloseOrError = () => {
						if (isCancelled) return;
						setStatus('disconnected');
						setRoomState((prev) => ({
							...prev,
							users: prev.users.map((u) => (u.role === 'host' ? { ...u, isConnected: false } : u)),
						}));
					};

					conn.on('close', handleCloseOrError);
					conn.on('error', handleCloseOrError);
				});

				peer.on('disconnected', () => {
					if (isCancelled) return;
					setStatus('disconnected');
				});

				peer.on('error', (err: Error & { type?: string }) => {
					if (isCancelled) return;
					setError(err.type || err.message || 'peer-error');
					setStatus('disconnected');
				});
			})
			.catch((err: unknown) => {
				if (isCancelled) return;
				setError(err instanceof Error ? err.message : 'peer-load-error');
				setStatus('disconnected');
			});

		return () => {
			isCancelled = true;
			connRef.current?.close();
			connRef.current = null;
			peerInstance?.destroy();
		};
	}, [enabled, roomId, persistentId, reconnectCount]);

	const sendAction = useCallback(
		(action: TAction) => {
			const conn = connRef.current;
			if (!conn || !conn.open) {
				return;
			}
			const message: P2PMessage<TState, TAction> = {
				type: 'GAME_ACTION',
				payload: {
					action,
					senderPeerId: persistentId,
				},
			};
			conn.send(message);
		},
		[persistentId],
	);

	const reconnect = useCallback(() => {
		setReconnectCount((prev) => prev + 1);
	}, []);

	return {
		roomState,
		status,
		error,
		isConnected: status === 'connected',
		lastHeartbeatAt,
		sendAction,
		reconnect,
	};
}
