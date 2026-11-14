import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playCoinLandClack, playCoinTossPing, triggerCoinHaptic } from '../../audio/coinAudio';
import type { CoinSpinVariant } from '../Coin';
import { DEFAULT_TRAY_COINS, MAX_TRAY_COINS, MIN_TRAY_COINS } from './_CoinTray.constants';
import { flipCryptoCoins, prefersReducedMotion } from './_CoinTray.functions';
import type { CoinState, CoinTrayProps } from './_CoinTray.types';

function clampCount(count: number): number {
	return Math.max(MIN_TRAY_COINS, Math.min(MAX_TRAY_COINS, count));
}

export function useCoinTray({
	defaultCount = DEFAULT_TRAY_COINS,
	count: controlledCount,
	onCountChange,
	onFlipComplete,
	headsLabel = 'Heads',
	tailsLabel = 'Tails',
	singleResultFormatter,
	batchResultFormatter,
}: Pick<
	CoinTrayProps,
	| 'defaultCount'
	| 'count'
	| 'onCountChange'
	| 'onFlipComplete'
	| 'headsLabel'
	| 'tailsLabel'
	| 'singleResultFormatter'
	| 'batchResultFormatter'
>) {
	const [internalCount, setInternalCount] = useState<number>(() => clampCount(controlledCount ?? defaultCount));
	const activeCount = controlledCount !== undefined ? clampCount(controlledCount) : internalCount;

	const [coins, setCoins] = useState<CoinState[]>(() =>
		Array.from({ length: activeCount }, (_, idx) => ({
			id: idx,
			face: 'heads',
			spinVariant: 'a',
		})),
	);
	const [isFlipping, setIsFlipping] = useState<boolean>(false);
	const [announcement, setAnnouncement] = useState<string>('');

	const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const spinToggleRef = useRef<CoinSpinVariant>('a');
	const [rollingSummary, setRollingSummary] = useState<{ heads: number; tails: number } | null>(null);

	useEffect(() => {
		setCoins((prev) => {
			if (prev.length === activeCount) return prev;
			if (prev.length < activeCount) {
				const extras: CoinState[] = Array.from({ length: activeCount - prev.length }, (_, idx) => ({
					id: prev.length + idx,
					face: 'heads',
					spinVariant: spinToggleRef.current,
				}));
				return [...prev, ...extras];
			}
			return prev.slice(0, activeCount);
		});
	}, [activeCount]);

	useEffect(() => {
		return () => {
			if (settleTimeoutRef.current) {
				clearTimeout(settleTimeoutRef.current);
			}
			if (rollIntervalRef.current) {
				clearInterval(rollIntervalRef.current);
			}
		};
	}, []);

	const handleCountChange = useCallback(
		(nextCount: number) => {
			const clamped = clampCount(nextCount);
			if (controlledCount === undefined) {
				setInternalCount(clamped);
			}
			onCountChange?.(clamped);
		},
		[controlledCount, onCountChange],
	);

	const handleFlip = useCallback(() => {
		if (isFlipping) return;

		if (settleTimeoutRef.current) {
			clearTimeout(settleTimeoutRef.current);
		}
		if (rollIntervalRef.current) {
			clearInterval(rollIntervalRef.current);
		}

		const nextSpin: CoinSpinVariant = spinToggleRef.current === 'a' ? 'b' : 'a';
		spinToggleRef.current = nextSpin;

		playCoinTossPing();
		triggerCoinHaptic();
		setIsFlipping(true);

		rollIntervalRef.current = setInterval(() => {
			const randomHeads = Math.floor(Math.random() * (activeCount + 1));
			setRollingSummary({ heads: randomHeads, tails: activeCount - randomHeads });
		}, 70);

		const settleMs = prefersReducedMotion() ? 150 : 620;
		const outcomes = flipCryptoCoins(activeCount);

		setCoins(
			outcomes.map((face, idx) => ({
				id: idx,
				face,
				spinVariant: nextSpin,
			})),
		);

		settleTimeoutRef.current = setTimeout(() => {
			if (rollIntervalRef.current) {
				clearInterval(rollIntervalRef.current);
				rollIntervalRef.current = null;
			}
			setRollingSummary(null);
			setIsFlipping(false);
			playCoinLandClack();
			triggerCoinHaptic();

			const heads = outcomes.filter((f) => f === 'heads').length;
			const tails = outcomes.length - heads;

			if (outcomes.length === 1) {
				const outcome = outcomes[0] ?? 'heads';
				const label = outcome === 'heads' ? headsLabel : tailsLabel;
				setAnnouncement(singleResultFormatter ? singleResultFormatter(label) : `Result: ${label}`);
			} else {
				setAnnouncement(
					batchResultFormatter
						? batchResultFormatter(heads, tails)
						: `${heads} ${headsLabel}, ${tails} ${tailsLabel}`,
				);
			}

			onFlipComplete?.({ outcomes, heads, tails });
		}, settleMs);
	}, [activeCount, batchResultFormatter, headsLabel, isFlipping, onFlipComplete, singleResultFormatter, tailsLabel]);

	const handleReset = useCallback(() => {
		if (isFlipping) return;
		setCoins((prev) => {
			const reset = prev.map((coin) => ({
				...coin,
				face: 'heads' as const,
			}));
			setAnnouncement(`Reset ${reset.length} ${reset.length === 1 ? 'coin' : 'coins'}.`);
			return reset;
		});
	}, [isFlipping]);

	const summary = useMemo(() => {
		if (rollingSummary) {
			return rollingSummary;
		}
		const heads = coins.filter((c) => c.face === 'heads').length;
		const tails = coins.length - heads;
		return { heads, tails };
	}, [coins, rollingSummary]);

	return {
		activeCount,
		coins,
		isFlipping,
		summary,
		announcement,
		handleCountChange,
		handleFlip,
		handleReset,
	};
}
