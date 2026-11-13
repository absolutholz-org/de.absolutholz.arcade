import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { extractRoomCode, generateRoomCode } from '@arcade/lib-multiplayer/roomCode';
import { useUserProfile } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Text } from '@arcade/lib-ui/components/Text';
import { TextField } from '@arcade/lib-ui/components/TextField';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type ChangeEvent, type FormEvent, type JSX, useEffect, useState } from 'react';
import { loadActiveGame } from '../../engine/storage.ts';
import type { TicTacToeState } from '../../engine/types.ts';
import * as S from './TicTacToeLobby.styles.ts';

export interface TicTacToeLobbyProps {
	readonly lang?: SupportedLanguageCode;
}

type LobbyGameMode = 'local' | 'online';

function LobbyContent({ lang }: { readonly lang: SupportedLanguageCode }): JSX.Element {
	const { t } = useI18n('tictactoe');
	const { t: tCommon } = useI18n('common');
	const { profile, name: defaultProfileName } = useUserProfile();

	const [selectedMode, setSelectedMode] = useState<LobbyGameMode>('local');
	const [activeGame, setActiveGame] = useState<TicTacToeState | null>(null);
	const [hasCustomP1Name, setHasCustomP1Name] = useState(false);
	const [player1Name, setPlayer1Name] = useState<string>(() => {
		const displayName = profile?.displayName?.trim() || defaultProfileName;
		return displayName && displayName.length > 0 ? displayName : 'Guest';
	});
	const [player2Name, setPlayer2Name] = useState<string>('Player 2');

	const [roomCode, setRoomCode] = useState<string>('');
	const [isRoomCodeExpanded, setIsRoomCodeExpanded] = useState<boolean>(false);

	useEffect(() => {
		const displayName = profile?.displayName?.trim();
		if (!hasCustomP1Name && displayName && displayName.length > 0) {
			setPlayer1Name(displayName);
		}
	}, [profile?.displayName, hasCustomP1Name]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const urlRoom = params.get('room');
			if (urlRoom && urlRoom.trim().length > 0) {
				const extracted = extractRoomCode(urlRoom);
				window.location.replace(`/tictactoe/${lang}/game?room=${encodeURIComponent(extracted)}`);
				return;
			}
		}

		void loadActiveGame().then((saved) => {
			if (saved && !saved.isComplete) {
				setActiveGame(saved);
			}
		});
	}, [lang]);

	const handleStartGame = (e: FormEvent) => {
		e.preventDefault();
		const fallbackName = profile?.displayName?.trim() || defaultProfileName || 'Guest';
		const finalName = player1Name.trim() || fallbackName;

		if (selectedMode === 'online') {
			const cleanRoomCode = extractRoomCode(roomCode);
			if (cleanRoomCode.length > 0) {
				window.location.href = `/tictactoe/${lang}/game?mode=online&role=guest&room=${encodeURIComponent(cleanRoomCode)}&name=${encodeURIComponent(finalName)}`;
			} else {
				const generatedCode = generateRoomCode();
				window.location.href = `/tictactoe/${lang}/game?mode=online&role=host&room=${encodeURIComponent(generatedCode)}&name=${encodeURIComponent(finalName)}`;
			}
			return;
		}

		const p1 = encodeURIComponent(finalName);
		const p2 = encodeURIComponent(player2Name.trim() || 'Player 2');
		window.location.href = `/tictactoe/${lang}/game?p1=${p1}&p2=${p2}&new=true`;
	};

	const handleRoomCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		if (rawValue.includes('room=') || rawValue.includes('/room/') || rawValue.startsWith('http')) {
			setRoomCode(extractRoomCode(rawValue));
		} else {
			setRoomCode(rawValue);
		}
	};

	const modeOptions: readonly SegmentedControlOption<LobbyGameMode>[] = [
		{
			value: 'local',
			label: t('lobby.passAndPlay'),
		},
		{
			value: 'online',
			label: t('lobby.playOnline'),
		},
	];

	const resumeState = activeGame
		? {
				message: `${activeGame.player1Name} (X) vs ${activeGame.player2Name} (O)`,
				onResume: () => {
					window.location.href = `/tictactoe/${lang}/game?resume=true`;
				},
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/tictactoe/${lang}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/tictactoe/${lang}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/tictactoe/${lang}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/tictactoe/${lang}/medals` },
	];

	const isJoiningRoom = roomCode.trim().length > 0;

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="tictactoe"
		>
			<S.FormContainer aria-labelledby="tictactoe-mode-section-title">
				<Text as="h2" variant="h3" id="tictactoe-mode-section-title">
					{t('lobby.modeSelect')}
				</Text>

				<S.ControlWrapper>
					<SegmentedControl
						options={modeOptions}
						value={selectedMode}
						onChange={setSelectedMode}
						ariaLabel={t('lobby.modeSelect')}
					/>
				</S.ControlWrapper>

				<Stack as="form" direction="column" spacing="lg" onSubmit={handleStartGame}>
					{selectedMode === 'local' ? (
						<Stack direction="column" spacing="md">
							<TextField
								label={t('lobby.player1Label')}
								value={player1Name}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setHasCustomP1Name(true);
									setPlayer1Name(e.target.value);
								}}
								maxLength={24}
								fullWidth
							/>
							<TextField
								label={t('lobby.player2Label')}
								value={player2Name}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayer2Name(e.target.value)}
								maxLength={24}
								fullWidth
							/>
						</Stack>
					) : (
						<Stack direction="column" spacing="md">
							<TextField
								label={t('lobby.yourNameLabel')}
								value={player1Name}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setHasCustomP1Name(true);
									setPlayer1Name(e.target.value);
								}}
								maxLength={24}
								fullWidth
							/>

							{!isRoomCodeExpanded ? (
								<Stack direction="row" justify="start">
									<Button
										variant="ghost"
										size="sm"
										type="button"
										onClick={() => setIsRoomCodeExpanded(true)}
									>
										{t('lobby.joinViaRoomCode')}
									</Button>
								</Stack>
							) : (
								<TextField
									label={t('lobby.roomCodeLabel')}
									placeholder={t('lobby.roomCodePlaceholder')}
									value={roomCode}
									onChange={handleRoomCodeChange}
									maxLength={128}
									fullWidth
								/>
							)}
						</Stack>
					)}

					<Button type="submit" variant="primary" size="lg">
						{selectedMode === 'local'
							? t('lobby.startGame')
							: isJoiningRoom
								? t('lobby.joinSession')
								: t('lobby.hostSession')}
					</Button>
				</Stack>
			</S.FormContainer>
		</GameLandingTemplate>
	);
}

export function TicTacToeLobby({ lang }: TicTacToeLobbyProps): JSX.Element {
	const activeLang: SupportedLanguageCode = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<LobbyContent lang={activeLang} />
		</I18nProvider>
	);
}
