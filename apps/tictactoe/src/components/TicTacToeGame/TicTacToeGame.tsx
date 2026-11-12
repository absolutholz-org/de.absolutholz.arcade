import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import { useUserProfile } from '@arcade/lib-ui';
import { Badge } from '@arcade/lib-ui/components/Badge';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { GameControlStrip } from '@arcade/lib-ui/components/GameControlStrip';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Text } from '@arcade/lib-ui/components/Text';
import { TurnDialog } from '@arcade/lib-ui/components/TurnDialog';
import { VictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TICTACTOE_MEDAL_DEFINITIONS } from '../../config/medals.ts';
import { TICTACTOE_SETTINGS_CONFIG, type TicTacToeSettings } from '../../config/settings.ts';
import { createInitialState, reduce } from '../../engine/reducer.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordTicTacToeRoundResult,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.ts';
import type { TicTacToeState } from '../../engine/types.ts';
import { TicTacToeBoard } from '../TicTacToeBoard/TicTacToeBoard.tsx';

export interface TicTacToeGameProps {
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function resolveQueryPlayers(defaultP1Name: string): {
	readonly player1Name: string;
	readonly player2Name: string;
	readonly hasExplicitP1: boolean;
} {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const p1 = params.get('p1');
		const p2 = params.get('p2');
		const hasExplicitP1 = Boolean(p1 && p1.trim().length > 0);
		return {
			player1Name: hasExplicitP1 && p1 ? p1.trim() : defaultP1Name,
			player2Name: p2 && p2.trim().length > 0 ? p2.trim() : 'Player 2',
			hasExplicitP1,
		};
	}
	return { player1Name: defaultP1Name, player2Name: 'Player 2', hasExplicitP1: false };
}

function GameInner({
	lang,
	rulesContent,
}: {
	readonly lang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('tictactoe');
	const { t: tCommon } = useI18n('common');
	const { profile } = useUserProfile();

	const defaultProfileName = profile?.displayName?.trim() || 'Guest';
	const [initialPlayers] = useState(() => resolveQueryPlayers(defaultProfileName));
	const [state, setState] = useState<TicTacToeState>(() =>
		createInitialState('X', initialPlayers.player1Name, initialPlayers.player2Name),
	);

	const [focusedIndex, setFocusedIndex] = useState<number>(4);
	const [settings, setSettings] = useState<TicTacToeSettings>({
		highlightWinningLine: true,
		showCellCoordinates: false,
		confirmTurnPass: true,
	});

	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isCompletionOpen, setIsCompletionOpen] = useState(false);
	const [isTurnDialogOpen, setIsTurnDialogOpen] = useState(false);
	const [srAnnouncement, setSrAnnouncement] = useState<string>('');
	const [completedPlayTime, setCompletedPlayTime] = useState<number>(0);

	const startTimeRef = useRef<number>(Date.now());

	// Sync Player 1 name with profile when no explicit query param was provided
	useEffect(() => {
		const profileName = profile?.displayName?.trim();
		if (!initialPlayers.hasExplicitP1 && profileName && profileName.length > 0) {
			setState((prev) => {
				if (prev.moveCount === 0 && prev.player1Name !== profileName) {
					return { ...prev, player1Name: profileName };
				}
				return prev;
			});
		}
	}, [profile?.displayName, initialPlayers.hasExplicitP1]);

	// Load settings and resume active game if requested
	useEffect(() => {
		void loadSettings().then((persistedSettings) => {
			setSettings(persistedSettings);
		});

		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			if (params.get('resume') === 'true' && params.get('new') !== 'true') {
				void loadActiveGame().then((active) => {
					if (active && !active.isComplete) {
						setState(active);
					}
				});
			}
		}
	}, []);

	const activePlayerName = useMemo(() => {
		return state.currentTurn === 'X' ? state.player1Name : state.player2Name;
	}, [state.currentTurn, state.player1Name, state.player2Name]);

	const winnerName = useMemo(() => {
		if (state.winner === 'X') return state.player1Name;
		if (state.winner === 'O') return state.player2Name;
		return null;
	}, [state.winner, state.player1Name, state.player2Name]);

	const handleCellClick = useCallback(
		(index: number) => {
			if (state.isComplete || state.board[index] !== null) {
				return;
			}

			const nextState = reduce(state, {
				type: 'MAKE_MOVE',
				payload: { index, senderMark: state.currentTurn },
			});

			setState(nextState);

			if (nextState.isComplete) {
				const playTime = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
				setCompletedPlayTime(playTime);
				const won = nextState.winner !== null && nextState.winner !== 'draw';

				if (won) {
					const winnerLabel = nextState.winner === 'X' ? nextState.player1Name : nextState.player2Name;
					setSrAnnouncement(t('victory.winnerWins', { name: winnerLabel }));
				} else {
					setSrAnnouncement(t('victory.drawTitle'));
				}

				setIsCompletionOpen(true);
				void clearActiveGame();

				void recordTicTacToeRoundResult({
					won,
					playTimeSeconds: playTime,
					moves: nextState.moveCount,
				});

				void recordGameResult(
					{
						gameId: 'tictactoe',
						won,
						playTimeSeconds: playTime,
						levelKey: 'standard',
						roundContext: {
							moves: nextState.moveCount,
							isFlawless: won && nextState.moveCount <= 5,
						},
					},
					{ definitions: TICTACTOE_MEDAL_DEFINITIONS },
				);
			} else {
				void saveActiveGame(nextState);
				const nextName = nextState.currentTurn === 'X' ? nextState.player1Name : nextState.player2Name;
				setSrAnnouncement(t('game.turn', { name: nextName, mark: nextState.currentTurn }));
				if (settings.confirmTurnPass) {
					setIsTurnDialogOpen(true);
				}
			}
		},
		[settings.confirmTurnPass, state, t],
	);

	// Play Again / Restart Round (alternates starting turn)
	const handlePlayAgain = useCallback(() => {
		setIsCompletionOpen(false);
		setIsTurnDialogOpen(false);
		startTimeRef.current = Date.now();
		setState((prev) => reduce(prev, { type: 'RESTART' }));
		setFocusedIndex(4);
	}, []);

	// Back to Menu
	const handleBackToMenu = useCallback(() => {
		setIsTurnDialogOpen(false);
		void clearActiveGame();
		window.location.href = `/tictactoe/${lang}/`;
	}, [lang]);

	const statusText = state.isComplete
		? state.winner === 'draw'
			? t('game.draw')
			: t('game.winner', { name: winnerName })
		: t('game.turn', { name: activePlayerName, mark: state.currentTurn });

	const statusState = state.isComplete ? (state.winner === 'draw' ? 'warning' : 'solved') : 'default';
	const isPlayerWinner = state.isComplete && (state.winner === 'X' || state.winner === 'O');
	const isDrawMatch = state.isComplete && state.winner === 'draw';

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tictactoe/${lang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t('title')}
					onOpenRules={() => setIsRulesOpen(true)}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={() => setIsSettingsOpen(true)}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<GameStatusStrip statusText={statusText} statusState={statusState} hideTimer>
					<Stack direction="row" spacing="md" align="center" justify="center" inline fullWidth={false}>
						<Badge
							variant={!state.isComplete && state.currentTurn === 'X' ? 'accent' : 'outline'}
							size="md"
						>
							{state.player1Name} (X)
						</Badge>
						<Text as="span" variant="small">
							vs
						</Text>
						<Badge
							variant={!state.isComplete && state.currentTurn === 'O' ? 'accent' : 'outline'}
							size="md"
						>
							{state.player2Name} (O)
						</Badge>
					</Stack>
				</GameStatusStrip>
			}
			toolbar={
				<GameControlStrip
					onRestart={handlePlayAgain}
					canRestart={state.moveCount > 0 || state.isComplete}
					onNewGame={handleBackToMenu}
					canNewGame={true}
					newGameLabel={t('controls.backToLobby')}
					hasActiveProgress={state.moveCount > 0}
					isComplete={state.isComplete}
				/>
			}
		>
			<VisuallyHidden>
				<output aria-live="polite">{srAnnouncement}</output>
			</VisuallyHidden>

			<TicTacToeBoard
				board={state.board}
				winningLine={state.winningLine}
				focusedIndex={focusedIndex}
				disabled={state.isComplete}
				highlightWinningLine={settings.highlightWinningLine}
				showCoordinates={settings.showCellCoordinates}
				boardLabel={t('game.boardLabel')}
				onCellClick={handleCellClick}
				onFocusChange={setFocusedIndex}
			/>

			<GameRulesDialog isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} gameTitle={t('title')}>
				<GameSettingsPanel
					config={TICTACTOE_SETTINGS_CONFIG}
					lang={lang}
					mode="compact"
					onSettingsChange={(newSettings) => {
						setSettings(newSettings as TicTacToeSettings);
						void saveSettings(newSettings as TicTacToeSettings);
					}}
				/>
			</GameSettingsDialog>

			{/* Standard TurnDialog prompting player pass-and-play handoff */}
			<TurnDialog
				isOpen={isTurnDialogOpen}
				playerName={activePlayerName}
				playerMark={state.currentTurn}
				title={t('game.turnDialog.title', { name: activePlayerName, mark: state.currentTurn })}
				message={t('game.turnDialog.passDevice', { name: activePlayerName })}
				confirmText={t('game.turnDialog.ok')}
				onConfirm={() => setIsTurnDialogOpen(false)}
			/>

			{/* Standard VictoryDialog when a player wins */}
			<VictoryDialog
				isOpen={isCompletionOpen && isPlayerWinner}
				onClose={() => setIsCompletionOpen(false)}
				title={t('game.winner', { name: winnerName })}
				message={t('victory.winnerWins', { name: winnerName })}
				elapsedSeconds={completedPlayTime}
				movesCount={state.moveCount}
				onPlayAgain={handlePlayAgain}
				playAgainLabel={t('victory.playAgain')}
				onLobby={handleBackToMenu}
				lobbyLabel={t('victory.backToMenu')}
			/>

			{/* Standard Dialog when the match ends in a draw */}
			<Dialog
				isOpen={isCompletionOpen && isDrawMatch}
				title={t('victory.drawTitle')}
				message={t('victory.drawDescription')}
				confirmText={t('victory.playAgain')}
				cancelText={t('victory.backToMenu')}
				onConfirm={handlePlayAgain}
				onCancel={handleBackToMenu}
			/>
		</GameLayout>
	);
}

export function TicTacToeGame(props: TicTacToeGameProps): JSX.Element {
	const activeLang: SupportedLanguageCode =
		props.lang && isSupportedLanguage(props.lang) ? props.lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<GameInner lang={activeLang} rulesContent={props.rulesContent} />
		</I18nProvider>
	);
}
