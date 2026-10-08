import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { Button } from '@arcade/lib-ui/components/Button';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import {
	BOARD_SIZE_LIST,
	type BoardSizeId,
	DIFFICULTY_LIST,
	type DifficultyId,
	type HighScoreEntry,
	loadHighScores,
} from '../../engine';
import * as S from './HighScoresView.styles';

export interface HighScoresViewProps {
	lang: SupportedLanguageCode;
}

function HighScoresContent(): JSX.Element {
	const { t, language } = useI18n('minesweeper');
	const [scores, setScores] = useState<HighScoreEntry[]>([]);
	const [highlightParams, setHighlightParams] = useState<{
		size?: string;
		difficulty?: string;
		highlight?: number;
	}>({});

	useEffect(() => {
		async function fetchScores() {
			const loaded = await loadHighScores();
			setScores(loaded);
		}
		fetchScores();

		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const size = params.get('size') ?? undefined;
			const difficulty = params.get('difficulty') ?? undefined;
			const highlightStr = params.get('highlight');
			const highlight = highlightStr !== null ? Number.parseInt(highlightStr, 10) : undefined;
			setHighlightParams({ size, difficulty, highlight });
		}
	}, []);

	const formatDate = (isoString: string) => {
		try {
			const date = new Date(isoString);
			return date.toLocaleDateString(language, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		} catch {
			return isoString;
		}
	};

	return (
		<S.Container>
			{BOARD_SIZE_LIST.map((sizeConfig) => {
				const sizeScores = scores.filter((s) => s.size === sizeConfig.id);

				return (
					<S.Section key={sizeConfig.id}>
						<h2>{t(`size.${sizeConfig.id}`)}</h2>

						{DIFFICULTY_LIST.map((diffConfig) => {
							const diffScores = sizeScores
								.filter((s) => s.difficulty === diffConfig.id)
								.sort((a, b) => a.seconds - b.seconds);

							return (
								<S.DifficultyBlock key={diffConfig.id}>
									<h3>{t(`difficulty.${diffConfig.id}`)}</h3>

									{diffScores.length === 0 ? (
										<S.NoScores>{t('highScores.noScores')}</S.NoScores>
									) : (
										<S.ScoresList>
											{diffScores.map((score, index) => {
												const isHighlighted =
													highlightParams.size === score.size &&
													highlightParams.difficulty === score.difficulty &&
													highlightParams.highlight === index;

												return (
													<S.ScoreCard
														key={score.id || `${score.timestamp}-${index}`}
														className={isHighlighted ? 'highlighted' : ''}
													>
														{isHighlighted && (
															<span className="highlight-badge">
																{t('highScores.lastGame')}
															</span>
														)}
														<div className="score-details">
															<span className="score-time">
																{formatTime(score.seconds)}
															</span>
															<span className="score-date">
																{formatDate(score.timestamp)}
															</span>
														</div>
													</S.ScoreCard>
												);
											})}
										</S.ScoresList>
									)}
								</S.DifficultyBlock>
							);
						})}
					</S.Section>
				);
			})}

			<S.Actions>
				<Button as="a" href={`/minesweeper/${language}/`} variant="primary" size="md">
					{t('controls.newGame')}
				</Button>
			</S.Actions>
		</S.Container>
	);
}

export function HighScoresView({ lang }: HighScoresViewProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<HighScoresContent />
		</I18nProvider>
	);
}
