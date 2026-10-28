import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameLayout } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { useCallback, useState } from 'react';
import type { BoardSizeId, DifficultyId } from '../../engine/types';
import { DefeatDialog } from '../DefeatDialog/DefeatDialog';
import { MinesweeperBoard } from '../MinesweeperBoard/MinesweeperBoard';
import { FlagIcon, MineIcon } from '../MinesweeperIcons';
import { SettingsDialog } from '../SettingsDialog/SettingsDialog';
import { VictoryDialog } from '../VictoryDialog/VictoryDialog';
import { useMinesweeperGame } from './MinesweeperGame.hooks';
import * as S from './MinesweeperGame.styles';

export interface MinesweeperGameProps {
	initialSize?: BoardSizeId;
	initialDifficulty?: DifficultyId;
	lang?: SupportedLanguageCode;
}

export function MinesweeperGame({ initialSize = 'md', initialDifficulty = 'medium', lang }: MinesweeperGameProps) {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/minesweeper\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const { t } = useI18n('minesweeper');
	const game = useMinesweeperGame(initialSize, initialDifficulty);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/minesweeper/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const modeOptions: SegmentedControlOption<'reveal' | 'flag'>[] = [
		{
			value: 'reveal',
			label: t('controls.reveal'),
			icon: <MineIcon />,
			ariaLabel: t('controls.modeReveal'),
		},
		{
			value: 'flag',
			label: t('controls.flag'),
			icon: <FlagIcon />,
			ariaLabel: t('controls.modeFlag'),
		},
	];

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/minesweeper/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t(`difficulty.${game.difficulty}`)}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span className={S.statusMetric} aria-label={`${t('status.minesLeft')}: ${game.minesLeft}`}>
						<MineIcon />
						<span>{game.minesLeft}</span>
					</span>
					<Timer
						variant="inline"
						seconds={game.elapsedSeconds}
						isPaused={game.isPaused}
						onTogglePause={game.handleTogglePause}
						size="sm"
						showIcon={true}
						aria-label={t('status.timer')}
					/>
				</div>
			}
		>
			<div className={S.boardArea}>
				<MinesweeperBoard
					cells={game.cells}
					columns={game.columns}
					rows={game.rows}
					focusedCell={game.focusedCell}
					isGameOver={game.isGameOver}
					isWon={game.isWon}
					onReveal={game.handleReveal}
					onFlag={game.handleFlag}
					onChord={game.handleChord}
					onSetFocus={(col, row) => game.setFocusedCell({ col, row })}
				/>
			</div>

			<S.ControlsContainer>
				{/* Top row: Reveal vs Flag Mode Switcher */}
				<S.ModeRow>
					<SegmentedControl
						size="sm"
						value={game.interactionMode}
						onChange={(val) => {
							if (game.interactionMode !== val) {
								game.handleToggleInteractionMode();
							}
						}}
						options={modeOptions}
						ariaLabel={t('aria.gameControls')}
					/>
				</S.ModeRow>

				{/* Bottom row: Restart Action */}
				<S.ActionsRow>
					<S.ActionButton type="button" onClick={game.handleRestart} aria-label={t('common.restart')}>
						<Icon name="rotate-ccw" size="sm" />
						<span>{t('common.restart')}</span>
					</S.ActionButton>
				</S.ActionsRow>
			</S.ControlsContainer>

			<PauseDialog isOpen={game.isPaused} onResume={game.handleTogglePause} onRestart={game.handleRestart} />

			<SettingsDialog
				isOpen={game.isSettingsOpen}
				onClose={game.closeSettings}
				settings={game.settings}
				onUpdateSettings={game.handleUpdateSettings}
				activeLanguage={activeLang}
				onLanguageChange={handleLanguageChange}
			/>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				size={game.size}
				difficulty={game.difficulty}
				rankPosition={game.rankPosition}
				onPlayAgain={game.handleRestart}
				onClose={() => {}}
			/>

			<DefeatDialog isOpen={game.isDefeatOpen} onPlayAgain={game.handleRestart} onClose={() => {}} />
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
