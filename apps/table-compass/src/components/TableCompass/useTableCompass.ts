import { playPickup, playTap, playVictoryFanfare, triggerHaptic } from '@arcade/lib-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppPhase, CompassHistoryEntry, Direction, PickMode, Seat, TableCompassState } from './TableCompass.types';
import { MIN_PLAYERS, PLAYER_CONFIGS, STORAGE_KEY } from './constants';
import { generateSeatsForCount } from './geometry';

export { generateSeatsForCount };

const MAX_HISTORY_ITEMS = 50;

export function useTableCompass() {
	const [phase, setPhase] = useState<AppPhase>('pick');
	const [pickMode, setPickMode] = useState<PickMode>('first-player');
	const [direction, setDirection] = useState<Direction>('cw');
	const [seats, setSeats] = useState<Seat[]>([]);
	const [activeSeatIndex, setActiveSeatIndex] = useState<number>(0);
	const [turnCount, setTurnCount] = useState<number>(1);
	const [history, setHistory] = useState<CompassHistoryEntry[]>([]);
	const [isNamingOpen, setIsNamingOpen] = useState<boolean>(false);
	const [liveMessage, setLiveMessage] = useState<string>('');
	const nextHistoryIdRef = useRef<number>(1);

	const allocateHistoryId = useCallback((): number => {
		const id = nextHistoryIdRef.current;
		nextHistoryIdRef.current += 1;
		return id;
	}, []);

	// Hydrate state from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const data = JSON.parse(saved) as Partial<TableCompassState>;
				if (data.seats && Array.isArray(data.seats) && data.seats.length >= MIN_PLAYERS) {
					setSeats(data.seats);
					const resolvedIdx =
						typeof data.activeSeatIndex === 'number' && data.activeSeatIndex < data.seats.length
							? data.activeSeatIndex
							: 0;
					setActiveSeatIndex(resolvedIdx);
					if (data.pickMode) setPickMode(data.pickMode);
					if (data.direction) setDirection(data.direction);
					const resolvedTurn = typeof data.turnCount === 'number' ? data.turnCount : 1;
					setTurnCount(resolvedTurn);
					if (data.phase) setPhase(data.phase);
					if (Array.isArray(data.history) && data.history.length > 0) {
						setHistory(data.history);
						const maxId = data.history.reduce((max, item) => Math.max(max, item.id), 0);
						nextHistoryIdRef.current = maxId + 1;
					} else {
						const activeSeat = data.seats[resolvedIdx] ?? data.seats[0];
						if (activeSeat) {
							setHistory([
								{
									id: 1,
									kind: 'turn',
									turn: resolvedTurn,
									seatId: activeSeat.id,
									playerConfigIndex: activeSeat.playerConfigIndex,
									playerName: activeSeat.name,
								},
							]);
							nextHistoryIdRef.current = 2;
						}
					}
				}
			}
		} catch {
			// Ignore localStorage parse failures
		}
	}, []);

	// Sync state to localStorage
	useEffect(() => {
		if (seats.length >= MIN_PLAYERS) {
			const stateToSave: TableCompassState = {
				phase,
				pickMode,
				direction,
				seats,
				activeSeatIndex,
				turnCount,
				history,
			};
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
			} catch {
				// Ignore storage errors
			}
		}
	}, [phase, pickMode, direction, seats, activeSeatIndex, turnCount, history]);

	const handlePickComplete = useCallback((newSeats: Seat[], announcement?: string) => {
		setSeats(newSeats);
		const starterIndex = newSeats.findIndex((s) => s.isStarter);
		const activeIndex = starterIndex !== -1 ? starterIndex : 0;
		setActiveSeatIndex(activeIndex);
		setTurnCount(1);
		const starter = newSeats[activeIndex] ?? newSeats[0];
		if (starter) {
			nextHistoryIdRef.current = 2;
			setHistory([
				{
					id: 1,
					kind: 'turn',
					turn: 1,
					seatId: starter.id,
					playerConfigIndex: starter.playerConfigIndex,
					playerName: starter.name,
				},
			]);
		} else {
			setHistory([]);
		}
		setPhase('naming');
		triggerHaptic('success');
		playVictoryFanfare();
		if (announcement) {
			setLiveMessage(announcement);
		}
	}, []);

	const handleStartCompass = useCallback(() => {
		setSeats((prev) =>
			prev.map((s) => ({
				...s,
				name: s.name.trim() || PLAYER_CONFIGS[s.playerConfigIndex]?.defaultNameKey || 'Player',
			})),
		);
		setPhase('compass');
		setIsNamingOpen(false);
		triggerHaptic('light');
		playTap();
	}, []);

	const advanceTurn = useCallback(
		(steps: number, announcementTemplate?: (turn: number, name: string, shape: string) => string) => {
			if (seats.length === 0) return;

			triggerHaptic('light');
			playTap();

			const nextTurn = turnCount + 1;
			const stepSign = direction === 'cw' ? 1 : -1;
			const skippedIdx = (((activeSeatIndex + stepSign) % seats.length) + seats.length) % seats.length;
			const nextIdx = (((activeSeatIndex + stepSign * steps) % seats.length) + seats.length) % seats.length;
			const skippedSeat = steps > 1 ? seats[skippedIdx] : undefined;
			const activeSeat = seats[nextIdx];

			setTurnCount(nextTurn);
			setActiveSeatIndex(nextIdx);

			if (activeSeat) {
				if (announcementTemplate) {
					const config = PLAYER_CONFIGS[activeSeat.playerConfigIndex];
					setLiveMessage(announcementTemplate(nextTurn, activeSeat.name, config.icon));
				}

				setHistory((prev) => {
					const additions: CompassHistoryEntry[] = [];
					const turnEntry: CompassHistoryEntry = {
						id: allocateHistoryId(),
						kind: 'turn',
						turn: nextTurn,
						seatId: activeSeat.id,
						playerConfigIndex: activeSeat.playerConfigIndex,
						playerName: activeSeat.name,
					};
					additions.push(turnEntry);

					if (skippedSeat) {
						additions.push({
							id: allocateHistoryId(),
							kind: 'skip',
							turn: turnCount,
							seatId: skippedSeat.id,
							playerConfigIndex: skippedSeat.playerConfigIndex,
							playerName: skippedSeat.name,
						});
					}

					return [...additions, ...prev].slice(0, MAX_HISTORY_ITEMS);
				});
			}
		},
		[seats, direction, turnCount, activeSeatIndex, allocateHistoryId],
	);

	const handleNextTurn = useCallback(
		(announcementTemplate?: (turn: number, name: string, shape: string) => string) => {
			advanceTurn(1, announcementTemplate);
		},
		[advanceTurn],
	);

	const handleSkipPlayer = useCallback(
		(announcementTemplate?: (turn: number, name: string, shape: string) => string) => {
			advanceTurn(2, announcementTemplate);
		},
		[advanceTurn],
	);

	const handlePreviousTurn = useCallback(() => {
		if (seats.length === 0 || turnCount <= 1) return;

		triggerHaptic('light');
		playTap();

		setTurnCount((prev) => Math.max(1, prev - 1));
		setActiveSeatIndex((currentIdx) => {
			const delta = direction === 'cw' ? -1 : 1;
			return (currentIdx + delta + seats.length) % seats.length;
		});
		setHistory((prev) => {
			if (prev.length === 0) return prev;
			// Remove the latest turn entry (and an associated skip entry if immediately following)
			if (prev[0]?.kind === 'turn' && prev[1]?.kind === 'skip') {
				return prev.slice(2);
			}
			return prev.slice(1);
		});
	}, [seats, direction, turnCount]);

	const handleReverseDirection = useCallback(
		(cwMessage?: string, ccwMessage?: string) => {
			triggerHaptic('medium');
			playPickup();
			const next: Direction = direction === 'cw' ? 'ccw' : 'cw';
			setDirection(next);
			if (next === 'cw' && cwMessage) setLiveMessage(cwMessage);
			if (next === 'ccw' && ccwMessage) setLiveMessage(ccwMessage);

			setHistory((prev) =>
				[
					{
						id: allocateHistoryId(),
						kind: 'reverse' as const,
						direction: next,
						turn: turnCount,
					},
					...prev,
				].slice(0, MAX_HISTORY_ITEMS),
			);
		},
		[direction, turnCount, allocateHistoryId],
	);

	const handleUpdateSeatName = useCallback((seatId: string, newName: string) => {
		setSeats((prev) => prev.map((s) => (s.id === seatId ? { ...s, name: newName } : s)));
		const trimmed = newName.trim();
		if (trimmed) {
			setHistory((prev) =>
				prev.map((entry) => (entry.seatId === seatId ? { ...entry, playerName: trimmed } : entry)),
			);
		}
	}, []);

	const handleClearHistory = useCallback(() => {
		setHistory([]);
	}, []);

	const handleResetToPick = useCallback(() => {
		triggerHaptic('medium');
		setPhase('pick');
		setIsNamingOpen(false);
	}, []);

	const handleReturnToCompass = useCallback(() => {
		if (seats.length < MIN_PLAYERS) return;
		triggerHaptic('light');
		playTap();
		setPhase('compass');
	}, [seats.length]);

	const handleSkipToCompass = useCallback(
		(count = 4) => {
			const newSeats = generateSeatsForCount(count, pickMode);
			setSeats(newSeats);
			const starterIndex = newSeats.findIndex((s) => s.isStarter);
			const activeIndex = starterIndex !== -1 ? starterIndex : 0;
			setActiveSeatIndex(activeIndex);
			setTurnCount(1);
			const starter = newSeats[activeIndex] ?? newSeats[0];
			if (starter) {
				nextHistoryIdRef.current = 2;
				setHistory([
					{
						id: 1,
						kind: 'turn',
						turn: 1,
						seatId: starter.id,
						playerConfigIndex: starter.playerConfigIndex,
						playerName: starter.name,
					},
				]);
			}
			setPhase('compass');
			triggerHaptic('light');
			playTap();
		},
		[pickMode],
	);

	return {
		phase,
		setPhase,
		pickMode,
		setPickMode,
		direction,
		seats,
		setSeats,
		activeSeatIndex,
		setActiveSeatIndex,
		turnCount,
		history,
		isNamingOpen,
		setIsNamingOpen,
		liveMessage,
		setLiveMessage,
		handlePickComplete,
		handleStartCompass,
		handleNextTurn,
		handleSkipPlayer,
		handlePreviousTurn,
		handleReverseDirection,
		handleUpdateSeatName,
		handleClearHistory,
		handleResetToPick,
		handleReturnToCompass,
		hasActiveCompass: seats.length >= MIN_PLAYERS,
		handleSkipToCompass,
	};
}
