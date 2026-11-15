import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '@arcade/lib-ui/components/Button';
import { DiceTray, type DiceTrayHandle, type DiceTrayProps } from '@arcade/lib-ui/components/DiceTray';
import { ShakeToggle } from '@arcade/lib-ui/components/ShakeToggle';
import { WakeLockToggleButton } from '@arcade/lib-ui/components/WakeLockToggleButton';
import { useWakeLock } from '@arcade/lib-ui/hooks/useWakeLock';
import { useCallback, useRef, useState } from 'react';
import * as S from './DiceRoller.styles';
import type { DiceRollerProps } from './DiceRoller.types';

type RollDiceResult = Parameters<NonNullable<DiceTrayProps['onRollComplete']>>[0];

const MAX_HISTORY_ITEMS = 50;

interface DiceHistoryEntry {
	readonly id: number;
	readonly total: number;
	readonly values: readonly number[];
}

function DiceRollerContent(_props: DiceRollerProps): JSX.Element {
	const { t } = useI18n();
	const trayRef = useRef<DiceTrayHandle>(null);
	const [history, setHistory] = useState<DiceHistoryEntry[]>([]);
	const [wakeLockEnabled, setWakeLockEnabled] = useState<boolean>(true);
	const nextHistoryIdRef = useRef<number>(1);
	const { isSupported: wakeLockSupported, isActive: wakeLockActive } = useWakeLock(wakeLockEnabled);

	const handleShake = useCallback(() => {
		trayRef.current?.roll();
	}, []);

	const handleRollComplete = useCallback((result: RollDiceResult) => {
		const entryId = nextHistoryIdRef.current;
		nextHistoryIdRef.current += 1;
		const entry: DiceHistoryEntry = {
			id: entryId,
			total: result.total,
			values: result.dice.map((d) => d.value),
		};
		setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY_ITEMS));
	}, []);

	const handleClearHistory = useCallback(() => {
		setHistory([]);
	}, []);

	return (
		<div className={S.Container}>
			<div className={S.UtilityHeader}>
				<ShakeToggle
					onShake={handleShake}
					enableLabel={t('tools.dice.enableShake')}
					enabledLabel={t('tools.dice.shakeEnabled')}
					disabledLabel={t('tools.dice.shakeDisabled')}
				/>
				<WakeLockToggleButton
					enabled={wakeLockEnabled}
					isActive={wakeLockActive}
					isSupported={wakeLockSupported}
					onToggle={setWakeLockEnabled}
				/>
			</div>

			<div className={S.StyledDiceTrayWrapper}>
				<DiceTray
					ref={trayRef}
					defaultCount={5}
					onRollComplete={handleRollComplete}
					ariaLabel={t('tools.dice.title')}
					countLabel={t('tools.dice.countLabel')}
					decrementLabel={t('tools.dice.decreaseCount')}
					incrementLabel={t('tools.dice.increaseCount')}
				/>
			</div>

			<section className={S.HistorySection} aria-label={t('tools.dice.historyLabel')}>
				<div className={S.HistoryHeader}>
					<h2 className={S.HistoryTitle}>{t('tools.dice.historyLabel')}</h2>
					{history.length > 0 && (
						<Button
							size="sm"
							variant="ghost"
							onClick={handleClearHistory}
							aria-label={t('tools.dice.clearHistory')}
						>
							✕ {t('tools.dice.clearHistory')}
						</Button>
					)}
				</div>
				{history.length === 0 ? (
					<span className={S.EmptyHistory}>{t('tools.dice.emptyHistory')}</span>
				) : (
					<div className={S.HistoryStrip}>
						{history.map((entry) => {
							const detailLabel = t('tools.dice.rollHistoryEntry', {
								total: entry.total,
								values: entry.values.join(', '),
							});
							return (
								<span
									key={entry.id}
									className={S.HistoryPill}
									aria-label={detailLabel}
									title={detailLabel}
								>
									{entry.total}
								</span>
							);
						})}
					</div>
				)}
			</section>
		</div>
	);
}

export function DiceRoller({ lang }: DiceRollerProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<DiceRollerContent lang={lang} />
		</I18nProvider>
	);
}
