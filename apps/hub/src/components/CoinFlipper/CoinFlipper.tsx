import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '@arcade/lib-ui/components/Button';
import type { CoinFace, CoinStyle } from '@arcade/lib-ui/components/Coin';
import { type CoinFlipResult, CoinTray, type CoinTrayHandle } from '@arcade/lib-ui/components/CoinTray';
import { ShakeToggle } from '@arcade/lib-ui/components/ShakeToggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './CoinFlipper.styles';
import type { CoinFlipperProps, CoinHistoryEntry, CoinPreferences } from './CoinFlipper.types';

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

function CoinFlipperContent(): JSX.Element {
	const { t } = useI18n();

	const [prefs, setPrefs] = useState<CoinPreferences>(DEFAULT_PREFS);
	const [history, setHistory] = useState<CoinHistoryEntry[]>([]);
	const trayRef = useRef<CoinTrayHandle>(null);
	const nextHistoryIdRef = useRef<number>(1);

	useEffect(() => {
		setPrefs(readStoredPreferences());
	}, []);

	const updatePrefs = useCallback((updater: (prev: CoinPreferences) => CoinPreferences) => {
		setPrefs((prev) => {
			const next = updater(prev);
			writeStoredPreferences(next);
			return next;
		});
	}, []);

	const handleCountChange = useCallback(
		(nextCount: number) => {
			const clamped = Math.max(MIN_COIN_COUNT, Math.min(MAX_COIN_COUNT, nextCount));
			updatePrefs((prev) => ({
				...prev,
				mode: clamped === 1 ? 'single' : 'batch',
				batchCount: clamped,
			}));
		},
		[updatePrefs],
	);

	const handleFlipComplete = useCallback((result: CoinFlipResult) => {
		setHistory((prev) => {
			const newEntries: CoinHistoryEntry[] = result.outcomes.map((face) => {
				const entryId = nextHistoryIdRef.current;
				nextHistoryIdRef.current += 1;
				return { id: entryId, face };
			});
			return [...newEntries, ...prev].slice(0, MAX_HISTORY_ITEMS);
		});
	}, []);

	const handleShake = useCallback(() => {
		trayRef.current?.flip();
	}, []);

	const handleClearHistory = useCallback(() => {
		setHistory([]);
	}, []);

	const headsLabel = t('tools.coin.heads');
	const tailsLabel = t('tools.coin.tails');
	const headsShort = t('tools.coin.headsShort');
	const tailsShort = t('tools.coin.tailsShort');

	return (
		<div className={S.Container}>
			<div className={S.Toolbar}>
				<ShakeToggle
					onShake={handleShake}
					enableLabel={t('tools.coin.enableShake')}
					enabledLabel={t('tools.coin.shakeEnabled')}
					disabledLabel={t('tools.coin.shakeDisabled')}
				/>
			</div>

			<CoinTray
				ref={trayRef}
				count={prefs.batchCount}
				onCountChange={handleCountChange}
				onFlipComplete={handleFlipComplete}
				styleVariant={prefs.style}
				ariaLabel={t('tools.coin.title')}
				headsLabel={headsLabel}
				tailsLabel={tailsLabel}
				headsShort={headsShort}
				tailsShort={tailsShort}
				countLabel={t('tools.coin.countLabel')}
				decrementLabel={t('tools.coin.decreaseCount')}
				incrementLabel={t('tools.coin.increaseCount')}
				flipButtonLabel={t('tools.coin.flipButton')}
				flipBatchButtonLabel={t('tools.coin.flipBatchButton', { count: prefs.batchCount })}
				singleResultFormatter={(result) => t('tools.coin.resultSingle', { result })}
				batchResultFormatter={(heads, tails) => t('tools.coin.resultBatch', { heads, tails })}
			/>

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
