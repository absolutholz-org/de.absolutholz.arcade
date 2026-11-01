import { type DieState, type RollDiceResult, createDice, resetDice, rollDice, toggleDieHold } from '@arcade/lib-dice';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playDiceRollSound as defaultPlayDiceRollSound } from '../../audio/diceAudio';
import { DEFAULT_TRAY_DICE, MAX_TRAY_DICE, MIN_TRAY_DICE } from './_DiceTray.constants';
import type { DiceTrayProps } from './_DiceTray.types';

export function useDiceTray({
	defaultCount = DEFAULT_TRAY_DICE,
	count: controlledCount,
	onCountChange,
	onRollComplete,
	dice: controlledDice,
	onToggleHold: controlledToggleHold,
	playRollSound = defaultPlayDiceRollSound,
}: Pick<
	DiceTrayProps,
	'defaultCount' | 'count' | 'onCountChange' | 'onRollComplete' | 'dice' | 'onToggleHold' | 'playRollSound'
>) {
	const initialCount = Math.max(MIN_TRAY_DICE, Math.min(MAX_TRAY_DICE, controlledCount ?? defaultCount));
	const [internalCount, setInternalCount] = useState<number>(initialCount);
	const activeCount = controlledCount !== undefined ? controlledCount : internalCount;

	const [internalDice, setInternalDice] = useState<DieState[]>(() => createDice(activeCount, 6));
	const activeDice = controlledDice !== undefined ? controlledDice : internalDice;

	const [isRolling, setIsRolling] = useState<boolean>(false);
	const [announcement, setAnnouncement] = useState<string>('');
	const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Synchronize internal dice array length whenever count changes
	useEffect(() => {
		if (controlledDice !== undefined) {
			return;
		}

		setInternalDice((prevDice) => {
			if (prevDice.length === activeCount) {
				return prevDice;
			}
			if (prevDice.length < activeCount) {
				const additionsNeeded = activeCount - prevDice.length;
				return [...prevDice, ...createDice(additionsNeeded, 6)];
			}
			return prevDice.slice(0, activeCount);
		});
	}, [activeCount, controlledDice]);

	// Cleanup pending roll timers on unmount
	useEffect(() => {
		return () => {
			if (rollIntervalRef.current) {
				clearInterval(rollIntervalRef.current);
			}
			if (rollTimeoutRef.current) {
				clearTimeout(rollTimeoutRef.current);
			}
		};
	}, []);

	const total = useMemo(() => {
		return activeDice.reduce((sum, die) => sum + die.value, 0);
	}, [activeDice]);

	const handleToggleHold = useCallback(
		(id: string) => {
			if (controlledToggleHold) {
				controlledToggleHold(id);
				return;
			}

			setInternalDice((prev) => {
				const target = prev.find((d) => d.id === id);
				const next = toggleDieHold(prev, id);
				if (target) {
					const nextHeld = !target.isHeld;
					const dieIdx = prev.findIndex((d) => d.id === id) + 1;
					setAnnouncement(`Die ${dieIdx} ${nextHeld ? 'held' : 'unheld'}.`);
				}
				return next;
			});
		},
		[controlledToggleHold],
	);

	const handleRoll = useCallback(() => {
		if (isRolling) {
			return;
		}

		const unheldCount = activeDice.filter((die) => !die.isHeld).length;
		if (unheldCount === 0) {
			return;
		}

		playRollSound(unheldCount);
		setIsRolling(true);

		const finalResult: RollDiceResult = rollDice(activeDice);

		if (rollIntervalRef.current) {
			clearInterval(rollIntervalRef.current);
		}
		if (rollTimeoutRef.current) {
			clearTimeout(rollTimeoutRef.current);
		}

		// Rapidly cycle intermediate tumbling faces on unheld dice during the roll
		rollIntervalRef.current = setInterval(() => {
			setInternalDice((prev) =>
				prev.map((die) => {
					if (die.isHeld) {
						return die;
					}
					const intermediateFace = Math.floor(Math.random() * 6) + 1;
					return { ...die, value: intermediateFace, isRolling: true };
				}),
			);
		}, 70);

		// Settle dice after 520ms of physics tumble
		rollTimeoutRef.current = setTimeout(() => {
			if (rollIntervalRef.current) {
				clearInterval(rollIntervalRef.current);
				rollIntervalRef.current = null;
			}

			if (controlledDice === undefined) {
				setInternalDice(finalResult.dice);
			}

			setIsRolling(false);

			const valuesString = finalResult.dice.map((d) => d.value).join(', ');
			setAnnouncement(
				`Rolled ${finalResult.dice.length} ${finalResult.dice.length === 1 ? 'die' : 'dice'}: ${valuesString}. Total ${finalResult.total}.`,
			);

			onRollComplete?.(finalResult);
		}, 520);
	}, [activeDice, controlledDice, isRolling, onRollComplete, playRollSound]);

	const handleReset = useCallback(() => {
		if (controlledDice === undefined) {
			setInternalDice((prev) => {
				const reset = resetDice(prev);
				const sum = reset.reduce((acc, d) => acc + d.value, 0);
				setAnnouncement(`Reset ${reset.length} dice. Total ${sum}.`);
				return reset;
			});
		}
	}, [controlledDice]);

	const handleSelectCount = useCallback(
		(newCount: number) => {
			if (newCount < MIN_TRAY_DICE || newCount > MAX_TRAY_DICE) {
				return;
			}
			setInternalCount(newCount);
			onCountChange?.(newCount);
			setAnnouncement(`Selected ${newCount} ${newCount === 1 ? 'die' : 'dice'}.`);
		},
		[onCountChange],
	);

	return {
		activeDice,
		activeCount,
		isRolling,
		total,
		announcement,
		handleRoll,
		handleReset,
		handleToggleHold,
		handleSelectCount,
	};
}
