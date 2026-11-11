import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Collapsible } from '@arcade/lib-ui/components/Collapsible';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { PRESET_CATALOG, getPresetsByDifficulty } from '../../engine/presets/index.js';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage.js';
import {
	DIFFICULTY_CONFIG,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type GameSnapshot,
	type ProgressMap,
} from '../../engine/types.js';
import * as S from './LiquidSortLobby.styles.js';
import type { LiquidSortLobbyProps } from './LiquidSortLobby.types.js';

function getInitialLobbyDifficulty(propDiff?: DifficultyLevel): DifficultyLevel {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const diff = params.get('difficulty') as DifficultyLevel | null;
		if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
			return diff;
		}
	}
	if (propDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(propDiff)) {
		return propDiff;
	}
	return 'easy';
}

function LobbyContent({ initialDifficulty }: { initialDifficulty?: DifficultyLevel }): JSX.Element {
	const { t, language } = useI18n('liquid-sort');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(() =>
		getInitialLobbyDifficulty(initialDifficulty),
	);
	const [hasActivePuzzleQuery, setHasActivePuzzleQuery] = useState(false);

	useEffect(() => {
		async function init() {
			const [saved, prog, lastConfig] = await Promise.all([loadActiveGame(), loadProgress(), loadLastConfig()]);
			if (saved && !saved.isComplete) {
				setActiveGame(saved);
			}
			setProgress(prog);

			let hasUrlDiff = false;
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				if (params.has('puzzle')) {
					setHasActivePuzzleQuery(true);
				}
				const queryDiff = params.get('difficulty') as DifficultyLevel | null;
				if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
					setSelectedDifficulty(queryDiff);
					hasUrlDiff = true;
				}
			}

			if (!hasUrlDiff && saved && !saved.isComplete && saved.difficulty) {
				setSelectedDifficulty(saved.difficulty);
			} else if (
				!hasUrlDiff &&
				lastConfig?.difficulty &&
				(DIFFICULTY_LEVELS as readonly string[]).includes(lastConfig.difficulty)
			) {
				setSelectedDifficulty(lastConfig.difficulty);
			}
		}
		void init();
	}, []);

	const handleSelectDifficulty = (diff: DifficultyLevel) => {
		setSelectedDifficulty(diff);
		void saveLastConfig({ difficulty: diff });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', diff);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const difficultyItems: SegmentedControlItem[] = DIFFICULTY_LEVELS.map((level) => {
		const cfg = DIFFICULTY_CONFIG[level];
		return {
			id: level,
			label: t(`difficulty.${level}` as Parameters<typeof t>[0]),
			sublabel: `${cfg.colorCount} colors`,
		};
	});

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}` as Parameters<typeof t>[0])} • Moves: ${activeGame.moves} • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/liquid-sort/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/liquid-sort/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/liquid-sort/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/liquid-sort/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/liquid-sort/${language}/medals` },
	];

	const presets = getPresetsByDifficulty(selectedDifficulty);
	const totalCuratedCount = Object.values(PRESET_CATALOG).reduce((acc, list) => acc + list.length, 0);

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="liquid-sort"
		>
			<S.Section aria-labelledby="liquid-sort-quickplay-title">
				<h2 id="liquid-sort-quickplay-title">{t('difficulty.label')}</h2>
				<S.QuickPlayGrid>
					{DIFFICULTY_LEVELS.map((diff) => {
						const cfg = DIFFICULTY_CONFIG[diff];
						const diffPresets = getPresetsByDifficulty(diff);
						const solvedCount = diffPresets.filter((p) => {
							const rec = progress[`${diff}-${p.level}`] ?? progress[p.id];
							return rec?.completed;
						}).length;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/liquid-sort/${language}/game?difficulty=${diff}&new=true`}
								onClick={() => {
									void saveLastConfig({ difficulty: diff });
								}}
								title={t(`difficulty.${diff}` as Parameters<typeof t>[0])}
								dimensions={`${cfg.colorCount} colors`}
								subtitle={t(`difficulty.${diff}Desc` as Parameters<typeof t>[0])}
								badge={
									solvedCount > 0
										? {
												label: `${solvedCount}/${diffPresets.length} ${t('levels.completed')}`,
												variant: solvedCount === diffPresets.length ? 'success' : 'neutral',
											}
										: undefined
								}
							/>
						);
					})}
				</S.QuickPlayGrid>
			</S.Section>

			<S.ArchiveWrapper>
				<Collapsible
					title={tCommon('curatedPuzzles')}
					count={totalCuratedCount}
					defaultOpen={hasActivePuzzleQuery}
				>
					<S.ArchiveContent>
						<SegmentedControl
							items={difficultyItems}
							value={selectedDifficulty}
							onChange={(val) => handleSelectDifficulty(val as DifficultyLevel)}
							ariaLabel={t('difficulty.label')}
						/>

						<S.PuzzlesGrid>
							{presets.map((preset) => {
								const puzzleRecord =
									progress[`${selectedDifficulty}-${preset.level}`] ?? progress[preset.id];
								const isCompleted = Boolean(puzzleRecord?.completed);

								const subtitle =
									puzzleRecord?.bestTime !== undefined
										? t('levels.bestTime', { time: formatTime(puzzleRecord.bestTime) })
										: undefined;

								return (
									<GameSelectionCard
										key={preset.id}
										as="a"
										href={`/liquid-sort/${language}/game?difficulty=${selectedDifficulty}&seed=${preset.level}&puzzle=${preset.id}&new=true`}
										onClick={() => {
											void saveLastConfig({ difficulty: selectedDifficulty });
										}}
										title={t('levels.puzzleNum', { number: String(preset.level) })}
										dimensions={`${DIFFICULTY_CONFIG[selectedDifficulty].colorCount + DIFFICULTY_CONFIG[selectedDifficulty].emptyTubes} tubes`}
										subtitle={subtitle}
										badge={
											isCompleted
												? {
														label: t('levels.completed'),
														variant: 'success',
													}
												: undefined
										}
									/>
								);
							})}
						</S.PuzzlesGrid>
					</S.ArchiveContent>
				</Collapsible>
			</S.ArchiveWrapper>
		</GameLandingTemplate>
	);
}

export function LiquidSortLobby({ lang, initialDifficulty }: LiquidSortLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent initialDifficulty={initialDifficulty} />
		</I18nProvider>
	);
}
