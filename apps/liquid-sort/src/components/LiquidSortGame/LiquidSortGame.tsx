import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, type ReactNode, useState } from 'react';
import { LIQUID_SORT_SETTINGS_CONFIG } from '../../config/settings.js';
import type { DifficultyLevel } from '../../engine/types.js';
import { LiquidSortBoard } from '../LiquidSortBoard/index.js';
import { LiquidSortControls } from '../LiquidSortControls/index.js';
import { LiquidSortDeadlockDialog } from '../LiquidSortDeadlockDialog/index.js';
import { LiquidSortVictoryDialog } from '../LiquidSortVictoryDialog/index.js';
import { useLiquidSortGame } from './LiquidSortGame.hooks.js';
import * as S from './LiquidSortGame.styles.js';
import type { LiquidSortGameProps } from './LiquidSortGame.types.js';

function GameContent({
	initialDifficulty,
	initialSeed,
	activeLang,
	rulesContent,
}: {
	initialDifficulty?: DifficultyLevel;
	initialSeed?: number;
	activeLang: SupportedLanguageCode;
	rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('liquid-sort');
	const { t: tCommon } = useI18n('common');
	const game = useLiquidSortGame(initialDifficulty, initialSeed);

	const difficultyLabel = t(`difficulty.${game.difficulty}` as 'difficulty.easy');

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/liquid-sort/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenRules={game.onOpenRules}
					rulesLabel={tCommon('navigation.rules')}
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
			toolbar={<LiquidSortControls canUndo={game.canUndo} onUndo={game.onUndo} onReset={game.onReset} />}
		>
			<div className={S.boardArea}>
				<div aria-live="polite" aria-atomic="true" className={S.liveRegion}>
					{game.ariaAnnouncement}
				</div>

				<LiquidSortBoard
					board={game.board}
					selectedIndex={game.selectedTube}
					showPatterns={game.settings.colorblindPatterns}
					fluidAnimations={game.settings.fluidAnimations}
					onSelectTube={game.onSelectTube}
				/>
			</div>

			<PauseDialog
				isOpen={game.isPaused && !game.isWon && !game.settingsOpen && !game.rulesOpen}
				onResume={game.onTogglePause}
				onRestart={game.onReset}
			/>

			{/* In-game Rules Modal */}
			<Dialog
				isOpen={game.rulesOpen}
				onCancel={game.onCloseRules}
				title={tCommon('navigation.rules')}
				showCloseButton={true}
			>
				{rulesContent}
			</Dialog>

			{/* In-game Settings Modal (compact mode) */}
			<GameSettingsDialog isOpen={game.settingsOpen} onClose={game.onCloseSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={LIQUID_SORT_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.onUpdateSettings}
				/>
			</GameSettingsDialog>

			<LiquidSortVictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				moves={game.moves}
				onPlayAgain={game.onPlayAgain}
				onNextPuzzle={game.onNextPuzzle}
				onClose={game.closeVictory}
			/>

			<LiquidSortDeadlockDialog
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

export function LiquidSortGame({
	initialDifficulty,
	initialSeed,
	lang,
	rulesContent,
}: LiquidSortGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/liquid-sort\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<GameContent
				initialDifficulty={initialDifficulty}
				initialSeed={initialSeed}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
