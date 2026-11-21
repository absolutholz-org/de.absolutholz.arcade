import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import {
	getNotificationPermission,
	notifyTurnIfHidden,
	requestTurnNotificationPermission,
} from '@arcade/lib-multiplayer/notifications';
import { extractRoomCode, generateRoomCode } from '@arcade/lib-multiplayer/roomCode';
import type { PlayerRole, RoomParticipant } from '@arcade/lib-multiplayer/types';
import { type CloudActionContext, useCloudRoom } from '@arcade/lib-multiplayer/useCloudRoom';
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
import {
	DEFAULT_TICTACTOE_SETTINGS,
	TICTACTOE_SETTINGS_CONFIG,
	type TicTacToeSettings,
} from '../../config/settings.ts';
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
	context: CloudActionContext,
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

function handleGuestJoinState(prevState: TicTacToeState, guest: RoomParticipant): TicTacToeState {
	return {
		...prevState,
		player2Name: guest.name.trim() || 'Player 2',
	};
}

function isTicTacToeComplete(state: TicTacToeState): boolean {
	return state.isComplete;
}

function GameInner({
	lang,
	rulesContent,
}: {
	readonly lang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t, language } = useI18n('tictactoe');
	const { t: tCommon } = useI18n('common');
	const { isAuthenticated, profile, name: defaultProfileName } = useUserProfile();

	const [sessionParams] = useState(() => resolveSessionParams(defaultProfileName));
	const { isOnlineMode, roomId } = sessionParams;

	// Ensure ?room=<code> is persisted in the URL so refreshing never creates a duplicate room
	useEffect(() => {
		if (!isOnlineMode || !roomId || typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		if (url.searchParams.get('room') !== roomId) {
			url.searchParams.set('room', roomId);
			window.history.replaceState(null, '', url.toString());
		}
	}, [isOnlineMode, roomId]);

	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState<boolean>(
		() => sessionParams.isOnlineMode && sessionParams.role === 'guest' && !sessionParams.hasExplicitName,
	);
	const [guestNameInput, setGuestNameInput] = useState<string>(() =>
		isAuthenticated && profile?.displayName ? profile.displayName.trim() : '',
	);
	const [hasEditedGuestName, setHasEditedGuestName] = useState<boolean>(false);
	const [confirmedGuestName, setConfirmedGuestName] = useState<string>(() => sessionParams.localPlayerName);
	const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() =>
		getNotificationPermission(),
	);

	useEffect(() => {
		const profileName = profile?.displayName?.trim();
		if (isAuthenticated && !hasEditedGuestName && profileName && profileName.length > 0) {
			setGuestNameInput(profileName);
		}
	}, [isAuthenticated, profile?.displayName, hasEditedGuestName]);

	const [localState, setLocalState] = useState<TicTacToeState>(() =>
		createInitialState('X', sessionParams.player1Name, sessionParams.player2Name),
	);

	const cloudRoom = useCloudRoom<TicTacToeState, TicTacToeAction>({
		roomId,
		gameId: 'tictactoe',
		playerName: sessionParams.role === 'host' ? sessionParams.player1Name : confirmedGuestName,
		initialGameState: localState,
		reducer: reduceOnlineAction,
		isCompleteCheck: isTicTacToeComplete,
		onGuestJoin: handleGuestJoinState,
		roleHint: sessionParams.role,
		canJoin: sessionParams.role === 'host' || !isJoinDialogOpen,
		enabled: isOnlineMode,
	});

	const role: PlayerRole = isOnlineMode ? (cloudRoom.myRole ?? sessionParams.role) : 'host';

	const activeState: TicTacToeState = isOnlineMode ? (cloudRoom.room?.gameState ?? localState) : localState;

	const [focusedIndex, setFocusedIndex] = useState<number>(4);
	const [settings, setSettings] = useState<TicTacToeSettings>(DEFAULT_TICTACTOE_SETTINGS);

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
	const isRoomActive = !isOnlineMode || cloudRoom.status === 'active';
	const isMyTurn = isOnlineMode ? cloudRoom.isMyTurn : !activeState.isComplete && activeState.currentTurn === myMark;
	const isOpponentJoined = isOnlineMode ? Boolean(cloudRoom.room?.guest) : true;

	// Notify the player when it becomes their turn while the tab is hidden
	const prevIsMyTurnRef = useRef<boolean>(false);
	useEffect(() => {
		if (!isOnlineMode) return;
		if (isMyTurn && !prevIsMyTurnRef.current) {
			return notifyTurnIfHidden({
				title: t('title'),
				body: t('online.yourTurn', { mark: myMark }),
				tabTitlePrefix: t('lobby.yourTurnBadge'),
			});
		}
		prevIsMyTurnRef.current = isMyTurn;
		return undefined;
	}, [isOnlineMode, isMyTurn, myMark, t]);

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
				if (!isMyTurn || !isRoomActive) {
					return;
				}
				const moveAction: TicTacToeAction = {
					type: 'MAKE_MOVE',
					payload: { index, senderMark: myMark },
				};
				void cloudRoom.dispatchAction(moveAction);
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
			cloudRoom,
			isMyTurn,
			isOnlineMode,
			isRoomActive,
			localState,
			myMark,
			settings.confirmTurnPass,
			t,
		],
	);

	// Play Again / Start New Round (host-only in online mode, alternates starting turn)
	const handlePlayAgain = useCallback(() => {
		if (isOnlineMode && role !== 'host') {
			return;
		}

		setIsCompletionOpen(false);
		setIsTurnDialogOpen(false);
		startTimeRef.current = Date.now();
		setFocusedIndex(4);

		if (isOnlineMode) {
			const nextState = reduce(activeState, { type: 'RESET_GAME' });
			const nextStarterRole: PlayerRole = nextState.startingMark === 'X' ? 'host' : 'guest';
			void cloudRoom.acceptRematch(nextState, nextStarterRole);
			return;
		}

		setLocalState((prev) => reduce(prev, { type: 'RESTART' }));
	}, [activeState, cloudRoom, isOnlineMode, role]);

	// Back to Menu
	const handleBackToMenu = useCallback(() => {
		setIsTurnDialogOpen(false);
		if (!isOnlineMode) {
			void clearActiveGame();
		}
		window.location.href = `/tictactoe/${lang}/`;
	}, [isOnlineMode, lang]);

	const handleLeaveRoom = useCallback(async () => {
		await cloudRoom.leaveRoom();
		window.location.href = `/tictactoe/${lang}/`;
	}, [cloudRoom, lang]);

	const closedByName = useMemo(() => {
		const closedBy = cloudRoom.room?.closedBy;
		if (!closedBy || !cloudRoom.room) return opponentName;
		if (closedBy === cloudRoom.room.host.uid) return cloudRoom.room.host.name;
		if (closedBy === cloudRoom.room.guest?.uid) return cloudRoom.room.guest.name;
		return opponentName;
	}, [cloudRoom.room, opponentName]);

	const statusText = useMemo(() => {
		if (isOnlineMode) {
			if (cloudRoom.status === 'error') {
				return cloudRoom.error ?? t('online.roomNotFound');
			}
			if (cloudRoom.status === 'abandoned') {
				return t('online.roomClosedBy', { name: closedByName });
			}
			if (cloudRoom.status === 'not-found') {
				return t('online.roomNotFound');
			}
			if (cloudRoom.status === 'room-full') {
				return t('online.roomFull');
			}
			if (cloudRoom.status === 'initializing' || cloudRoom.status === 'idle') {
				return t('online.connecting');
			}
			if (cloudRoom.status === 'waiting' || !isOpponentJoined) {
				return t('online.waitingForOpponent');
			}
		}

		if (activeState.isComplete) {
			if (isOnlineMode && cloudRoom.room?.rematchRequestedBy) {
				return cloudRoom.room.rematchRequestedBy === cloudRoom.myUid
					? t('online.rematchWaitingForOpponent', { name: opponentName })
					: t('online.rematchRequestedByOpponent', { name: opponentName });
			}
			if (activeState.winner === 'draw') {
				return t('game.draw');
			}
			if (isOnlineMode) {
				return didIWin ? t('victory.youWinTitle') : t('victory.youLoseTitle');
			}
			return t('game.winner', { name: `${winnerName} (${activeState.winner})` });
		}

		if (isOnlineMode) {
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
		closedByName,
		cloudRoom.error,
		cloudRoom.myUid,
		cloudRoom.room?.rematchRequestedBy,
		cloudRoom.status,
		didIWin,
		isMyTurn,
		isOnlineMode,
		isOpponentJoined,
		myMark,
		opponentName,
		t,
		winnerName,
	]);

	const isPlayerWinner = activeState.isComplete && (activeState.winner === 'X' || activeState.winner === 'O');
	const isLocalVictory = !isOnlineMode && isPlayerWinner;
	const isOnlineVictory = isOnlineMode && isPlayerWinner && didIWin;
	const isOnlineDefeat = isOnlineMode && isPlayerWinner && !didIWin;
	const isDrawMatch = activeState.isComplete && activeState.winner === 'draw';
	const statusState =
		isOnlineMode && cloudRoom.status === 'abandoned'
			? 'danger'
			: activeState.isComplete
				? activeState.winner === 'draw'
					? 'warning'
					: isOnlineDefeat
						? 'danger'
						: 'solved'
				: 'default';

	const isBoardDisabled = activeState.isComplete || (isOnlineMode && (!isMyTurn || !isRoomActive));
	const isOnlineWaiting = isOnlineMode && isRoomActive && !activeState.isComplete && !isMyTurn;
	const rematchRequester = cloudRoom.room?.rematchRequestedBy;
	const isRematchRequestedByOpponent = Boolean(
		isOnlineMode && activeState.isComplete && rematchRequester && rematchRequester !== cloudRoom.myUid,
	);
	const isRematchWaitingForOpponent = Boolean(
		isOnlineMode && activeState.isComplete && rematchRequester && rematchRequester === cloudRoom.myUid,
	);

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tictactoe/${lang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={isOnlineMode ? t('online.roomCode', { code: roomId.toUpperCase() }) : t('title')}
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
					{isOnlineMode && cloudRoom.status === 'error' && (
						<Banner
							variant="danger"
							statusLabel="ERROR"
							message={cloudRoom.error ?? t('online.roomNotFound')}
						/>
					)}

					{isOnlineMode && cloudRoom.status === 'not-found' && (
						<Banner variant="danger" statusLabel="ERROR" message={t('online.roomNotFound')} />
					)}

					{isOnlineMode && cloudRoom.status === 'room-full' && (
						<Banner variant="danger" statusLabel="ERROR" message={t('online.roomFull')} />
					)}

					{isOnlineMode && cloudRoom.status === 'abandoned' && (
						<Banner
							variant="danger"
							statusLabel={t('lobby.closedBadge')}
							message={t('online.roomClosedBy', { name: closedByName })}
							action={
								<Button variant="outline" size="sm" type="button" onClick={handleBackToMenu}>
									{t('controls.backToLobby')}
								</Button>
							}
						/>
					)}

					{isOnlineMode && cloudRoom.status === 'waiting' && (
						<Banner
							variant="info"
							statusLabel={t('online.waitingForOpponent')}
							message={t('online.waitingBannerMessage', { code: roomId.toUpperCase() })}
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

					{isRematchRequestedByOpponent && (
						<Banner
							variant="info"
							statusLabel={t('victory.playAgain')}
							message={t('online.rematchRequestedByOpponent', { name: opponentName })}
							action={
								<Button variant="primary" size="sm" type="button" onClick={handlePlayAgain}>
									{t('online.acceptRematch')}
								</Button>
							}
						/>
					)}

					{isRematchWaitingForOpponent && (
						<Banner
							variant="info"
							statusLabel={t('victory.playAgain')}
							message={t('online.rematchWaitingForOpponent', { name: opponentName })}
						/>
					)}

					<Stack direction="column" spacing="xs" align="center">
						<Stack direction="row" spacing="sm" align="center" justify="center" wrap>
							<Badge
								variant={
									!activeState.isComplete && activeState.currentTurn === 'X' ? 'subtle' : 'outline'
								}
								tone={!activeState.isComplete && activeState.currentTurn === 'X' ? 'accent' : 'neutral'}
								size="md"
							>
								{activeState.player1Name} (X) · {activeState.player1Wins ?? 0}
							</Badge>
							<Text as="span" variant="small">
								vs
							</Text>
							<Badge
								variant={
									!activeState.isComplete && activeState.currentTurn === 'O' ? 'subtle' : 'outline'
								}
								tone={!activeState.isComplete && activeState.currentTurn === 'O' ? 'accent' : 'neutral'}
								size="md"
							>
								{activeState.player2Name} (O) · {activeState.player2Wins ?? 0}
							</Badge>

							{isOnlineMode && notifPermission === 'default' && (
								<Button
									variant="ghost"
									size="sm"
									type="button"
									onClick={() => {
										void requestTurnNotificationPermission().then((perm) =>
											setNotifPermission(perm),
										);
									}}
								>
									{t('online.enableNotifications')}
								</Button>
							)}

							{isOnlineMode &&
								cloudRoom.status !== 'abandoned' &&
								cloudRoom.status !== 'not-found' &&
								cloudRoom.status !== 'room-full' && (
									<Button
										variant="ghost"
										size="sm"
										type="button"
										onClick={() => void handleLeaveRoom()}
									>
										{t('online.leaveRoom')}
									</Button>
								)}
						</Stack>

						<GameStatusStrip statusText={statusText} statusState={statusState} hideTimer />
					</Stack>
				</Stack>
			}
			toolbar={
				<GameControlStrip
					onRestart={handlePlayAgain}
					canRestart={
						isOnlineMode
							? role === 'host' && activeState.isComplete
							: activeState.moveCount > 0 || activeState.isComplete
					}
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
				showLastMove={settings.showLastMove}
				lastMoveIndex={activeState.lastMoveIndex ?? null}
				lastMoveBadgeLabel={t('game.lastMoveBadge')}
				lastMoveAriaLabel={t('game.lastMoveLabel')}
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

			{/* Standard TurnDialog for online waiting state or local pass-and-play handoff */}
			<TurnDialog
				isOpen={isOnlineWaiting || (!isOnlineMode && isTurnDialogOpen)}
				isWaiting={isOnlineWaiting}
				playerName={activePlayerName}
				playerMark={activeState.currentTurn}
				title={t('game.turnDialog.title', { name: activePlayerName, mark: activeState.currentTurn })}
				message={
					isOnlineWaiting
						? t('game.turnDialog.waiting', { name: activePlayerName, mark: activeState.currentTurn })
						: t('game.turnDialog.passDevice', { name: activePlayerName })
				}
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
				onPlayAgain={!isOnlineMode || role === 'host' ? handlePlayAgain : undefined}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/tictactoe/${language}/stats`}
				medalsHref={`/tictactoe/${language}/medals`}
				onLobby={handleBackToMenu}
				lobbyLabel={t('victory.backToMenu')}
			>
				{isOnlineMode && role === 'guest' && (
					<Text as="p" variant="small">
						{t('online.waitingForHostNewGame', { name: activeState.player1Name })}
					</Text>
				)}
			</VictoryDialog>

			{/* Dedicated DefeatDialog when losing an online match */}
			<DefeatDialog
				isOpen={isCompletionOpen && isOnlineDefeat}
				onClose={() => setIsCompletionOpen(false)}
				title={t('victory.youLoseTitle')}
				message={t('victory.youLoseMessage', { name: winnerName, mark: activeState.winner })}
				elapsedSeconds={completedPlayTime}
				movesCount={activeState.moveCount}
				onPlayAgain={!isOnlineMode || role === 'host' ? handlePlayAgain : undefined}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/tictactoe/${language}/stats`}
				medalsHref={`/tictactoe/${language}/medals`}
				onLobby={handleBackToMenu}
				lobbyLabel={t('victory.backToMenu')}
			>
				{isOnlineMode && role === 'guest' && (
					<Text as="p" variant="small">
						{t('online.waitingForHostNewGame', { name: activeState.player1Name })}
					</Text>
				)}
			</DefeatDialog>

			{/* Standard Dialog when the match ends in a draw */}
			<Dialog
				isOpen={isCompletionOpen && isDrawMatch}
				title={t('victory.drawTitle')}
				message={t('victory.drawDescription')}
				confirmText={!isOnlineMode || role === 'host' ? t('victory.playAgain') : undefined}
				cancelText={t('victory.backToMenu')}
				onConfirm={!isOnlineMode || role === 'host' ? handlePlayAgain : undefined}
				onCancel={handleBackToMenu}
			>
				{isOnlineMode && role === 'guest' && (
					<Text as="p" variant="small">
						{t('online.waitingForHostNewGame', { name: activeState.player1Name })}
					</Text>
				)}
			</Dialog>

			{isOnlineMode && (
				<ShareDialog
					id="tictactoe-share-room-dialog"
					isOpen={isShareOpen}
					onClose={() => setIsShareOpen(false)}
					title={tCommon('share.shareRoom')}
					shareUrl={inviteUrl}
					shareText={t('online.waitingBannerMessage', { code: roomId.toUpperCase() })}
					roomCode={roomId.toUpperCase()}
					copySuccessMessage={t('online.inviteLinkCopied')}
				/>
			)}

			{isOnlineMode && role === 'guest' && (
				<Dialog
					id="tictactoe-join-room-dialog"
					isOpen={isJoinDialogOpen}
					title={t('lobby.joinSession')}
					message={t('online.roomCode', { code: roomId.toUpperCase() })}
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
