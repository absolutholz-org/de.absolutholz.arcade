import { collection, deleteDoc, doc, onSnapshot, query, runTransaction, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { ensureMultiplayerUid, getMultiplayerFirebase } from './firebase.js';
import type { CloudRoomDocument } from './types.js';

export interface UseActiveRoomsReturn<TState> {
	readonly rooms: readonly CloudRoomDocument<TState>[];
	readonly myUid: string | null;
	readonly isLoading: boolean;
	readonly closeOrRemoveRoom: (room: CloudRoomDocument<TState>) => Promise<void>;
}

export function useActiveRooms<TState>(gameId?: string): UseActiveRoomsReturn<TState> {
	const [rooms, setRooms] = useState<readonly CloudRoomDocument<TState>[]>([]);
	const [myUid, setMyUid] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (typeof window === 'undefined') {
			setIsLoading(false);
			return;
		}

		let isCancelled = false;
		let unsubscribe: (() => void) | null = null;

		void ensureMultiplayerUid()
			.then((uid) => {
				if (isCancelled) return;
				setMyUid(uid);

				const services = getMultiplayerFirebase();
				if (!services) {
					setIsLoading(false);
					return;
				}

				const roomsQuery = query(
					collection(services.firestore, 'rooms'),
					where('participantUids', 'array-contains', uid),
				);

				unsubscribe = onSnapshot(
					roomsQuery,
					(snapshot) => {
						if (isCancelled) return;
						const now = Date.now();
						const loaded = snapshot.docs
							.map((d) => d.data() as CloudRoomDocument<TState>)
							.filter((r) => {
								const expiresAtMs =
									typeof r.expiresAt === 'number' ? r.expiresAt : r.expiresAt.toMillis();
								return (!gameId || r.gameId === gameId) && expiresAtMs > now;
							})
							.sort((a, b) => b.updatedAt - a.updatedAt);
						setRooms(loaded);
						setIsLoading(false);
					},
					() => {
						if (isCancelled) return;
						setIsLoading(false);
					},
				);
			})
			.catch(() => {
				if (isCancelled) return;
				setIsLoading(false);
			});

		return () => {
			isCancelled = true;
			unsubscribe?.();
		};
	}, [gameId]);

	const closeOrRemoveRoom = useCallback(
		async (room: CloudRoomDocument<TState>) => {
			const services = getMultiplayerFirebase();
			if (!services || !myUid) return;
			const roomRef = doc(services.firestore, 'rooms', room.roomId);

			// If the room is already abandoned or has no opponent, delete it outright;
			// otherwise transition to 'abandoned' first so the opponent is notified.
			if (room.phase === 'abandoned' || !room.guest) {
				await deleteDoc(roomRef);
				return;
			}

			await runTransaction(services.firestore, async (tx) => {
				const snap = await tx.get(roomRef);
				if (!snap.exists()) return;
				const latest = snap.data() as CloudRoomDocument<TState>;
				if (latest.phase === 'abandoned') {
					tx.delete(roomRef);
					return;
				}
				tx.update(roomRef, {
					phase: 'abandoned',
					closedBy: myUid,
					currentTurnUid: null,
					rematchRequestedBy: null,
					version: latest.version + 1,
					updatedAt: Date.now(),
				});
			});
		},
		[myUid],
	);

	return {
		rooms,
		myUid,
		isLoading,
		closeOrRemoveRoom,
	};
}
