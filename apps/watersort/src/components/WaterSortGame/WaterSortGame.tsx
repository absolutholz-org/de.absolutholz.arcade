import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameHeader, GameLayout, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useCallback, useState } from 'react';
import type { DifficultyLevel } from '../../engine/types.js';
import { WaterSortBoard } from '../WaterSortBoard/index.js';
import { WaterSortControls } from '../WaterSortControls/index.js';
import { WaterSortDeadlockDialog } from '../WaterSortDeadlockDialog/index.js';
import { WaterSortSettingsDialog } from '../WaterSortSettingsDialog/index.js';
import { WaterSortVictoryDialog } from '../WaterSortVictoryDialog/index.js';
import { useWaterSortGame } from './WaterSortGame.hooks.js';
import * as S from './WaterSortGame.styles.js';
import type { WaterSortGameProps } from './WaterSortGame.types.js';

function GameContent({
	initialDifficulty,
	initialSeed,
	activeLang,
}: { initialDifficulty?: DifficultyLevel; initialSeed?: number; activeLang: SupportedLanguageCode }): JSX.Element {
	const { t } = useI18n('watersort');
	const game = useWaterSortGame(initialDifficulty, initialSeed);

	const difficultyLabel = t(`difficulty.${game.difficulty}` as 'difficulty.easy');

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/watersort/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenSettings={game.onOpenSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span className={S.statusMetric} aria-label={t('status.moves', { count: game.moves })}>
						<span>{t('status.moves', { count: game.moves })}</span>
					</span>
					<Timer
						variant="inline"
						seconds={game.elapsedSeconds}
						isPaused={game.isPaused}
						onTogglePause={game.onTogglePause}
						size="sm"
						showIcon={true}
						aria-label={t('status.timer')}
					/>
				</div>
			}
			toolbar={<WaterSortControls canUndo={game.canUndo} onUndo={game.onUndo} onReset={game.onReset} />}
		>
			<div className={S.boardArea}>
				<div aria-live="polite" aria-atomic="true" className={S.liveRegion}>
					{game.ariaAnnouncement}
				</div>

				<WaterSortBoard
					board={game.board}
					selectedIndex={game.selectedTube}
					showPatterns={game.settings.colorblindPatterns}
					fluidAnimations={game.settings.fluidAnimations}
					onSelectTube={game.onSelectTube}
				/>
			</div>

			<PauseDialog isOpen={game.isPaused && !game.isWon} onResume={game.onTogglePause} onRestart={game.onReset} />

			<WaterSortSettingsDialog
				isOpen={game.settingsOpen}
				settings={game.settings}
				onClose={game.onCloseSettings}
				onUpdateSettings={game.onUpdateSettings}
			/>

			<WaterSortVictoryDialog
				isOpen={game.isWon}
				elapsedSeconds={game.elapsedSeconds}
				moves={game.moves}
				onPlayAgain={game.onPlayAgain}
				onNextPuzzle={game.onNextPuzzle}
			/>

			<WaterSortDeadlockDialog
				isOpen={game.isDeadlocked}
				canUndo={game.canUndo}
				difficulty={game.difficulty}
				onUndo={game.onUndo}
				onRestart={game.onReset}
				onNextPuzzle={game.onNextPuzzle}
			/>
		</GameLayout>
	);
}

export function WaterSortGame({ initialDifficulty, initialSeed, lang }: WaterSortGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/watersort\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<GameContent initialDifficulty={initialDifficulty} initialSeed={initialSeed} activeLang={activeLang} />
		</I18nProvider>
	);
}
