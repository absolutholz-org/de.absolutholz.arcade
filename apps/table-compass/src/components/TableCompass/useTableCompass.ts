import { playPickup, playTap, playVictoryFanfare, triggerHaptic } from '@arcade/lib-audio';
import { useCallback, useEffect, useState } from 'react';
import type { AppPhase, Direction, PickMode, Seat, TableCompassState } from './TableCompass.types';
import { MIN_PLAYERS, PLAYER_CONFIGS, STORAGE_KEY } from './constants';
import { generateSeatsForCount } from './geometry';

export { generateSeatsForCount };

export function useTableCompass() {
	const [phase, setPhase] = useState<AppPhase>('pick');
	const [pickMode, setPickMode] = useState<PickMode>('first-player');
	const [direction, setDirection] = useState<Direction>('cw');
	const [seats, setSeats] = useState<Seat[]>([]);
	const [activeSeatIndex, setActiveSeatIndex] = useState<number>(0);
	const [turnCount, setTurnCount] = useState<number>(1);
	const [isNamingOpen, setIsNamingOpen] = useState<boolean>(false);
	const [liveMessage, setLiveMessage] = useState<string>('');

	// Hydrate state from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const data = JSON.parse(saved) as Partial<TableCompassState>;
				if (data.seats && Array.isArray(data.seats) && data.seats.length >= MIN_PLAYERS) {
					setSeats(data.seats);
					if (typeof data.activeSeatIndex === 'number' && data.activeSeatIndex < data.seats.length) {
						setActiveSeatIndex(data.activeSeatIndex);
					}
					if (data.pickMode) setPickMode(data.pickMode);
					if (data.direction) setDirection(data.direction);
					if (typeof data.turnCount === 'number') setTurnCount(data.turnCount);
					if (data.phase) setPhase(data.phase);
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
			};
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
			} catch {
				// Ignore storage errors
			}
		}
	}, [phase, pickMode, direction, seats, activeSeatIndex, turnCount]);

	const handlePickComplete = useCallback((newSeats: Seat[], announcement?: string) => {
		setSeats(newSeats);
		const starterIndex = newSeats.findIndex((s) => s.isStarter);
		const activeIndex = starterIndex !== -1 ? starterIndex : 0;
		setActiveSeatIndex(activeIndex);
		setTurnCount(1);
		setPhase('naming');
		triggerHaptic('success');
		playVictoryFanfare();
		if (announcement) {
			setLiveMessage(announcement);
		}
	}, []);

	const handleStartCompass = useCallback(() => {
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

			setTurnCount((prev) => {
				const nextTurn = prev + 1;
				setActiveSeatIndex((currentIdx) => {
					const delta = direction === 'cw' ? steps : -steps;
					const nextIdx = (((currentIdx + delta) % seats.length) + seats.length) % seats.length;
					const activeSeat = seats[nextIdx];
					if (announcementTemplate && activeSeat) {
						const config = PLAYER_CONFIGS[activeSeat.playerConfigIndex];
						setLiveMessage(announcementTemplate(nextTurn, activeSeat.name, config.icon));
					}
					return nextIdx;
				});
				return nextTurn;
			});
		},
		[seats, direction],
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
	}, [seats, direction, turnCount]);

	const handleReverseDirection = useCallback((cwMessage?: string, ccwMessage?: string) => {
		triggerHaptic('medium');
		playPickup();
		setDirection((prev) => {
			const next = prev === 'cw' ? 'ccw' : 'cw';
			if (next === 'cw' && cwMessage) setLiveMessage(cwMessage);
			if (next === 'ccw' && ccwMessage) setLiveMessage(ccwMessage);
			return next;
		});
	}, []);

	const handleUpdateSeatName = useCallback((seatId: string, newName: string) => {
		setSeats((prev) => prev.map((s) => (s.id === seatId ? { ...s, name: newName.trim() || s.name } : s)));
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
			setActiveSeatIndex(starterIndex !== -1 ? starterIndex : 0);
			setTurnCount(1);
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
		handleResetToPick,
		handleReturnToCompass,
		hasActiveCompass: seats.length >= MIN_PLAYERS,
		handleSkipToCompass,
	};
}
