import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import type { CSSProperties, FormEvent, JSX } from 'react';
import { useEffect, useState } from 'react';
import { PUZZLES_BY_DIFFICULTY, getDefaultPuzzle, getPuzzleById } from '../../engine/puzzles';
import { loadActiveGame, loadLastConfig, loadSolvedPuzzles, saveLastConfig } from '../../engine/storage';
import type { DifficultyId, GameSnapshot, NonogramPuzzle, PuzzleRecord } from '../../engine/types';
import { PuzzleIcon } from '../NonogramIcons';
import * as S from './NonogramLobby.styles';

export interface NonogramLobbyProps {
	lang: SupportedLanguageCode;
}

const DIFFICULTIES: DifficultyId[] = ['easy', 'medium', 'hard'];

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('nonogram');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [activeGamePuzzle, setActiveGamePuzzle] = useState<NonogramPuzzle | null>(null);
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('easy');
	const [selectedPuzzleId, setSelectedPuzzleId] = useState<string>(() => getDefaultPuzzle('easy').id);
	const [solvedRecords, setSolvedRecords] = useState<Record<string, PuzzleRecord>>({});

	useEffect(() => {
		async function init() {
			const [game, solved, lastConfig] = await Promise.all([
				loadActiveGame(),
				loadSolvedPuzzles(),
				loadLastConfig(),
			]);

			setSolvedRecords(solved);

			if (game && game.status === 'playing') {
				setActiveGame(game);
				const puz = getPuzzleById(game.puzzleId);
				if (puz) setActiveGamePuzzle(puz);
			}

			if (lastConfig) {
				setSelectedDifficulty(lastConfig.difficulty);
				setSelectedPuzzleId(lastConfig.puzzleId);
			}
		}
		init();
	}, []);

	const handleDifficultyChange = (diff: DifficultyId) => {
		setSelectedDifficulty(diff);
		const defaultForDiff = getDefaultPuzzle(diff).id;
		setSelectedPuzzleId(defaultForDiff);
		saveLastConfig({ difficulty: diff, puzzleId: defaultForDiff });
	};

	const handlePuzzleChange = (puzId: string) => {
		setSelectedPuzzleId(puzId);
		saveLastConfig({ difficulty: selectedDifficulty, puzzleId: puzId });
	};

	const handleStartGame = (e: FormEvent) => {
		e.preventDefault();
		if (typeof window !== 'undefined') {
			window.location.href = `/nonogram/${language}/game?difficulty=${selectedDifficulty}&puzzle=${selectedPuzzleId}&new=true`;
		}
	};

	const availablePuzzles = PUZZLES_BY_DIFFICULTY[selectedDifficulty];

	return (
		<S.LobbyContainer>
			<S.HeroSection>
				<h1>{t('title')}</h1>
				<p>{t('description')}</p>
			</S.HeroSection>

			{activeGame && activeGamePuzzle ? (
				<S.ResumeCard>
					<div className="resume-info">
						<span className="resume-title">{t('controls.resume')}</span>
						<span className="resume-meta">
							{t(activeGamePuzzle.titleKey as TranslationKey)} •{' '}
							{t(`difficulty.${activeGamePuzzle.difficulty}` as TranslationKey)} •{' '}
							{formatTime(activeGame.elapsedSeconds)} ({activeGame.moves} {t('status.moves')})
						</span>
					</div>
					<Button as="a" href={`/nonogram/${language}/game?resume=true`} variant="primary" size="md">
						{t('controls.resume')}
					</Button>
				</S.ResumeCard>
			) : null}

			<S.ConfigForm onSubmit={handleStartGame}>
				{/* Difficulty Selection */}
				<S.Fieldset>
					<legend>{t('difficulty.label')}</legend>
					<S.DifficultyGrid>
						{DIFFICULTIES.map((diff) => {
							const isSelected = selectedDifficulty === diff;
							return (
								<S.DifficultyCard key={diff} className={isSelected ? 'selected' : ''}>
									<input
										type="radio"
										name="nonogram-difficulty"
										value={diff}
										checked={isSelected}
										onChange={() => handleDifficultyChange(diff)}
									/>
									<div className="option-info">
										<span className="option-title">
											{t(`difficulty.${diff}` as TranslationKey)}
										</span>
										<span className="option-desc">
											{t(`difficulty.${diff}Desc` as TranslationKey)}
										</span>
									</div>
									{isSelected && (
										<span className="check-icon">
											<Icon name="check" size="inherit" />
										</span>
									)}
								</S.DifficultyCard>
							);
						})}
					</S.DifficultyGrid>
				</S.Fieldset>

				{/* Puzzle Selection */}
				<S.Fieldset>
					<legend>{t('lobby.selectPuzzle')}</legend>
					<S.PuzzlesGrid>
						{availablePuzzles.map((puz) => {
							const isSelected = selectedPuzzleId === puz.id;
							const record = solvedRecords[puz.id];
							const isSolved = record?.solved;

							const thumbVars: CSSProperties = {
								'--thumb-cols': puz.width,
								'--thumb-rows': puz.height,
								'--thumb-color': puz.color,
							} as CSSProperties;

							return (
								<S.PuzzleSelectionCard key={puz.id} className={isSelected ? 'selected' : ''}>
									<input
										type="radio"
										name="nonogram-puzzle"
										value={puz.id}
										checked={isSelected}
										onChange={() => handlePuzzleChange(puz.id)}
									/>

									<S.MiniThumbnail style={thumbVars} data-unsolved={!isSolved} aria-hidden="true">
										{isSolved ? (
											puz.grid.map((val, idx) => (
												<div key={`thumb-${puz.id}-${idx}`} data-filled={val === 1} />
											))
										) : (
											<PuzzleIcon />
										)}
									</S.MiniThumbnail>

									<span className="card-title">{t(puz.titleKey as TranslationKey)}</span>
									<span className="card-badge">
										{puz.width}×{puz.height}
									</span>

									{isSolved ? (
										<span className="card-solved">
											✓ {t('lobby.completed')} ({formatTime(record.bestTime)})
										</span>
									) : (
										<span className="card-badge">{t('lobby.unsolved')}</span>
									)}

									{isSelected && (
										<span className="check-icon">
											<Icon name="check" size="inherit" />
										</span>
									)}
								</S.PuzzleSelectionCard>
							);
						})}
					</S.PuzzlesGrid>
				</S.Fieldset>

				<S.PlaySection>
					<Button type="submit" variant="primary" size="lg">
						{t('controls.play')}
					</Button>
				</S.PlaySection>
			</S.ConfigForm>

			<S.QuickLinks>
				<a href={`/nonogram/${language}/rules`}>{t('navigation.rules' as TranslationKey)}</a>
			</S.QuickLinks>
		</S.LobbyContainer>
	);
}

export function NonogramLobby({ lang }: NonogramLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
