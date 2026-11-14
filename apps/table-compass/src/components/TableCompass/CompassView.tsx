import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './TableCompass.styles';
import type { Direction, Seat } from './TableCompass.types';
import { PLAYER_CONFIGS } from './constants';

interface CompassViewProps {
	seats: Seat[];
	activeSeatIndex: number;
	direction: Direction;
	turnCount: number;
	onNextTurn: (template?: (turn: number, name: string, shape: string) => string) => void;
	onPreviousTurn: () => void;
	onReverseDirection: (cwMessage?: string, ccwMessage?: string) => void;
}

function getShortestRotation(currentAngle: number, targetAngle: number): number {
	const diff = ((targetAngle - (currentAngle % 360) + 540) % 360) - 180;
	return currentAngle + diff;
}

export function CompassView({
	seats,
	activeSeatIndex,
	direction,
	turnCount,
	onNextTurn,
	onPreviousTurn,
	onReverseDirection,
}: CompassViewProps) {
	const { t } = useI18n();
	const activeSeat = seats[activeSeatIndex] || seats[0];
	const activeConfig = PLAYER_CONFIGS[activeSeat?.playerConfigIndex ?? 0];

	// Target rotation for needle
	const targetAngle = (activeSeat?.angleDeg ?? 0) + 90;
	const needleAngleRef = useRef<number>(targetAngle);
	const [needleRotation, setNeedleRotation] = useState<number>(targetAngle);

	useEffect(() => {
		const newAngle = getShortestRotation(needleAngleRef.current, targetAngle);
		needleAngleRef.current = newAngle;
		setNeedleRotation(newAngle);
	}, [targetAngle]);

	const handleNext = useCallback(() => {
		onNextTurn((turn, name, shape) => t('tools.tableCompass.compass.turnAnnouncement', { turn, name, shape }));
	}, [onNextTurn, t]);

	const handleReverse = useCallback(() => {
		onReverseDirection(
			t('tools.tableCompass.compass.directionSwitchedToCw'),
			t('tools.tableCompass.compass.directionSwitchedToCcw'),
		);
	}, [onReverseDirection, t]);

	return (
		<Stack spacing="md">
			{/* Integrated Ring Dial (Compact circular board, max 21rem) */}
			<section className={S.CompassBoard} aria-label={t('tools.tableCompass.compass.title')}>
				{/* Rim Track & Inner Direction Chevrons SVG */}
				<svg viewBox="0 0 200 200" className={S.DialRingSvg} aria-hidden="true">
					{/* Outer Seat Rim Track */}
					<circle cx="100" cy="100" r="78" fill="none" stroke="var(--color-container-2)" strokeWidth="2" />
					{/* Inner Direction Ring */}
					<circle
						cx="100"
						cy="100"
						r="54"
						fill="none"
						stroke="var(--color-container-2)"
						strokeWidth="1.5"
						strokeDasharray="4 6"
					/>
					{[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
						<g key={deg} transform={`rotate(${deg} 100 100)`}>
							<path
								d={
									direction === 'cw'
										? 'M 97.5,43 L 102.5,46 L 97.5,49'
										: 'M 102.5,43 L 97.5,46 L 102.5,49'
								}
								fill="none"
								stroke="var(--color-accent)"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								opacity="0.8"
							/>
						</g>
					))}
				</svg>

				{/* Rotating Needle Pointing from Center Hub to Active Rim Seat */}
				<div
					className={S.CompassNeedle}
					style={{ transform: `rotate(${needleRotation}deg)` }}
					aria-hidden="true"
				>
					<svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
						<polygon
							points="100,30 109,57 100,51 91,57"
							fill={activeConfig.color}
							filter="drop-shadow(0 1px 3px oklch(0 0 0 / 0.25))"
						/>
						<polygon points="100,164 105,144 100,148 95,144" fill="var(--color-text-3)" opacity="0.5" />
					</svg>
				</div>

				{/* Compact Shape/Rank Seat Nodes Along the Rim */}
				{seats.map((seat, idx) => {
					const config = PLAYER_CONFIGS[seat.playerConfigIndex];
					const isActive = idx === activeSeatIndex;
					const shapeLabel = t(config.shapeKey);
					const rad = (seat.angleDeg * Math.PI) / 180;
					const rimX = 50 + 39 * Math.cos(rad);
					const rimY = 50 + 39 * Math.sin(rad);

					return (
						<div
							key={seat.id}
							className={S.SeatNode}
							data-active={isActive ? 'true' : 'false'}
							style={{
								left: `${rimX}%`,
								top: `${rimY}%`,
								borderColor: isActive ? config.color : undefined,
							}}
							title={`${seat.name} (${shapeLabel})`}
						>
							<span className={S.SeatShapeIcon} style={{ color: config.color }} aria-hidden="true">
								{config.icon}
							</span>
							{seat.turnRank && (
								<div
									className={S.SeatRankBadge}
									style={{ backgroundColor: config.color }}
									aria-hidden="true"
								>
									#{seat.turnRank}
								</div>
							)}
						</div>
					);
				})}

				{/* Center Tap Hub */}
				<button
					type="button"
					className={S.CompassDial}
					onClick={handleNext}
					aria-label={`${t('tools.tableCompass.compass.nextTurn')}. ${t(
						'tools.tableCompass.compass.activeTurn',
					)}: ${activeSeat?.name}`}
				>
					<div className={S.DialContent}>
						<span className={S.DialTurnNumber}>
							{t('tools.tableCompass.compass.turnCount', { turn: turnCount })}
						</span>
						<span className={S.DialActiveIcon} style={{ color: activeConfig.color }} aria-hidden="true">
							{activeConfig.icon}
						</span>
					</div>
				</button>
			</section>

			{/* Player Turn Queue Strip (Shows full player names without clipping) */}
			<ol className={S.TurnQueueGrid} aria-label={t('tools.tableCompass.modes.turnOrder')}>
				{seats.map((seat, idx) => {
					const config = PLAYER_CONFIGS[seat.playerConfigIndex];
					const isActive = idx === activeSeatIndex;

					return (
						<li
							key={seat.id}
							className={S.TurnQueueItem}
							data-active={isActive ? 'true' : 'false'}
							style={{
								borderColor: isActive ? config.color : undefined,
								backgroundColor: isActive ? config.bgLight : undefined,
							}}
							aria-current={isActive ? 'step' : undefined}
						>
							<span className={S.TurnQueueBadge} style={{ color: config.color }} aria-hidden="true">
								{config.icon}
							</span>
							<span className={S.TurnQueueName}>{seat.name}</span>
							{seat.turnRank && (
								<span className={S.TurnQueueRank} style={{ backgroundColor: config.color }}>
									#{seat.turnRank}
								</span>
							)}
						</li>
					);
				})}
			</ol>

			{/* Accessible Action Controls */}
			<Toolbar align="center" aria-label={t('actions.gameControls')}>
				<Button
					variant="outline"
					size="md"
					onClick={onPreviousTurn}
					disabled={turnCount <= 1}
					aria-label={t('tools.tableCompass.compass.previousTurn')}
				>
					⏮️ {t('tools.tableCompass.compass.previousTurn')}
				</Button>

				<Button
					variant="primary"
					size="lg"
					onClick={handleNext}
					aria-label={t('tools.tableCompass.compass.nextTurn')}
				>
					⏭️ {t('tools.tableCompass.compass.nextTurn')}
				</Button>

				<Button
					variant="secondary"
					size="md"
					onClick={handleReverse}
					aria-label={t('tools.tableCompass.compass.reverseDirection')}
				>
					{direction === 'cw' ? '↻' : '↺'} {t('tools.tableCompass.compass.reverseDirection')}
				</Button>
			</Toolbar>
		</Stack>
	);
}
