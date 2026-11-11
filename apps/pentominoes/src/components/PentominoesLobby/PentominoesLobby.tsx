import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { QuickPlayCard } from '@arcade/lib-ui/components/QuickPlayCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';
import { type JSX, useEffect, useState } from 'react';
import { CURATED_LEVELS, getLevelsByDifficulty } from '../../engine/generator.ts';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage.ts';
import { DIFFICULTIES, type Difficulty, type LevelDefinition, type PentominoesSaveState } from '../../engine/types.ts';

const PuzzlesSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	margin-top: 1.5rem;

	> h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin: 0;
	}
`;

const PuzzlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	gap: 1rem;
`;

export interface PentominoesLobbyProps {
	readonly lang?: SupportedLanguageCode;
}

type LevelTranslationKey =
	| 'rect-3x5'
	| 'rect-4x5'
	| 'rect-5x5'
	| 'rect-5x6'
	| 'rect-5x7'
	| 'rect-5x8'
	| 'rect-5x9'
	| 'rect-5x10'
	| 'rect-5x11'
	| 'rect-5x12'
	| 'rect-6x10'
	| 'rect-8x8-ring'
	| 'rect-8x8-notched'
	| 'silhouette-cross'
	| 'silhouette-staircase'
	| 'silhouette-archway';

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('pentominoes');
	const { t: tCommon } = useI18n('common');

	const [activeGame, setActiveGame] = useState<PentominoesSaveState | null>(null);
	const [completedLevelIds, setCompletedLevelIds] = useState<Set<string>>(new Set());
	const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

	useEffect(() => {
		async function hydrateLobby() {
			const [savedGame, progress, lastConfig] = await Promise.all([
				loadActiveGame(),
				loadProgress(),
				loadLastConfig(),
			]);

			if (savedGame) {
				setActiveGame(savedGame);
			}
			if (progress) {
				setCompletedLevelIds(new Set(progress.completedLevelIds));
			}

			let hasUrlDiff = false;
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const queryDiff = params.get('difficulty') as Difficulty | null;
				if (queryDiff && (DIFFICULTIES as readonly string[]).includes(queryDiff)) {
					setSelectedDifficulty(queryDiff);
					hasUrlDiff = true;
				}
			}

			if (!hasUrlDiff) {
				if (savedGame?.difficulty && (DIFFICULTIES as readonly string[]).includes(savedGame.difficulty)) {
					setSelectedDifficulty(savedGame.difficulty);
				} else if (
					lastConfig?.difficulty &&
					(DIFFICULTIES as readonly string[]).includes(lastConfig.difficulty)
				) {
					setSelectedDifficulty(lastConfig.difficulty);
				}
			}
		}
		void hydrateLobby();
	}, []);

	const handleSelectDifficulty = (diff: Difficulty) => {
		setSelectedDifficulty(diff);
		void saveLastConfig({ difficulty: diff });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', diff);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const difficultyLevels = getLevelsByDifficulty(selectedDifficulty);
	const defaultQuickLevel: LevelDefinition =
		difficultyLevels.find((lvl) => !completedLevelIds.has(lvl.id)) ?? difficultyLevels[0] ?? CURATED_LEVELS[0];

	const getLevelCopy = (levelId: string): { readonly title: string; readonly description: string } => {
		const safeKey = (
			levelId in
			{
				'rect-3x5': true,
				'rect-4x5': true,
				'rect-5x5': true,
				'rect-5x6': true,
				'rect-5x7': true,
				'rect-5x8': true,
				'rect-5x9': true,
				'rect-5x10': true,
				'rect-5x11': true,
				'rect-5x12': true,
				'rect-6x10': true,
				'rect-8x8-ring': true,
				'rect-8x8-notched': true,
				'silhouette-cross': true,
				'silhouette-staircase': true,
				'silhouette-archway': true,
			}
				? levelId
				: 'rect-3x5'
		) as LevelTranslationKey;

		return {
			title: t(`levels.${safeKey}.title`),
			description: t(`levels.${safeKey}.description`),
		};
	};

	const resumeState = activeGame
		? {
				message: `${getLevelCopy(activeGame.levelId).title} • ${activeGame.placements.length} / ${activeGame.pieceIds.length} ${t('status.placed')}`,
				onResume: () => {
					window.location.href = `/pentominoes/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/pentominoes/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/pentominoes/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/pentominoes/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/pentominoes/${language}/medals` },
	];

	const difficultyItems: SegmentedControlItem[] = DIFFICULTIES.map((diff: Difficulty) => ({
		id: diff,
		label: t(`difficulty.${diff}` as const),
	}));

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="pentominoes"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => handleSelectDifficulty(diff as Difficulty)}
				ariaLabel={t('difficulty.label')}
			/>

			<PuzzlesSection aria-labelledby="pentominoes-puzzles-section-title">
				<h2 id="pentominoes-puzzles-section-title">
					{t('lobby.selectLevel')} ({t(`difficulty.${selectedDifficulty}`)})
				</h2>

				<PuzzlesGrid>
					<QuickPlayCard
						as="a"
						href={`/pentominoes/${language}/game?level=${defaultQuickLevel.id}&difficulty=${defaultQuickLevel.difficulty}&new=true`}
						onClick={() => {
							void saveLastConfig({
								difficulty: defaultQuickLevel.difficulty,
								levelId: defaultQuickLevel.id,
							});
						}}
						title={`${t('lobby.quickPlay')} — ${getLevelCopy(defaultQuickLevel.id).title}`}
						subtitle={getLevelCopy(defaultQuickLevel.id).description}
					/>

					{difficultyLevels.map((lvl) => {
						const copy = getLevelCopy(lvl.id);
						const isDone = completedLevelIds.has(lvl.id);

						return (
							<GameSelectionCard
								key={lvl.id}
								as="a"
								href={`/pentominoes/${language}/game?level=${lvl.id}&difficulty=${lvl.difficulty}&new=true`}
								onClick={() => {
									void saveLastConfig({
										difficulty: lvl.difficulty,
										levelId: lvl.id,
									});
								}}
								title={copy.title}
								subtitle={copy.description}
								badge={
									isDone
										? {
												label: t('lobby.completed'),
												variant: 'success',
											}
										: undefined
								}
							/>
						);
					})}
				</PuzzlesGrid>
			</PuzzlesSection>
		</GameLandingTemplate>
	);
}

export function PentominoesLobby({ lang }: PentominoesLobbyProps): JSX.Element {
	const activeLang: SupportedLanguageCode = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<LobbyContent />
		</I18nProvider>
	);
}
