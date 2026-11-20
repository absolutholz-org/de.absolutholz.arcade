import { playMedalChime, playRegression, playVictoryFanfare, triggerHaptic } from '@arcade/lib-audio';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import React, { useEffect, useRef } from 'react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Confetti } from '../Confetti';
import { Dialog } from '../Dialog';
import { Divider } from '../Divider';
import { Timer } from '../Timer';
import * as S from './_VictoryDialog.styles';
import type { VictoryDialogProps } from './_VictoryDialog.types';

function formatStatLabel(label?: string, fallback = ''): string {
	if (!label) {
		return fallback;
	}
	// Strip unreplaced template interpolation tags like {{time}} or {{moves}}
	// and trailing colons (e.g., "Time: {{time}}" -> "TIME", "Rotations: {{moves}}" -> "ROTATIONS")
	const cleaned = label
		.replace(/\{\{[^}]+\}\}/g, '')
		.replace(/:\s*$/, '')
		.trim();
	return cleaned || fallback;
}

export function VictoryDialog({
	bestTimeText,
	children,
	elapsedSeconds,
	hasConfetti,
	hasNextPuzzle = false,
	id,
	isNewBestTime = false,
	isOpen,
	lobbyHref,
	lobbyLabel,
	medalsHref,
	medalsLabel,
	message,
	movesCount,
	movesLabel,
	nextPuzzleLabel,
	onClose,
	onLobby,
	onNextPuzzle,
	onPlayAgain,
	playAgainLabel,
	primaryAction = 'nextPuzzle',
	secondaryActions,
	showCloseButton = true,
	stats,
	statsHref,
	statsLabel,
	timeLabel,
	title,
	variant = 'victory',
}: VictoryDialogProps) {
	const { t } = useI18n();

	const shouldShowConfetti = hasConfetti ?? variant === 'victory';
	const resolvedTitle = title || t('app.title');
	const resolvedTimeLabel = formatStatLabel(timeLabel, 'TIME');
	const resolvedMovesLabel = formatStatLabel(movesLabel, 'MOVES');
	const resolvedPlayAgain = playAgainLabel || 'Play Again';
	const resolvedLobby = lobbyLabel || 'Back to Lobby';
	const resolvedNextPuzzle = nextPuzzleLabel || 'Next Puzzle';
	const resolvedStatsLabel = statsLabel || t('navigation.stats');
	const resolvedMedalsLabel = medalsLabel || t('navigation.medals');

	const hasTime = elapsedSeconds !== undefined;
	const hasMoves = movesCount !== undefined;
	const statItemsCount = (hasTime ? 1 : 0) + (hasMoves ? 1 : 0) + (stats?.length ?? 0);
	const columnCount = Math.min(Math.max(statItemsCount, 1), 3);

	const showNextPuzzle = Boolean(hasNextPuzzle && onNextPuzzle);
	const showPlayAgain = Boolean(onPlayAgain);
	const showGameplayActions = showNextPuzzle || showPlayAgain;
	const isNextPuzzlePrimary = showNextPuzzle && (primaryAction !== 'playAgain' || !showPlayAgain);
	const hasFooterLinks = Boolean(statsHref || medalsHref || lobbyHref || onLobby);

	const prevIsOpenRef = useRef(false);
	useEffect(() => {
		if (isOpen && !prevIsOpenRef.current) {
			if (variant === 'victory') {
				playVictoryFanfare();
				triggerHaptic('success');
				if (isNewBestTime) {
					const timer = setTimeout(() => {
						playMedalChime();
					}, 600);
					return () => clearTimeout(timer);
				}
			} else if (variant === 'defeat') {
				playRegression();
				triggerHaptic('warning');
			} else if (variant === 'draw') {
				triggerHaptic('light');
			}
		}
		prevIsOpenRef.current = isOpen;
	}, [isOpen, isNewBestTime, variant]);

	return (
		<>
			{isOpen && shouldShowConfetti && <Confetti />}
			<Dialog
				id={id}
				isOpen={isOpen}
				onCancel={onClose}
				title={resolvedTitle}
				message={message}
				showCloseButton={showCloseButton}
			>
				<S.VictoryContent>
					{children && <S.VisualSlot>{children}</S.VisualSlot>}

					{statItemsCount > 0 && (
						<S.StatsGrid data-columns={columnCount}>
							{hasTime && (
								<S.StatCard>
									<span data-slot="label">{resolvedTimeLabel}</span>
									<Timer seconds={elapsedSeconds} size="lg" showIcon={false} />
								</S.StatCard>
							)}

							{hasMoves && (
								<S.StatCard>
									<span data-slot="label">{resolvedMovesLabel}</span>
									<span data-slot="value">{movesCount}</span>
								</S.StatCard>
							)}

							{stats?.map((stat) => (
								<S.StatCard key={stat.label}>
									<span data-slot="label">{stat.label}</span>
									<span data-slot="value">{stat.value}</span>
								</S.StatCard>
							))}
						</S.StatsGrid>
					)}

					{isNewBestTime && (
						<Badge size="md" variant="solid" tone="accent">
							{bestTimeText || 'New Best Time!'}
						</Badge>
					)}

					<S.Actions>
						{showGameplayActions && (
							<S.SplitActions>
								{isNextPuzzlePrimary ? (
									<>
										{showNextPuzzle && (
											<Button variant="primary" size="md" onClick={onNextPuzzle}>
												{resolvedNextPuzzle}
											</Button>
										)}
										{showPlayAgain && (
											<Button variant="secondary" size="md" onClick={onPlayAgain}>
												{resolvedPlayAgain}
											</Button>
										)}
									</>
								) : (
									<>
										{showPlayAgain && (
											<Button variant="primary" size="md" onClick={onPlayAgain}>
												{resolvedPlayAgain}
											</Button>
										)}
										{showNextPuzzle && (
											<Button variant="secondary" size="md" onClick={onNextPuzzle}>
												{resolvedNextPuzzle}
											</Button>
										)}
									</>
								)}
							</S.SplitActions>
						)}

						{hasFooterLinks && (
							<>
								<Divider />
								<S.FooterLinks>
									{statsHref && (
										<Button as="a" href={statsHref} variant="ghost" size="sm">
											{resolvedStatsLabel}
										</Button>
									)}
									{medalsHref && (
										<Button as="a" href={medalsHref} variant="ghost" size="sm">
											{resolvedMedalsLabel}
										</Button>
									)}
									{lobbyHref ? (
										<Button as="a" href={lobbyHref} variant="ghost" size="sm">
											{resolvedLobby}
										</Button>
									) : onLobby ? (
										<Button variant="ghost" size="sm" onClick={onLobby}>
											{resolvedLobby}
										</Button>
									) : null}
								</S.FooterLinks>
							</>
						)}

						{secondaryActions && <S.SecondaryActions>{secondaryActions}</S.SecondaryActions>}
					</S.Actions>
				</S.VictoryContent>
			</Dialog>
		</>
	);
}

export function DefeatDialog(props: Omit<VictoryDialogProps, 'variant' | 'hasConfetti'>) {
	return <VictoryDialog {...props} variant="defeat" hasConfetti={false} />;
}
