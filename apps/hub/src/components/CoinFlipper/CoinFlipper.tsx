import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '@arcade/lib-ui/components/Button';
import { NumberInput } from '@arcade/lib-ui/components/NumberInput';
import { ShakeToggle } from '@arcade/lib-ui/components/ShakeToggle';
// import { SegmentedControl } from '@arcade/lib-ui/components/SegmentedControl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as S from './CoinFlipper.styles';
import type {
	CoinFace,
	CoinFlipperProps,
	CoinHistoryEntry,
	CoinPreferences,
	CoinState,
	CoinStyle,
} from './CoinFlipper.types';
import { CoinVisual } from './CoinVisual';
import { playCoinLandClack, playCoinTossPing, triggerCoinHaptic } from './coinAudio';
import { flipCryptoCoins } from './coinRng';

const PREFS_STORAGE_KEY = 'arcade::tool::coin::prefs';
const MAX_HISTORY_ITEMS = 50;
const MIN_COIN_COUNT = 1;
const MAX_COIN_COUNT = 10;

const DEFAULT_PREFS: CoinPreferences = {
	style: 'token',
	mode: 'single',
	batchCount: 1,
};

function readStoredPreferences(): CoinPreferences {
	if (typeof window === 'undefined') {
		return DEFAULT_PREFS;
	}

	try {
		const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
		if (!raw) return DEFAULT_PREFS;
		const parsed = JSON.parse(raw) as Partial<CoinPreferences>;

		const style: CoinStyle =
			parsed.style === 'token' || parsed.style === 'classic' || parsed.style === 'minimal'
				? parsed.style
				: DEFAULT_PREFS.style;
		const batchCount =
			typeof parsed.batchCount === 'number' &&
			Number.isInteger(parsed.batchCount) &&
			parsed.batchCount >= MIN_COIN_COUNT &&
			parsed.batchCount <= MAX_COIN_COUNT
				? parsed.batchCount
				: DEFAULT_PREFS.batchCount;

		return { style, mode: batchCount === 1 ? 'single' : 'batch', batchCount };
	} catch {
		return DEFAULT_PREFS;
	}
}

function writeStoredPreferences(prefs: CoinPreferences): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
	} catch {
		// Ignore quota or private mode storage errors
	}
}

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return false;
	}
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function CoinFlipperContent(): JSX.Element {
	const { t } = useI18n();

	const [prefs, setPrefs] = useState<CoinPreferences>(DEFAULT_PREFS);
	const [coins, setCoins] = useState<CoinState[]>(() =>
		Array.from({ length: DEFAULT_PREFS.batchCount }, (_, idx) => ({
			id: idx,
			face: 'heads',
			spinVariant: 'a',
		})),
	);
	const [isFlipping, setIsFlipping] = useState<boolean>(false);
	const [hasFlipped, setHasFlipped] = useState<boolean>(false);
	const [history, setHistory] = useState<CoinHistoryEntry[]>([]);
	const [announcement, setAnnouncement] = useState<string>('');

	const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const nextHistoryIdRef = useRef<number>(1);
	const spinToggleRef = useRef<'a' | 'b'>('a');

	useEffect(() => {
		const loaded = readStoredPreferences();
		setPrefs(loaded);
		setCoins(
			Array.from({ length: loaded.batchCount }, (_, idx) => ({
				id: idx,
				face: 'heads',
				spinVariant: 'a',
			})),
		);
	}, []);

	useEffect(() => {
		return () => {
			if (settleTimeoutRef.current) {
				clearTimeout(settleTimeoutRef.current);
			}
		};
	}, []);

	const updatePrefs = useCallback((updater: (prev: CoinPreferences) => CoinPreferences) => {
		setPrefs((prev) => {
			const next = updater(prev);
			writeStoredPreferences(next);
			return next;
		});
	}, []);

	// Kept for future coin style selector iteration
	// const handleStyleChange = useCallback(
	// 	(nextStyle: CoinStyle) => {
	// 		updatePrefs((prev) => ({ ...prev, style: nextStyle }));
	// 	},
	// 	[updatePrefs],
	// );

	const handleCountChange = useCallback(
		(nextCount: number) => {
			const clamped = Math.max(MIN_COIN_COUNT, Math.min(MAX_COIN_COUNT, nextCount));
			updatePrefs((prev) => ({
				...prev,
				mode: clamped === 1 ? 'single' : 'batch',
				batchCount: clamped,
			}));
			setCoins((prev) => {
				if (prev.length === clamped) return prev;
				if (prev.length < clamped) {
					const extras: CoinState[] = Array.from({ length: clamped - prev.length }, (_, idx) => ({
						id: prev.length + idx,
						face: 'heads',
						spinVariant: spinToggleRef.current,
					}));
					return [...prev, ...extras];
				}
				return prev.slice(0, clamped);
			});
		},
		[updatePrefs],
	);

	const triggerFlip = useCallback(() => {
		if (isFlipping) return;

		if (settleTimeoutRef.current) {
			clearTimeout(settleTimeoutRef.current);
		}

		const nextSpin: 'a' | 'b' = spinToggleRef.current === 'a' ? 'b' : 'a';
		spinToggleRef.current = nextSpin;

		playCoinTossPing();
		triggerCoinHaptic();
		setIsFlipping(true);

		const settleMs = prefersReducedMotion() ? 150 : 620;
		const outcomes = flipCryptoCoins(prefs.batchCount);

		setCoins(
			outcomes.map((face, idx) => ({
				id: idx,
				face,
				spinVariant: nextSpin,
			})),
		);

		settleTimeoutRef.current = setTimeout(() => {
			setIsFlipping(false);
			setHasFlipped(true);
			playCoinLandClack();
			triggerCoinHaptic();

			setHistory((prev) => {
				const newEntries: CoinHistoryEntry[] = outcomes.map((face) => {
					const entryId = nextHistoryIdRef.current;
					nextHistoryIdRef.current += 1;
					return { id: entryId, face };
				});
				return [...newEntries, ...prev].slice(0, MAX_HISTORY_ITEMS);
			});

			if (outcomes.length === 1) {
				const outcome = outcomes[0] ?? 'heads';
				const label = outcome === 'heads' ? t('tools.coin.heads') : t('tools.coin.tails');
				setAnnouncement(t('tools.coin.resultSingle', { result: label }));
			} else {
				const headsCount = outcomes.filter((f) => f === 'heads').length;
				const tailsCount = outcomes.length - headsCount;
				setAnnouncement(t('tools.coin.resultBatch', { heads: headsCount, tails: tailsCount }));
			}
		}, settleMs);
	}, [isFlipping, prefs.batchCount, t]);

	const handleClearHistory = useCallback(() => {
		setHistory([]);
	}, []);

	const headsLabel = t('tools.coin.heads');
	const tailsLabel = t('tools.coin.tails');
	const headsShort = t('tools.coin.headsShort');
	const tailsShort = t('tools.coin.tailsShort');

	const summary = useMemo(() => {
		const heads = coins.filter((c) => c.face === 'heads').length;
		const tails = coins.length - heads;
		return { heads, tails };
	}, [coins]);

	const isSingle = prefs.batchCount === 1;
	const singleCoin = coins[0] ?? { id: 0, face: 'heads' as CoinFace, spinVariant: 'a' as const };
	const singleFaceText = singleCoin.face === 'heads' ? headsLabel : tailsLabel;

	return (
		<div className={S.Container}>
			<div className={S.Toolbar}>
				<ShakeToggle
					onShake={triggerFlip}
					enableLabel={t('tools.coin.enableShake')}
					enabledLabel={t('tools.coin.shakeEnabled')}
					disabledLabel={t('tools.coin.shakeDisabled')}
				/>
			</div>

			{/* Coin style selector hidden for now; will return in a future iteration
			<div className={S.Toolbar}>
				<SegmentedControl
					size="sm"
					ariaLabel={t('tools.coin.styleLabel')}
					value={prefs.style}
					onChange={handleStyleChange}
					options={[
						{ value: 'token' as const, label: t('tools.coin.styleToken') },
						{ value: 'classic' as const, label: t('tools.coin.styleClassic') },
						{ value: 'minimal' as const, label: t('tools.coin.styleMinimal') },
					]}
				/>
			</div>
			*/}

			<section className={S.StageCard} aria-label={t('tools.coin.title')}>
				<div className={S.BatchControls}>
					<NumberInput
						size="sm"
						value={prefs.batchCount}
						onChange={handleCountChange}
						min={MIN_COIN_COUNT}
						max={MAX_COIN_COUNT}
						disabled={isFlipping}
						ariaLabel={t('tools.coin.countLabel')}
						decrementAriaLabel={t('tools.coin.decreaseCount')}
						incrementAriaLabel={t('tools.coin.increaseCount')}
					/>
				</div>

				{isSingle ? (
					<div className={S.SingleStage}>
						<button
							type="button"
							className={S.CoinButton}
							onClick={triggerFlip}
							disabled={isFlipping}
							aria-label={`${t('tools.coin.flipButton')} (${singleFaceText})`}
						>
							<CoinVisual
								face={singleCoin.face}
								styleVariant={prefs.style}
								isFlipping={isFlipping}
								spinVariant={singleCoin.spinVariant}
								size="md"
								headsShort={headsShort}
								tailsShort={tailsShort}
							/>
						</button>
						<div className={S.ResultLabel}>{hasFlipped && !isFlipping ? singleFaceText : '\u00A0'}</div>
					</div>
				) : (
					<>
						{hasFlipped && !isFlipping && (
							<div className={S.SummaryPill}>
								{t('tools.coin.summary', { heads: summary.heads, tails: summary.tails })}
							</div>
						)}
						<div className={S.BatchGrid}>
							{coins.map((coin) => {
								const coinLabel = coin.face === 'heads' ? headsLabel : tailsLabel;
								return (
									<button
										key={coin.id}
										type="button"
										className={S.CoinButton}
										onClick={triggerFlip}
										disabled={isFlipping}
										aria-label={`${coinLabel} — ${t('tools.coin.flipBatchButton', { count: prefs.batchCount })}`}
									>
										<CoinVisual
											face={coin.face}
											styleVariant={prefs.style}
											isFlipping={isFlipping}
											spinVariant={coin.spinVariant}
											size="sm"
											headsShort={headsShort}
											tailsShort={tailsShort}
										/>
									</button>
								);
							})}
						</div>
					</>
				)}

				<div className={S.ActionRow}>
					<Button size="lg" variant="primary" onClick={triggerFlip} disabled={isFlipping}>
						{isSingle
							? t('tools.coin.flipButton')
							: t('tools.coin.flipBatchButton', { count: prefs.batchCount })}
					</Button>
				</div>
			</section>

			<section className={S.HistorySection} aria-label={t('tools.coin.historyLabel')}>
				<div className={S.HistoryHeader}>
					<h2 className={S.HistoryTitle}>{t('tools.coin.historyLabel')}</h2>
					{history.length > 0 && (
						<Button
							size="sm"
							variant="ghost"
							onClick={handleClearHistory}
							aria-label={t('tools.coin.clearHistory')}
						>
							✕ {t('tools.coin.clearHistory')}
						</Button>
					)}
				</div>
				{history.length === 0 ? (
					<span className={S.EmptyHistory}>{t('tools.coin.emptyHistory')}</span>
				) : (
					<div className={S.HistoryStrip}>
						{history.map((entry: CoinHistoryEntry) => {
							const face: CoinFace = entry.face;
							const short = face === 'heads' ? headsShort : tailsShort;
							const full = face === 'heads' ? headsLabel : tailsLabel;
							return (
								<span
									key={entry.id}
									className={S.HistoryPill}
									data-face={face}
									aria-label={full}
									title={full}
								>
									{short}
								</span>
							);
						})}
					</div>
				)}
			</section>

			<output className={S.LiveRegion} aria-live="polite" aria-atomic="true">
				{announcement}
			</output>
		</div>
	);
}

export function CoinFlipper({ lang }: CoinFlipperProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<CoinFlipperContent />
		</I18nProvider>
	);
}
