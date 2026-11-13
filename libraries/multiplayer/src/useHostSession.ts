import type { DataConnection, Peer as PeerInstance } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getIceServers } from './iceServers.js';
import { toPeerId } from './roomCode.js';
import type { ConnectionStatus, P2PMessage, RoomState, RoomUser } from './types.js';

export interface HostActionContext {
	readonly senderPeerId: string;
	readonly senderRole: 'host' | 'guest';
	readonly senderMark: 'X' | 'O';
}

export interface UseHostSessionOptions<TState, TAction> {
	readonly roomId: string;
	readonly hostName: string;
	readonly initialGameState: TState;
	readonly reducer: (prevState: TState, action: TAction, context: HostActionContext) => TState;
	readonly onGuestJoin?: (prevState: TState, guest: RoomUser) => TState;
	readonly enabled?: boolean;
}

export interface UseHostSessionReturn<TState, TAction> {
	readonly roomState: RoomState<TState>;
	readonly status: ConnectionStatus;
	readonly error: string | null;
	readonly isOpponentConnected: boolean;
	readonly dispatch: (action: TAction) => void;
}

const HEARTBEAT_INTERVAL_MS = 5000;

export function useHostSession<TState, TAction>({
	roomId,
	hostName,
	initialGameState,
	reducer,
	onGuestJoin,
	enabled = true,
}: UseHostSessionOptions<TState, TAction>): UseHostSessionReturn<TState, TAction> {
	const hostPeerId = toPeerId(roomId);

	const [roomState, setRoomState] = useState<RoomState<TState>>(() => ({
		roomId,
		gameState: initialGameState,
		users: [
			{
				peerId: hostPeerId,
				name: hostName.trim() || 'Host',
				role: 'host',
				mark: 'X',
				isConnected: true,
			},
		],
	}));
	const [status, setStatus] = useState<ConnectionStatus>(enabled ? 'connecting' : 'idle');
	const [error, setError] = useState<string | null>(null);

	const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
	const reducerRef = useRef(reducer);
	reducerRef.current = reducer;
	const onGuestJoinRef = useRef(onGuestJoin);
	onGuestJoinRef.current = onGuestJoin;

	const broadcastState = useCallback((nextRoomState: RoomState<TState>) => {
		const message: P2PMessage<TState, TAction> = {
			type: 'SYNC_STATE',
			payload: nextRoomState,
		};
		for (const conn of connectionsRef.current.values()) {
			if (conn.open) {
				conn.send(message);
			}
		}
	}, []);

	// Broadcast latest roomState whenever it updates
	useEffect(() => {
		if (!enabled) return;
		broadcastState(roomState);
	}, [enabled, roomState, broadcastState]);

	// Keep host display name synchronized
	useEffect(() => {
		const trimmedHostName = hostName.trim() || 'Host';
		setRoomState((prev) => {
			const hostUser = prev.users.find((u) => u.role === 'host');
			if (hostUser && hostUser.name === trimmedHostName) {
				return prev;
			}
			return {
				...prev,
				users: prev.users.map((u) => (u.role === 'host' ? { ...u, name: trimmedHostName } : u)),
			};
		});
	}, [hostName]);

	useEffect(() => {
		if (!enabled || !roomId || typeof window === 'undefined') {
			return;
		}

		setStatus('connecting');
		setError(null);

		let isCancelled = false;
		let peerInstance: PeerInstance | null = null;
		let heartbeatTimer: number | null = null;

		void import('peerjs')
			.then((peerModule) => {
				if (isCancelled) return;
				const PeerCtor = peerModule.Peer ?? peerModule.default;
				const peer = new PeerCtor(hostPeerId, {
					config: {
						iceServers: getIceServers(),
						iceTransportPolicy: 'all',
					},
				});
				peerInstance = peer;

				peer.on('open', () => {
					if (isCancelled) return;
					setStatus((prev) => (prev === 'connected' ? 'connected' : 'waiting'));
				});

				peer.on('connection', (conn) => {
					let registeredGuestPeerId = conn.peer;

					conn.on('open', () => {
						connectionsRef.current.set(registeredGuestPeerId, conn);
					});

					conn.on('data', (rawData) => {
						const message = rawData as P2PMessage<TState, TAction> | null;
						if (!message || typeof message !== 'object' || !('type' in message)) {
							return;
						}

						if (message.type === 'JOIN_ROOM') {
							const guestPeerId = message.payload.peerId || conn.peer;
							const guestName = message.payload.name.trim() || 'Player 2';
							registeredGuestPeerId = guestPeerId;
							connectionsRef.current.set(guestPeerId, conn);

							const guestUser: RoomUser = {
								peerId: guestPeerId,
								name: guestName,
								role: 'guest',
								mark: 'O',
								isConnected: true,
							};

							setRoomState((prev) => {
								const existingGuest = prev.users.find((u) => u.role === 'guest');
								const nextUsers: readonly RoomUser[] = existingGuest
									? prev.users.map((u) => (u.role === 'guest' ? guestUser : u))
									: [...prev.users, guestUser];

								const nextGameState = onGuestJoinRef.current
									? onGuestJoinRef.current(prev.gameState, guestUser)
									: prev.gameState;

								return {
									...prev,
									gameState: nextGameState,
									users: nextUsers,
								};
							});

							setStatus('connected');
						} else if (message.type === 'GAME_ACTION') {
							const senderPeerId = message.payload.senderPeerId || registeredGuestPeerId;
							setRoomState((prev) => {
								const guestUser = prev.users.find((u) => u.role === 'guest');
								if (!guestUser || guestUser.peerId !== senderPeerId) {
									return prev;
								}
								const nextGameState = reducerRef.current(prev.gameState, message.payload.action, {
									senderPeerId,
									senderRole: 'guest',
									senderMark: 'O',
								});
								if (nextGameState === prev.gameState) {
									return prev;
								}
								return {
									...prev,
									gameState: nextGameState,
								};
							});
						}
					});

					const handleDisconnect = () => {
						connectionsRef.current.delete(registeredGuestPeerId);
						setRoomState((prev) => {
							const hasGuest = prev.users.some((u) => u.role === 'guest');
							if (!hasGuest) {
								return prev;
							}
							return {
								...prev,
								users: prev.users.map((u) =>
									u.role === 'guest' && u.peerId === registeredGuestPeerId
										? { ...u, isConnected: false }
										: u,
								),
							};
						});
						setStatus('disconnected');
					};

					conn.on('close', handleDisconnect);
					conn.on('error', handleDisconnect);
				});

				peer.on('error', (err: Error & { type?: string }) => {
					if (isCancelled) return;
					if (err.type === 'unavailable-id') {
						setError('unavailable-id');
						setStatus('error');
					} else {
						setError(err.type || err.message || 'peer-error');
					}
				});

				heartbeatTimer = window.setInterval(() => {
					const heartbeatMsg: P2PMessage<TState, TAction> = {
						type: 'HEARTBEAT',
						timestamp: Date.now(),
					};
					for (const conn of connectionsRef.current.values()) {
						if (conn.open) {
							conn.send(heartbeatMsg);
						}
					}
				}, HEARTBEAT_INTERVAL_MS);
			})
			.catch((err: unknown) => {
				if (isCancelled) return;
				setError(err instanceof Error ? err.message : 'peer-load-error');
				setStatus('error');
			});

		return () => {
			isCancelled = true;
			if (heartbeatTimer !== null) {
				window.clearInterval(heartbeatTimer);
			}
			for (const conn of connectionsRef.current.values()) {
				conn.close();
			}
			connectionsRef.current.clear();
			peerInstance?.destroy();
		};
	}, [enabled, roomId, hostPeerId]);

	const dispatch = useCallback(
		(action: TAction) => {
			setRoomState((prev) => {
				const nextGameState = reducerRef.current(prev.gameState, action, {
					senderPeerId: hostPeerId,
					senderRole: 'host',
					senderMark: 'X',
				});
				if (nextGameState === prev.gameState) {
					return prev;
				}
				return {
					...prev,
					gameState: nextGameState,
				};
			});
		},
		[hostPeerId],
	);

	const guestUser = roomState.users.find((u) => u.role === 'guest');
	const isOpponentConnected = Boolean(guestUser?.isConnected);

	return {
		roomState,
		status,
		error,
		isOpponentConnected,
		dispatch,
	};
}
