import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import { extractRoomCode, generateRoomCode } from '@arcade/lib-multiplayer/roomCode';
import type { PlayerRole, RoomUser } from '@arcade/lib-multiplayer/types';
import { useGuestSession } from '@arcade/lib-multiplayer/useGuestSession';
import { type HostActionContext, useHostSession } from '@arcade/lib-multiplayer/useHostSession';
import { useUserProfile } from '@arcade/lib-ui';
import { Badge } from '@arcade/lib-ui/components/Badge';
import { Banner } from '@arcade/lib-ui/components/Banner';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { GameControlStrip } from '@arcade/lib-ui/components/GameControlStrip';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { ShareDialog } from '@arcade/lib-ui/components/ShareDialog';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Text } from '@arcade/lib-ui/components/Text';
import { TextField } from '@arcade/lib-ui/components/TextField';
import { TurnDialog } from '@arcade/lib-ui/components/TurnDialog';
import { DefeatDialog, VictoryDialog } from '@arcade/lib-ui/components/VictoryDialog';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import {
	type ChangeEvent,
	type FormEvent,
	type JSX,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
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
import type { PlayerMark, TicTacToeAction, TicTacToeState } from '../../engine/types.ts';
import { TicTacToeBoard } from '../TicTacToeBoard/TicTacToeBoard.tsx';

export interface TicTacToeGameProps {
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

interface ResolvedSessionParams {
	readonly isOnlineMode: boolean;
	readonly role: PlayerRole;
	readonly roomId: string;
	readonly player1Name: string;
	readonly player2Name: string;
	readonly localPlayerName: string;
	readonly hasExplicitP1: boolean;
	readonly hasExplicitName: boolean;
}

function resolveSessionParams(defaultP1Name: string): ResolvedSessionParams {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const rawRoom = params.get('room');
		const isOnlineMode = params.get('mode') === 'online' || Boolean(rawRoom && rawRoom.trim().length > 0);
		const role: PlayerRole = params.get('role') === 'host' ? 'host' : 'guest';
		const roomId = rawRoom ? extractRoomCode(rawRoom) : isOnlineMode ? generateRoomCode() : '';
		const explicitName = params.get('name')?.trim();
		const hasExplicitName = Boolean(explicitName && explicitName.length > 0);
		const p1 = params.get('p1');
		const p2 = params.get('p2');
		const hasExplicitP1 = Boolean((p1 && p1.trim().length > 0) || hasExplicitName);
		const localPlayerName = hasExplicitName && explicitName ? explicitName : defaultP1Name;

		if (isOnlineMode) {
			return {
				isOnlineMode: true,
				role,
				roomId,
				player1Name: role === 'host' ? localPlayerName : 'Host',
				player2Name: role === 'guest' ? localPlayerName : 'Player 2',
				localPlayerName,
				hasExplicitP1,
				hasExplicitName,
			};
		}

		return {
			isOnlineMode: false,
			role: 'host',
			roomId: '',
			player1Name: hasExplicitP1 && p1 ? p1.trim() : defaultP1Name,
			player2Name: p2 && p2.trim().length > 0 ? p2.trim() : 'Player 2',
			localPlayerName,
			hasExplicitP1,
			hasExplicitName: false,
		};
	}

	return {
		isOnlineMode: false,
		role: 'host',
		roomId: '',
		player1Name: defaultP1Name,
		player2Name: 'Player 2',
		localPlayerName: defaultP1Name,
		hasExplicitP1: false,
		hasExplicitName: false,
	};
}

function reduceOnlineAction(
	prevState: TicTacToeState,
	action: TicTacToeAction,
	context: HostActionContext,
): TicTacToeState {
	if (action.type === 'MAKE_MOVE') {
		return reduce(prevState, {
			type: 'MAKE_MOVE',
			payload: {
				index: action.payload.index,
				senderMark: context.senderMark,
			},
		});
	}
	return reduce(prevState, action);
}

function handleGuestJoinState(prevState: TicTacToeState, guest: RoomUser): TicTacToeState {
	return {
		...prevState,
		player2Name: guest.name.trim() || 'Player 2',
	};
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
	const { isAuthenticated, profile, name: defaultProfileName } = useUserProfile();

	const [sessionParams] = useState(() => resolveSessionParams(defaultProfileName));
	const { isOnlineMode, role, roomId } = sessionParams;

	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState<boolean>(
		() => sessionParams.isOnlineMode && sessionParams.role === 'guest' && !sessionParams.hasExplicitName,
	);
	const [guestNameInput, setGuestNameInput] = useState<string>(() =>
		isAuthenticated && profile?.displayName ? profile.displayName.trim() : '',
	);
	const [hasEditedGuestName, setHasEditedGuestName] = useState<boolean>(false);
	const [confirmedGuestName, setConfirmedGuestName] = useState<string>(() => sessionParams.localPlayerName);

	useEffect(() => {
		const profileName = profile?.displayName?.trim();
		if (isAuthenticated && !hasEditedGuestName && profileName && profileName.length > 0) {
			setGuestNameInput(profileName);
		}
	}, [isAuthenticated, profile?.displayName, hasEditedGuestName]);

	const [localState, setLocalState] = useState<TicTacToeState>(() =>
		createInitialState('X', sessionParams.player1Name, sessionParams.player2Name),
	);

	const hostSession = useHostSession<TicTacToeState, TicTacToeAction>({
		roomId,
		hostName: sessionParams.player1Name,
		initialGameState: localState,
		reducer: reduceOnlineAction,
		onGuestJoin: handleGuestJoinState,
		enabled: isOnlineMode && role === 'host',
	});

	const guestSession = useGuestSession<TicTacToeState, TicTacToeAction>({
		roomId,
		guestName: confirmedGuestName,
		initialGameState: localState,
		enabled: isOnlineMode && role === 'guest' && !isJoinDialogOpen,
	});

	const activeState: TicTacToeState = isOnlineMode
		? role === 'host'
			? hostSession.roomState.gameState
			: guestSession.roomState.gameState
		: localState;

	const [focusedIndex, setFocusedIndex] = useState<number>(4);
	const [settings, setSettings] = useState<TicTacToeSettings>({
		highlightWinningLine: true,
		showCellCoordinates: false,
		confirmTurnPass: true,
	});

	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isCompletionOpen, setIsCompletionOpen] = useState(false);
	const [isTurnDialogOpen, setIsTurnDialogOpen] = useState(false);
	const [srAnnouncement, setSrAnnouncement] = useState<string>('');
	const [completedPlayTime, setCompletedPlayTime] = useState<number>(0);

	const startTimeRef = useRef<number>(Date.now());
	const prevOnlineCompleteRef = useRef<boolean>(false);

	// Sync Player 1 name with profile when no explicit query param was provided
	useEffect(() => {
		const profileName = profile?.displayName?.trim();
		if (!sessionParams.hasExplicitP1 && profileName && profileName.length > 0) {
			if (!isOnlineMode) {
				setLocalState((prev) => {
					if (prev.moveCount === 0 && prev.player1Name !== profileName) {
						return { ...prev, player1Name: profileName };
					}
					return prev;
				});
			}
		}
	}, [profile?.displayName, sessionParams.hasExplicitP1, isOnlineMode]);

	// Load settings and resume active game if requested (local mode only)
	useEffect(() => {
		void loadSettings().then((persistedSettings) => {
			setSettings(persistedSettings);
		});

		if (!isOnlineMode && typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			if (params.get('resume') === 'true' && params.get('new') !== 'true') {
				void loadActiveGame().then((active) => {
					if (active && !active.isComplete) {
						setLocalState(active);
					}
				});
			}
		}
	}, [isOnlineMode]);

	// Observe online state completion transitions for both Host and Guest
	useEffect(() => {
		if (!isOnlineMode) return;

		if (activeState.isComplete && !prevOnlineCompleteRef.current) {
			prevOnlineCompleteRef.current = true;
			const playTime = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
			setCompletedPlayTime(playTime);

			const myMark: PlayerMark = role === 'host' ? 'X' : 'O';
			const didIWin = activeState.winner === myMark;
			const isAnyWin = activeState.winner === 'X' || activeState.winner === 'O';

			if (isAnyWin) {
				const winnerLabel = activeState.winner === 'X' ? activeState.player1Name : activeState.player2Name;
				setSrAnnouncement(
					didIWin
						? t('victory.youWinTitle')
						: t('victory.youLoseMessage', { name: winnerLabel, mark: activeState.winner }),
				);
			} else {
				setSrAnnouncement(t('victory.drawTitle'));
			}

			setIsCompletionOpen(true);

			void recordTicTacToeRoundResult({
				won: didIWin,
				playTimeSeconds: playTime,
				moves: activeState.moveCount,
			});

			void recordGameResult(
				{
					gameId: 'tictactoe',
					won: didIWin,
					playTimeSeconds: playTime,
					levelKey: 'standard',
					roundContext: {
						moves: activeState.moveCount,
						isFlawless: didIWin && activeState.moveCount <= 5,
					},
				},
				{ definitions: TICTACTOE_MEDAL_DEFINITIONS },
			);
		} else if (!activeState.isComplete && prevOnlineCompleteRef.current) {
			prevOnlineCompleteRef.current = false;
			setIsCompletionOpen(false);
			startTimeRef.current = Date.now();
		}
	}, [isOnlineMode, activeState, role, t]);

	const activePlayerName = useMemo(() => {
		return activeState.currentTurn === 'X' ? activeState.player1Name : activeState.player2Name;
	}, [activeState.currentTurn, activeState.player1Name, activeState.player2Name]);

	const winnerName = useMemo(() => {
		if (activeState.winner === 'X') return activeState.player1Name;
		if (activeState.winner === 'O') return activeState.player2Name;
		return null;
	}, [activeState.winner, activeState.player1Name, activeState.player2Name]);

	const myMark: PlayerMark = role === 'host' ? 'X' : 'O';
	const opponentMark: PlayerMark = myMark === 'X' ? 'O' : 'X';
	const opponentName = myMark === 'X' ? activeState.player2Name : activeState.player1Name;
	const didIWin = activeState.winner === myMark;
	const isMyTurn = !activeState.isComplete && activeState.currentTurn === myMark;
	const isOpponentConnected = isOnlineMode
		? role === 'host'
			? hostSession.isOpponentConnected
			: guestSession.isConnected
		: true;

	const inviteUrl =
		typeof window !== 'undefined' && roomId
			? `${window.location.origin}/tictactoe/${lang}/game?room=${roomId}`
			: '';

	const handleConfirmGuestJoin = useCallback(() => {
		const fallbackName =
			(isAuthenticated && profile?.displayName?.trim()) || defaultProfileName || t('lobby.player2Default');
		const resolvedName = guestNameInput.trim() || fallbackName;
		setConfirmedGuestName(resolvedName);
		setIsJoinDialogOpen(false);
	}, [defaultProfileName, guestNameInput, isAuthenticated, profile?.displayName, t]);

	const handleCellClick = useCallback(
		(index: number) => {
			if (activeState.isComplete || activeState.board[index] !== null) {
				return;
			}

			if (isOnlineMode) {
				if (!isMyTurn || !isOpponentConnected) {
					return;
				}
				const moveAction: TicTacToeAction = {
					type: 'MAKE_MOVE',
					payload: { index, senderMark: myMark },
				};
				if (role === 'host') {
					hostSession.dispatch(moveAction);
				} else {
					guestSession.sendAction(moveAction);
				}
				return;
			}

			const nextState = reduce(localState, {
				type: 'MAKE_MOVE',
				payload: { index, senderMark: localState.currentTurn },
			});

			setLocalState(nextState);

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
		[
			activeState.board,
			activeState.isComplete,
			guestSession,
			hostSession,
			isMyTurn,
			isOnlineMode,
			isOpponentConnected,
			localState,
			myMark,
			role,
			settings.confirmTurnPass,
			t,
		],
	);

	// Play Again / Restart Round (alternates starting turn)
	const handlePlayAgain = useCallback(() => {
		setIsCompletionOpen(false);
		setIsTurnDialogOpen(false);
		startTimeRef.current = Date.now();
		setFocusedIndex(4);

		if (isOnlineMode) {
			if (role === 'host') {
				hostSession.dispatch({ type: 'RESET_GAME' });
			} else {
				guestSession.sendAction({ type: 'RESET_GAME' });
			}
			return;
		}

		setLocalState((prev) => reduce(prev, { type: 'RESTART' }));
	}, [guestSession, hostSession, isOnlineMode, role]);

	// Back to Menu
	const handleBackToMenu = useCallback(() => {
		setIsTurnDialogOpen(false);
		if (!isOnlineMode) {
			void clearActiveGame();
		}
		window.location.href = `/tictactoe/${lang}/`;
	}, [isOnlineMode, lang]);

	const statusText = useMemo(() => {
		if (activeState.isComplete) {
			if (activeState.winner === 'draw') {
				return t('game.draw');
			}
			if (isOnlineMode) {
				return didIWin ? t('victory.youWinTitle') : t('victory.youLoseTitle');
			}
			return t('game.winner', { name: `${winnerName} (${activeState.winner})` });
		}
		if (isOnlineMode) {
			if (!isOpponentConnected) {
				if (role === 'host' && hostSession.status === 'waiting') {
					return t('online.waitingForOpponent');
				}
				if (
					(role === 'host' && hostSession.status === 'disconnected') ||
					(role === 'guest' && guestSession.status === 'disconnected')
				) {
					return t('online.disconnected');
				}
				return t('online.connecting');
			}
			return isMyTurn
				? t('online.yourTurn', { mark: myMark })
				: t('online.opponentTurn', { name: activePlayerName, mark: activeState.currentTurn });
		}
		return t('game.turn', { name: activePlayerName, mark: activeState.currentTurn });
	}, [
		activePlayerName,
		activeState.currentTurn,
		activeState.isComplete,
		activeState.winner,
		didIWin,
		guestSession.status,
		hostSession.status,
		isMyTurn,
		isOnlineMode,
		isOpponentConnected,
		myMark,
		role,
		t,
		winnerName,
	]);

	const isPlayerWinner = activeState.isComplete && (activeState.winner === 'X' || activeState.winner === 'O');
	const isLocalVictory = !isOnlineMode && isPlayerWinner;
	const isOnlineVictory = isOnlineMode && isPlayerWinner && didIWin;
	const isOnlineDefeat = isOnlineMode && isPlayerWinner && !didIWin;
	const isDrawMatch = activeState.isComplete && activeState.winner === 'draw';
	const statusState = activeState.isComplete
		? activeState.winner === 'draw'
			? 'warning'
			: isOnlineDefeat
				? 'danger'
				: 'solved'
		: 'default';

	const isBoardDisabled = activeState.isComplete || (isOnlineMode && (!isMyTurn || !isOpponentConnected));

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tictactoe/${lang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={isOnlineMode ? t('online.roomCode', { code: roomId }) : t('title')}
					onOpenRules={() => setIsRulesOpen(true)}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={() => setIsSettingsOpen(true)}
					settingsLabel={t('settings.title')}
					actions={
						isOnlineMode ? (
							<Button
								type="button"
								variant="ghost"
								size="md"
								isIconOnly
								onClick={() => setIsShareOpen(true)}
								aria-label={tCommon('share.shareRoom')}
								title={tCommon('share.shareRoom')}
								leadingIcon={<Icon name="share" size="sm" />}
							/>
						) : undefined
					}
				/>
			}
			status={
				<Stack direction="column" spacing="sm">
					{isOnlineMode && role === 'host' && hostSession.error === 'unavailable-id' && (
						<Banner variant="danger" statusLabel="ERROR" message={t('online.unavailableIdError')} />
					)}

					{isOnlineMode && role === 'host' && !hostSession.isOpponentConnected && !hostSession.error && (
						<Banner
							variant="info"
							statusLabel={t('online.waitingForOpponent')}
							message={t('online.waitingBannerMessage', { code: roomId })}
							action={
								<Button
									variant="outline"
									size="sm"
									type="button"
									leadingIcon={<Icon name="share" size="xs" />}
									onClick={() => setIsShareOpen(true)}
								>
									{tCommon('share.shareRoom')}
								</Button>
							}
						/>
					)}

					<GameStatusStrip statusText={statusText} statusState={statusState} hideTimer>
						<Stack direction="row" spacing="md" align="center" justify="center" inline fullWidth={false}>
							<Badge
								variant={
									!activeState.isComplete && activeState.currentTurn === 'X' ? 'accent' : 'outline'
								}
								size="md"
							>
								{activeState.player1Name} (X)
							</Badge>
							<Text as="span" variant="small">
								vs
							</Text>
							<Badge
								variant={
									!activeState.isComplete && activeState.currentTurn === 'O' ? 'accent' : 'outline'
								}
								size="md"
							>
								{activeState.player2Name} (O)
							</Badge>

							{isOnlineMode && (
								<Badge variant={isOpponentConnected ? 'success' : 'neutral'} size="sm">
									{isOpponentConnected
										? t('online.connected')
										: role === 'host' && hostSession.status === 'waiting'
											? t('online.waitingForOpponent')
											: t('online.disconnected')}
								</Badge>
							)}

							{isOnlineMode && role === 'guest' && guestSession.status === 'disconnected' && (
								<Button variant="outline" size="sm" type="button" onClick={guestSession.reconnect}>
									{t('online.reconnect')}
								</Button>
							)}
						</Stack>
					</GameStatusStrip>
				</Stack>
			}
			toolbar={
				<GameControlStrip
					onRestart={handlePlayAgain}
					canRestart={activeState.moveCount > 0 || activeState.isComplete}
					onNewGame={handleBackToMenu}
					canNewGame={true}
					newGameLabel={t('controls.backToLobby')}
					hasActiveProgress={activeState.moveCount > 0}
					isComplete={activeState.isComplete}
				/>
			}
		>
			<VisuallyHidden>
				<output aria-live="polite">{srAnnouncement}</output>
			</VisuallyHidden>

			<TicTacToeBoard
				board={activeState.board}
				winningLine={activeState.winningLine}
				focusedIndex={focusedIndex}
				disabled={isBoardDisabled}
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

			{/* Standard TurnDialog prompting player pass-and-play handoff (local mode only) */}
			<TurnDialog
				isOpen={!isOnlineMode && isTurnDialogOpen}
				playerName={activePlayerName}
				playerMark={activeState.currentTurn}
				title={t('game.turnDialog.title', { name: activePlayerName, mark: activeState.currentTurn })}
				message={t('game.turnDialog.passDevice', { name: activePlayerName })}
				confirmText={t('game.turnDialog.ok')}
				onConfirm={() => setIsTurnDialogOpen(false)}
			/>

			{/* Standard VictoryDialog when a player wins */}
			<VictoryDialog
				isOpen={isCompletionOpen && (isLocalVictory || isOnlineVictory)}
				onClose={() => setIsCompletionOpen(false)}
				title={
					isOnlineMode
						? t('victory.youWinTitle')
						: t('game.winner', { name: `${winnerName} (${activeState.winner})` })
				}
				message={
					isOnlineMode
						? t('victory.youWinMessage', { name: opponentName, mark: opponentMark })
						: t('victory.winnerWins', { name: winnerName })
				}
				elapsedSeconds={completedPlayTime}
				movesCount={activeState.moveCount}
				onPlayAgain={handlePlayAgain}
				playAgainLabel={t('victory.playAgain')}
				onLobby={handleBackToMenu}
				lobbyLabel={t('victory.backToMenu')}
			/>

			{/* Dedicated DefeatDialog when losing an online match */}
			<DefeatDialog
				isOpen={isCompletionOpen && isOnlineDefeat}
				onClose={() => setIsCompletionOpen(false)}
				title={t('victory.youLoseTitle')}
				message={t('victory.youLoseMessage', { name: winnerName, mark: activeState.winner })}
				elapsedSeconds={completedPlayTime}
				movesCount={activeState.moveCount}
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

			{isOnlineMode && (
				<ShareDialog
					id="tictactoe-share-room-dialog"
					isOpen={isShareOpen}
					onClose={() => setIsShareOpen(false)}
					title={tCommon('share.shareRoom')}
					shareUrl={inviteUrl}
					shareText={t('online.waitingBannerMessage', { code: roomId })}
					roomCode={roomId}
					copySuccessMessage={t('online.inviteLinkCopied')}
				/>
			)}

			{isOnlineMode && role === 'guest' && (
				<Dialog
					id="tictactoe-join-room-dialog"
					isOpen={isJoinDialogOpen}
					title={t('lobby.joinSession')}
					message={t('online.roomCode', { code: roomId })}
					confirmText={t('lobby.joinSession')}
					cancelText={t('controls.backToLobby')}
					onConfirm={handleConfirmGuestJoin}
					onCancel={handleBackToMenu}
				>
					<form
						onSubmit={(e: FormEvent) => {
							e.preventDefault();
							handleConfirmGuestJoin();
						}}
					>
						<TextField
							label={t('lobby.yourNameLabel')}
							placeholder={defaultProfileName || t('lobby.player2Default')}
							value={guestNameInput}
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								setHasEditedGuestName(true);
								setGuestNameInput(e.target.value);
							}}
							maxLength={24}
							autoFocus
							fullWidth
						/>
					</form>
				</Dialog>
			)}
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
