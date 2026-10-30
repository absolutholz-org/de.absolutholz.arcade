import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import {
	GameLandingTemplate,
	GameSelectionCard,
	Icon,
	QuickPlayCard,
	SegmentedControl,
	type SegmentedControlItem,
} from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { type JSX, useEffect, useState } from 'react';
import { getPresetsByDifficulty } from '../../engine/presets/index.js';
import { loadActiveGame, loadProgress } from '../../engine/storage.js';
import {
	DIFFICULTY_CONFIG,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type GameSnapshot,
	type ProgressMap,
} from '../../engine/types.js';
import * as S from './WaterSortLobby.styles.js';
import type { WaterSortLobbyProps } from './WaterSortLobby.types.js';

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
	const { t, language } = useI18n('watersort');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(() =>
		getInitialLobbyDifficulty(initialDifficulty),
	);

	useEffect(() => {
		async function init() {
			const saved = await loadActiveGame();
			const prog = await loadProgress();
			if (saved && !saved.isComplete) {
				setActiveGame(saved);
			}
			setProgress(prog);

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const queryDiff = params.get('difficulty') as DifficultyLevel | null;
				if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
					setSelectedDifficulty(queryDiff);
					return;
				}
			}

			if (saved && !saved.isComplete && saved.difficulty) {
				setSelectedDifficulty(saved.difficulty);
			}
		}
		init();
	}, []);

	const handleSelectDifficulty = (diff: DifficultyLevel) => {
		setSelectedDifficulty(diff);
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
					window.location.href = `/watersort/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/watersort/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/watersort/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/watersort/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/watersort/${language}/medals` },
	];

	const presets = getPresetsByDifficulty(selectedDifficulty);

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="watersort"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(val) => handleSelectDifficulty(val as DifficultyLevel)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection aria-labelledby="watersort-puzzles-section-title">
				<h2 id="watersort-puzzles-section-title">
					{t('levels.selectLevel')} ({t(`difficulty.${selectedDifficulty}` as Parameters<typeof t>[0])})
				</h2>

				<QuickPlayCard
					title={t('levels.quickPlay')}
					subtitle={t('levels.quickPlayDesc')}
					actionLabel={t('controls.play')}
					icon={<Icon emoji="🎲" size="md" />}
					as="a"
					href={`/watersort/${language}/game?difficulty=${selectedDifficulty}&new=true`}
				/>

				<S.PuzzlesGrid>
					{presets.map((preset) => {
						const puzzleRecord = progress[`${selectedDifficulty}-${preset.level}`] ?? progress[preset.id];
						const isCompleted = Boolean(puzzleRecord?.completed);

						const subtitle =
							puzzleRecord?.bestTime !== undefined
								? t('levels.bestTime', { time: formatTime(puzzleRecord.bestTime) })
								: undefined;

						return (
							<GameSelectionCard
								key={preset.id}
								as="a"
								href={`/watersort/${language}/game?difficulty=${selectedDifficulty}&seed=${preset.level}&puzzle=${preset.id}&new=true`}
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
			</S.PuzzlesSection>
		</GameLandingTemplate>
	);
}

export function WaterSortLobby({ lang, initialDifficulty }: WaterSortLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent initialDifficulty={initialDifficulty} />
		</I18nProvider>
	);
}
