import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { GameContainer } from '@arcade/lib-ui/components/GameContainer';
import type { JSX } from 'react';
import type { DifficultyLevel } from '../../engine/types.js';
import { WaterSortBoard } from '../WaterSortBoard/index.js';
import { WaterSortControls } from '../WaterSortControls/index.js';
import { WaterSortDeadlockDialog } from '../WaterSortDeadlockDialog/index.js';
import { WaterSortHeader } from '../WaterSortHeader/index.js';
import { WaterSortPauseOverlay } from '../WaterSortPauseOverlay/index.js';
import { WaterSortSettingsDialog } from '../WaterSortSettingsDialog/index.js';
import { WaterSortVictoryDialog } from '../WaterSortVictoryDialog/index.js';
import { useWaterSortGame } from './WaterSortGame.hooks.js';
import * as S from './WaterSortGame.styles.js';
import type { WaterSortGameProps } from './WaterSortGame.types.js';

function GameContent({
	initialDifficulty,
	initialSeed,
}: { initialDifficulty?: DifficultyLevel; initialSeed?: number }): JSX.Element {
	const game = useWaterSortGame(initialDifficulty, initialSeed);

	return (
		<GameContainer
			id="watersort-game-container"
			header={
				<WaterSortHeader
					difficulty={game.difficulty}
					seed={game.seed}
					elapsedSeconds={game.elapsedSeconds}
					moves={game.moves}
					completedTubes={game.completedTubes}
					totalColorTubes={game.totalColorTubes}
					isPaused={game.isPaused}
					onTogglePause={game.onTogglePause}
					onOpenSettings={game.onOpenSettings}
				/>
			}
			overlay={
				game.isPaused ? (
					<WaterSortPauseOverlay
						isOpen={game.isPaused}
						onResume={game.onTogglePause}
						onRestart={game.onReset}
					/>
				) : undefined
			}
			dialogs={
				<>
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
				</>
			}
		>
			<div className={S.stageContainer}>
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

				<WaterSortControls
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onUndo={game.onUndo}
					onRedo={game.onRedo}
					onReset={game.onReset}
					onHint={game.onHint}
				/>
			</div>
		</GameContainer>
	);
}

export function WaterSortGame({ initialDifficulty, initialSeed, lang = 'en' }: WaterSortGameProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<GameContent initialDifficulty={initialDifficulty} initialSeed={initialSeed} />
		</I18nProvider>
	);
}
