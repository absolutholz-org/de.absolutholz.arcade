import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
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
import { loadActiveGame, loadProgress } from '../../engine/storage.ts';
import type { Difficulty, GameSnapshot } from '../../engine/types.ts';
import * as S from './NetLobby.styles.ts';

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export interface NetLobbyProps {
	lang?: SupportedLanguageCode;
}

function isDifficulty(value: string | null): value is Difficulty {
	return value !== null && (DIFFICULTIES as readonly string[]).includes(value);
}

function getInitialLobbyDifficulty(): Difficulty {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const diff = params.get('difficulty');
		if (isDifficulty(diff)) {
			return diff;
		}
	}
	return 'easy';
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('net');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [solvedByDifficulty, setSolvedByDifficulty] = useState<Record<Difficulty, number>>({
		easy: 0,
		medium: 0,
		hard: 0,
		expert: 0,
	});
	const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(getInitialLobbyDifficulty);

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress] = await Promise.all([loadActiveGame(), loadProgress()]);

			if (savedGame && !savedGame.isSolved) {
				setActiveGame(savedGame);
			}

			if (savedProgress && typeof savedProgress === 'object') {
				setSolvedByDifficulty({
					easy: savedProgress.easy?.completedCount ?? 0,
					medium: savedProgress.medium?.completedCount ?? 0,
					hard: savedProgress.hard?.completedCount ?? 0,
					expert: savedProgress.expert?.completedCount ?? 0,
				});
			}

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const diff = params.get('difficulty');
				if (isDifficulty(diff)) {
					setSelectedDifficulty(diff);
					return;
				}
			}

			if (savedGame && !savedGame.isSolved) {
				setSelectedDifficulty(savedGame.difficulty);
			}
		}
		void init();
	}, []);

	const handleSelectDifficulty = (diff: Difficulty) => {
		setSelectedDifficulty(diff);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', diff);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const getDifficultyDescription = (diff: Difficulty): string => {
		switch (diff) {
			case 'easy':
				return t('difficulty.easyDesc');
			case 'medium':
				return t('difficulty.mediumDesc');
			case 'hard':
				return t('difficulty.hardDesc');
			case 'expert':
				return t('difficulty.expertDesc');
		}
	};

	const resumeState =
		activeGame && !activeGame.isSolved
			? {
					message: `${t(`difficulty.${activeGame.difficulty}`)} • ${formatTime(activeGame.elapsedTimeSeconds)} • ${t(
						'status.moves',
						{
							moves: activeGame.movesCount,
						},
					)}`,
					onResume: () => {
						window.location.href = `/net/${language}/game?resume=true`;
					},
					buttonLabel: t('controls.resume'),
				}
			: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/net/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/net/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/net/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/net/${language}/medals` },
	];

	const difficultyItems: SegmentedControlItem[] = DIFFICULTIES.map((diff) => ({
		id: diff,
		label: t(`difficulty.${diff}`),
		sublabel: getDifficultyDescription(diff),
	}));

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="net"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => handleSelectDifficulty(diff as Difficulty)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection aria-labelledby="net-puzzles-section-title">
				<h2 id="net-puzzles-section-title">
					{t('lobby.selectDifficulty')} ({t(`difficulty.${selectedDifficulty}`)})
				</h2>

				<S.PuzzlesGrid>
					<QuickPlayCard
						key="quick-play"
						as="a"
						href={`/net/${language}/game?difficulty=${selectedDifficulty}&new=true`}
						title={t('lobby.quickPlay')}
						subtitle={getDifficultyDescription(selectedDifficulty)}
						icon={<Icon emoji="🌐" size="md" />}
					/>

					{DIFFICULTIES.map((diff) => {
						const solvedCount = solvedByDifficulty[diff] ?? 0;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/net/${language}/game?difficulty=${diff}&new=true`}
								title={t(`difficulty.${diff}`)}
								dimensions={getDifficultyDescription(diff)}
								subtitle={solvedCount > 0 ? `${t('status.solved')}: ${solvedCount}` : undefined}
								badge={
									solvedCount > 0
										? {
												label: `${t('status.solved')} (${solvedCount})`,
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

export function NetLobby({ lang }: NetLobbyProps = {}): JSX.Element {
	if (lang) {
		return (
			<I18nProvider language={lang}>
				<LobbyContent />
			</I18nProvider>
		);
	}
	return <LobbyContent />;
}
