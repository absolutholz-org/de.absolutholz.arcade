import { Timestamp, doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureMultiplayerUid, getMultiplayerFirebase } from './firebase.js';
import type { CloudRoomDocument, PlayerRole, RoomConnectionStatus, RoomParticipant } from './types.js';

const ROOM_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export interface CloudActionContext {
	readonly senderUid: string;
	readonly senderRole: PlayerRole;
	readonly senderMark: 'X' | 'O';
}

export interface UseCloudRoomOptions<TState, TAction> {
	readonly roomId: string;
	readonly gameId: string;
	readonly playerName: string;
	readonly initialGameState: TState;
	readonly reducer: (prevState: TState, action: TAction, context: CloudActionContext) => TState;
	readonly isCompleteCheck: (state: TState) => boolean;
	readonly onGuestJoin?: (prevState: TState, guest: RoomParticipant) => TState;
	readonly roleHint?: PlayerRole;
	readonly canJoin?: boolean;
	readonly enabled?: boolean;
}

export interface UseCloudRoomReturn<TState, TAction> {
	readonly room: CloudRoomDocument<TState> | null;
	readonly myUid: string | null;
	readonly myRole: PlayerRole | null;
	readonly status: RoomConnectionStatus;
	readonly error: string | null;
	readonly isMyTurn: boolean;
	readonly dispatchAction: (action: TAction) => Promise<void>;
	readonly requestRematch: () => Promise<void>;
	readonly acceptRematch: (nextGameState: TState, nextStarterRole: PlayerRole) => Promise<void>;
	readonly leaveRoom: () => Promise<void>;
}

export function useCloudRoom<TState, TAction>({
	roomId,
	gameId,
	playerName,
	initialGameState,
	reducer,
	isCompleteCheck,
	onGuestJoin,
	roleHint = 'guest',
	canJoin = true,
	enabled = true,
}: UseCloudRoomOptions<TState, TAction>): UseCloudRoomReturn<TState, TAction> {
	const [room, setRoom] = useState<CloudRoomDocument<TState> | null>(null);
	const [myUid, setMyUid] = useState<string | null>(null);
	const [status, setStatus] = useState<RoomConnectionStatus>(enabled ? 'initializing' : 'idle');
	const [error, setError] = useState<string | null>(null);

	const reducerRef = useRef(reducer);
	reducerRef.current = reducer;
	const isCompleteCheckRef = useRef(isCompleteCheck);
	isCompleteCheckRef.current = isCompleteCheck;
	const onGuestJoinRef = useRef(onGuestJoin);
	onGuestJoinRef.current = onGuestJoin;
	const initialGameStateRef = useRef(initialGameState);
	initialGameStateRef.current = initialGameState;
	const playerNameRef = useRef(playerName);
	playerNameRef.current = playerName;

	const joinAttemptedRef = useRef(false);
	const createAttemptedRef = useRef(false);

	useEffect(() => {
		joinAttemptedRef.current = false;
		createAttemptedRef.current = false;
		if (!enabled || !roomId || typeof window === 'undefined') {
			return;
		}

		let isCancelled = false;
		let unsubscribeSnapshot: (() => void) | null = null;

		setStatus('initializing');
		setError(null);

		void ensureMultiplayerUid()
			.then((uid) => {
				if (isCancelled) return;
				setMyUid(uid);

				const services = getMultiplayerFirebase();
				if (!services) {
					setError('firebase-not-configured');
					setStatus('error');
					return;
				}

				const roomRef = doc(services.firestore, 'rooms', roomId);

				unsubscribeSnapshot = onSnapshot(
					roomRef,
					(snapshot) => {
						if (isCancelled) return;

						if (!snapshot.exists()) {
							if (roleHint === 'host' && !createAttemptedRef.current) {
								createAttemptedRef.current = true;
								const now = Date.now();
								const trimmedName = playerNameRef.current.trim() || 'Host';
								const newRoom: CloudRoomDocument<TState> = {
									roomId,
									gameId,
									phase: 'waiting',
									version: 1,
									currentTurnUid: null,
									rematchRequestedBy: null,
									closedBy: null,
									participantUids: [uid],
									host: {
										uid,
										name: trimmedName,
										role: 'host',
										mark: 'X',
										joinedAt: now,
										lastSeenAt: now,
									},
									guest: null,
									gameState: initialGameStateRef.current,
									createdAt: now,
									updatedAt: now,
									expiresAt: Timestamp.fromMillis(now + ROOM_TTL_MS),
								};

								void runTransaction(services.firestore, async (tx) => {
									const existing = await tx.get(roomRef);
									if (!existing.exists()) {
										tx.set(roomRef, newRoom);
									}
								}).catch((err: unknown) => {
									if (isCancelled) return;
									console.error('[@arcade/lib-multiplayer] Room create failed:', err);
									setError(err instanceof Error ? err.message : 'room-create-error');
									setStatus('error');
								});
								return;
							}

							setRoom(null);
							setStatus('not-found');
							return;
						}

						const data = snapshot.data() as CloudRoomDocument<TState>;
						setRoom(data);

						const isHost = data.host.uid === uid;
						const isGuest = data.guest?.uid === uid;

						if (!isHost && !isGuest) {
							if (data.phase === 'waiting' && data.guest === null) {
								if (canJoin && !joinAttemptedRef.current) {
									joinAttemptedRef.current = true;
									const now = Date.now();
									const guestName = playerNameRef.current.trim() || 'Player 2';
									const guestParticipant: RoomParticipant = {
										uid,
										name: guestName,
										role: 'guest',
										mark: 'O',
										joinedAt: now,
										lastSeenAt: now,
									};

									void runTransaction(services.firestore, async (tx) => {
										const latestSnap = await tx.get(roomRef);
										if (!latestSnap.exists()) return;
										const latest = latestSnap.data() as CloudRoomDocument<TState>;
										if (
											latest.phase !== 'waiting' ||
											latest.guest !== null ||
											latest.host.uid === uid
										) {
											return;
										}
										const nextGameState = onGuestJoinRef.current
											? onGuestJoinRef.current(latest.gameState, guestParticipant)
											: latest.gameState;
										tx.update(roomRef, {
											phase: 'active',
											version: latest.version + 1,
											currentTurnUid: latest.host.uid,
											guest: guestParticipant,
											participantUids: [latest.host.uid, uid],
											gameState: nextGameState,
											updatedAt: now,
											expiresAt: Timestamp.fromMillis(now + ROOM_TTL_MS),
										});
									}).catch((err: unknown) => {
										joinAttemptedRef.current = false;
										if (isCancelled) return;
										setError(err instanceof Error ? err.message : 'room-join-error');
										setStatus('error');
									});
								} else {
									setStatus('waiting');
								}
								return;
							}

							setStatus('room-full');
							return;
						}

						setStatus(data.phase);
					},
					(err) => {
						if (isCancelled) return;
						setError(err.message || 'snapshot-error');
						setStatus('error');
					},
				);
			})
			.catch((err: unknown) => {
				if (isCancelled) return;
				console.error('[@arcade/lib-multiplayer] Auth/room init failed:', err);
				setError(err instanceof Error ? err.message : 'auth-error');
				setStatus('error');
			});

		return () => {
			isCancelled = true;
			unsubscribeSnapshot?.();
		};
	}, [enabled, roomId, gameId, roleHint, canJoin]);

	const myRole: PlayerRole | null =
		room && myUid ? (room.host.uid === myUid ? 'host' : room.guest?.uid === myUid ? 'guest' : null) : null;

	const isMyTurn = Boolean(room && myUid && room.phase === 'active' && room.currentTurnUid === myUid);

	const dispatchAction = useCallback(
		async (action: TAction) => {
			const services = getMultiplayerFirebase();
			if (!services || !myUid || !roomId) return;
			const roomRef = doc(services.firestore, 'rooms', roomId);

			await runTransaction(services.firestore, async (tx) => {
				const snap = await tx.get(roomRef);
				if (!snap.exists()) return;
				const latest = snap.data() as CloudRoomDocument<TState>;
				if (latest.phase !== 'active' || latest.currentTurnUid !== myUid) return;

				const senderRole: PlayerRole = latest.host.uid === myUid ? 'host' : 'guest';
				const senderMark = senderRole === 'host' ? latest.host.mark : (latest.guest?.mark ?? 'O');

				const nextGameState = reducerRef.current(latest.gameState, action, {
					senderUid: myUid,
					senderRole,
					senderMark,
				});
				if (nextGameState === latest.gameState) return;

				const now = Date.now();
				const complete = isCompleteCheckRef.current(nextGameState);
				const opponentUid = senderRole === 'host' ? (latest.guest?.uid ?? null) : latest.host.uid;

				tx.update(roomRef, {
					gameState: nextGameState,
					phase: complete ? 'completed' : 'active',
					currentTurnUid: complete ? null : opponentUid,
					version: latest.version + 1,
					updatedAt: now,
					expiresAt: Timestamp.fromMillis(now + ROOM_TTL_MS),
				});
			});
		},
		[myUid, roomId],
	);

	const requestRematch = useCallback(async () => {
		const services = getMultiplayerFirebase();
		if (!services || !myUid || !roomId) return;
		const roomRef = doc(services.firestore, 'rooms', roomId);

		await runTransaction(services.firestore, async (tx) => {
			const snap = await tx.get(roomRef);
			if (!snap.exists()) return;
			const latest = snap.data() as CloudRoomDocument<TState>;
			if (latest.phase !== 'completed') return;
			if (latest.rematchRequestedBy === myUid) return;

			const now = Date.now();
			tx.update(roomRef, {
				rematchRequestedBy: myUid,
				version: latest.version + 1,
				updatedAt: now,
				expiresAt: now + ROOM_TTL_MS,
			});
		});
	}, [myUid, roomId]);

	const acceptRematch = useCallback(
		async (nextGameState: TState, nextStarterRole: PlayerRole) => {
			const services = getMultiplayerFirebase();
			if (!services || !myUid || !roomId) return;
			const roomRef = doc(services.firestore, 'rooms', roomId);

			await runTransaction(services.firestore, async (tx) => {
				const snap = await tx.get(roomRef);
				if (!snap.exists()) return;
				const latest = snap.data() as CloudRoomDocument<TState>;
				if (latest.phase !== 'completed') return;

				const now = Date.now();
				const nextTurnUid =
					nextStarterRole === 'host' ? latest.host.uid : (latest.guest?.uid ?? latest.host.uid);
				tx.update(roomRef, {
					phase: 'active',
					gameState: nextGameState,
					rematchRequestedBy: null,
					currentTurnUid: nextTurnUid,
					version: latest.version + 1,
					updatedAt: now,
					expiresAt: Timestamp.fromMillis(now + ROOM_TTL_MS),
				});
			});
		},
		[myUid, roomId],
	);

	const leaveRoom = useCallback(async () => {
		const services = getMultiplayerFirebase();
		if (!services || !myUid || !roomId) return;
		const roomRef = doc(services.firestore, 'rooms', roomId);

		await runTransaction(services.firestore, async (tx) => {
			const snap = await tx.get(roomRef);
			if (!snap.exists()) return;
			const latest = snap.data() as CloudRoomDocument<TState>;
			if (latest.phase === 'abandoned') return;

			const now = Date.now();
			tx.update(roomRef, {
				phase: 'abandoned',
				closedBy: myUid,
				currentTurnUid: null,
				rematchRequestedBy: null,
				version: latest.version + 1,
				updatedAt: now,
				expiresAt: now + ROOM_TTL_MS,
			});
		});
	}, [myUid, roomId]);

	return {
		room,
		myUid,
		myRole,
		status,
		error,
		isMyTurn,
		dispatchAction,
		requestRematch,
		acceptRematch,
		leaveRoom,
	};
}
