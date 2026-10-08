import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import type { FormEvent, JSX } from 'react';
import { useEffect, useState } from 'react';
import {
	BOARD_SIZE_LIST,
	type BoardSizeId,
	DIFFICULTY_LIST,
	type DifficultyId,
	type GameSnapshot,
	loadActiveGame,
	loadLastConfig,
	saveLastConfig,
} from '../../engine';
import { DifficultyGraphic, SizeGraphic } from '../Graphics';
import * as S from './MinesweeperLobby.styles';

export interface MinesweeperLobbyProps {
	lang: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('minesweeper');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [selectedSize, setSelectedSize] = useState<BoardSizeId>('md');
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('medium');

	useEffect(() => {
		async function init() {
			const game = await loadActiveGame();
			if (game && game.status === 'playing') {
				setActiveGame(game);
			}

			const lastConfig = await loadLastConfig();
			if (lastConfig) {
				setSelectedSize(lastConfig.size);
				setSelectedDifficulty(lastConfig.difficulty);
			}
		}
		init();
	}, []);

	const handleSizeChange = (size: BoardSizeId) => {
		setSelectedSize(size);
		saveLastConfig({ size, difficulty: selectedDifficulty });
	};

	const handleDifficultyChange = (diff: DifficultyId) => {
		setSelectedDifficulty(diff);
		saveLastConfig({ size: selectedSize, difficulty: diff });
	};

	const handleStartGame = (e: FormEvent) => {
		e.preventDefault();
		if (typeof window !== 'undefined') {
			window.location.href = `/minesweeper/${language}/game?size=${selectedSize}&difficulty=${selectedDifficulty}&new=true`;
		}
	};

	return (
		<S.LobbyContainer>
			<S.HeroSection>
				<h1>{t('title')}</h1>
				<p>{t('description')}</p>
			</S.HeroSection>

			{activeGame ? (
				<S.ResumeCard>
					<div className="resume-info">
						<span className="resume-title">{t('controls.resume')}</span>
						<span className="resume-meta">
							{t(`size.${activeGame.size}`)} • {t(`difficulty.${activeGame.difficulty}`)} •{' '}
							{formatTime(activeGame.elapsedSeconds)}
						</span>
					</div>
					<Button as="a" href={`/minesweeper/${language}/game?resume=true`} variant="primary" size="md">
						{t('controls.resume')}
					</Button>
				</S.ResumeCard>
			) : null}

			<S.ConfigForm onSubmit={handleStartGame}>
				<S.Fieldset>
					<legend>{t('size.label')}</legend>
					<S.OptionsGrid>
						{BOARD_SIZE_LIST.map((sizeConfig) => {
							const isSelected = selectedSize === sizeConfig.id;
							return (
								<S.OptionCard key={sizeConfig.id} className={isSelected ? 'selected' : ''}>
									<input
										type="radio"
										name="board-size"
										value={sizeConfig.id}
										checked={isSelected}
										onChange={() => handleSizeChange(sizeConfig.id)}
									/>
									<SizeGraphic size={sizeConfig.id} />
									<div className="option-info">
										<span className="option-title">{t(`size.${sizeConfig.id}`)}</span>
										<span className="option-desc">{t(`size.${sizeConfig.id}Desc`)}</span>
									</div>
									{isSelected && (
										<span className="check-icon">
											<Icon name="check" size="inherit" />
										</span>
									)}
								</S.OptionCard>
							);
						})}
					</S.OptionsGrid>
				</S.Fieldset>

				<S.Fieldset>
					<legend>{t('difficulty.label')}</legend>
					<S.OptionsGrid>
						{DIFFICULTY_LIST.map((diffConfig) => {
							const isSelected = selectedDifficulty === diffConfig.id;
							return (
								<S.OptionCard key={diffConfig.id} className={isSelected ? 'selected' : ''}>
									<input
										type="radio"
										name="board-difficulty"
										value={diffConfig.id}
										checked={isSelected}
										onChange={() => handleDifficultyChange(diffConfig.id)}
									/>
									<DifficultyGraphic difficulty={diffConfig.id} />
									<div className="option-info">
										<span className="option-title">{t(`difficulty.${diffConfig.id}`)}</span>
										<span className="option-desc">{t(`difficulty.${diffConfig.id}Desc`)}</span>
									</div>
									{isSelected && (
										<span className="check-icon">
											<Icon name="check" size="inherit" />
										</span>
									)}
								</S.OptionCard>
							);
						})}
					</S.OptionsGrid>
				</S.Fieldset>

				<S.PlaySection>
					<Button type="submit" variant="primary" size="lg">
						{t('controls.play')}
					</Button>
				</S.PlaySection>
			</S.ConfigForm>

			<S.QuickLinks>
				<a href={`/minesweeper/${language}/high-scores`}>{t('highScores.title')}</a>
				<a href={`/minesweeper/${language}/rules`}>{t('rules.title')}</a>
			</S.QuickLinks>
		</S.LobbyContainer>
	);
}

export function MinesweeperLobby({ lang }: MinesweeperLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
