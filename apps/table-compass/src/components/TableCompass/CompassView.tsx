import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Badge } from '@arcade/lib-ui/components/Badge';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import * as S from './TableCompass.styles';
import type { CompassHistoryEntry, Direction, Seat } from './TableCompass.types';
import { PLAYER_CONFIGS } from './constants';

interface CompassViewProps {
	seats: Seat[];
	activeSeatIndex: number;
	direction: Direction;
	turnCount: number;
	history: CompassHistoryEntry[];
	onNextTurn: (template?: (turn: number, name: string, shape: string) => string) => void;
	onSkipPlayer: (template?: (turn: number, name: string, shape: string) => string) => void;
	onPreviousTurn: () => void;
	onReverseDirection: (cwMessage?: string, ccwMessage?: string) => void;
	onEditNames: () => void;
	onRePick: () => void;
	onClearHistory: () => void;
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
	history,
	onNextTurn,
	onSkipPlayer,
	onPreviousTurn,
	onReverseDirection,
	onEditNames,
	onRePick,
	onClearHistory,
}: CompassViewProps) {
	const { t } = useI18n();
	const turnOrderHeadingId = useId();
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

	const handleSkip = useCallback(() => {
		onSkipPlayer((turn, name, shape) => t('tools.tableCompass.compass.turnAnnouncement', { turn, name, shape }));
	}, [onSkipPlayer, t]);

	const handleReverse = useCallback(() => {
		onReverseDirection(
			t('tools.tableCompass.compass.directionSwitchedToCw'),
			t('tools.tableCompass.compass.directionSwitchedToCcw'),
		);
	}, [onReverseDirection, t]);

	return (
		<Stack spacing="md">
			<div className={S.MainCard}>
				{/* Integrated Ring Dial (Compact circular board, max 21rem) */}
				<section className={S.CompassBoard} aria-label={t('tools.tableCompass.compass.title')}>
					{/* Rim Track & Inner Direction Chevrons SVG */}
					<svg viewBox="0 0 200 200" className={S.DialRingSvg} aria-hidden="true">
						{/* Outer Seat Rim Track */}
						<circle
							cx="100"
							cy="100"
							r="78"
							fill="none"
							stroke="var(--color-container-2)"
							strokeWidth="2"
						/>
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
											? 'M 96.5,42 L 103.5,46 L 96.5,50'
											: 'M 103.5,42 L 96.5,46 L 103.5,50'
									}
									fill="none"
									stroke="var(--color-surface)"
									strokeWidth="4.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d={
										direction === 'cw'
											? 'M 96.5,42 L 103.5,46 L 96.5,50'
											: 'M 103.5,42 L 96.5,46 L 103.5,50'
									}
									fill="none"
									stroke="var(--color-accent)"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
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
								points="100,26 111,62 100,55 89,62"
								fill={activeConfig.color}
								stroke="var(--color-surface)"
								strokeWidth="2.5"
								strokeLinejoin="round"
								paintOrder="stroke"
								filter="drop-shadow(0 1px 3px oklch(0 0 0 / 0.25))"
							/>
							<polygon
								points="100,160 106,138 100,143 94,138"
								fill="var(--color-text-3)"
								stroke="var(--color-surface)"
								strokeWidth="2"
								strokeLinejoin="round"
								paintOrder="stroke"
								opacity="0.7"
							/>
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

				{/* Accessible Action Controls */}
				<Toolbar
					variant="ghost"
					align="center"
					className={S.CompassToolbar}
					aria-label={t('actions.gameControls')}
				>
					<Stack direction="row" inline fullWidth={false} spacing="xs">
						<Button
							variant="outline"
							size="md"
							onClick={onPreviousTurn}
							disabled={turnCount <= 1}
							aria-label={t('tools.tableCompass.compass.previousTurn')}
							title={t('tools.tableCompass.compass.previousTurn')}
						>
							<Icon name="undo" size="sm" />
							<span>{t('tools.tableCompass.compass.previousTurn')}</span>
						</Button>

						<Button
							variant="outline"
							size="md"
							onClick={handleNext}
							aria-label={t('tools.tableCompass.compass.nextTurn')}
							title={t('tools.tableCompass.compass.nextTurn')}
						>
							<Icon name="redo" size="sm" />
							<span>{t('tools.tableCompass.compass.nextTurn')}</span>
						</Button>
					</Stack>

					<Stack direction="row" inline fullWidth={false} spacing="xs">
						<Button
							variant="outline"
							size="md"
							onClick={handleSkip}
							aria-label={t('tools.tableCompass.compass.skipPlayer')}
							title={t('tools.tableCompass.compass.skipPlayer')}
						>
							<Icon name="chevron-right" size="sm" />
							<span>{t('tools.tableCompass.compass.skipShort')}</span>
						</Button>

						<Button
							variant="outline"
							size="md"
							onClick={handleReverse}
							aria-label={t('tools.tableCompass.compass.reverseDirection')}
							title={t('tools.tableCompass.compass.reverseDirection')}
						>
							<Icon name="rotate-ccw" size="sm" />
							<span>{t('tools.tableCompass.compass.reverseShort')}</span>
						</Button>
					</Stack>
				</Toolbar>

				{/* Player Turn Queue Section */}
				<section className={S.TurnQueueSection} aria-labelledby={turnOrderHeadingId}>
					<h2 id={turnOrderHeadingId} className={S.SectionHeading}>
						{t('tools.tableCompass.modes.turnOrder')}
					</h2>
					<ol className={S.TurnQueueGrid} aria-labelledby={turnOrderHeadingId}>
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
									<span
										className={S.TurnQueueBadge}
										style={{ color: config.color }}
										aria-hidden="true"
									>
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
				</section>

				{/* Edit Names & New Pick below user list */}
				<Stack direction="row" justify="center" align="center" wrap spacing="sm">
					<Button variant="outline" size="sm" onClick={onEditNames}>
						{t('tools.tableCompass.compass.editNames')}
					</Button>
					<Button variant="outline" size="sm" onClick={onRePick}>
						<Icon name="rotate-ccw" size="sm" />
						{t('tools.tableCompass.compass.rePick')}
					</Button>
				</Stack>
			</div>

			{/* Turn & Action History Section */}
			<section className={S.HistorySection} aria-label={t('tools.tableCompass.compass.historyLabel')}>
				<div className={S.HistoryHeader}>
					<h2 className={S.HistoryTitle}>{t('tools.tableCompass.compass.historyLabel')}</h2>
					{history.length > 0 && (
						<Button
							size="sm"
							variant="ghost"
							onClick={onClearHistory}
							aria-label={t('tools.tableCompass.compass.clearHistory')}
						>
							✕ {t('tools.tableCompass.compass.clearHistory')}
						</Button>
					)}
				</div>
				{history.length === 0 ? (
					<span className={S.EmptyHistory}>{t('tools.tableCompass.compass.emptyHistory')}</span>
				) : (
					<div className={S.HistoryStrip}>
						{history.map((entry) => {
							if (entry.kind === 'reverse') {
								const label =
									entry.direction === 'ccw'
										? t('tools.tableCompass.compass.historyReverseCcw')
										: t('tools.tableCompass.compass.historyReverseCw');
								return (
									<Badge
										key={entry.id}
										variant="subtle"
										tone="accent"
										tabular
										screenReaderLabel={label}
										leadingIcon={<Icon name="rotate-ccw" size="xs" />}
									>
										{label}
									</Badge>
								);
							}

							const config = PLAYER_CONFIGS[entry.playerConfigIndex ?? 0];
							if (entry.kind === 'skip') {
								const skipLabel = t('tools.tableCompass.compass.historySkipEntry', {
									name: entry.playerName ?? '',
								});
								return (
									<Badge
										key={entry.id}
										variant="dashed"
										tone="neutral"
										tabular
										screenReaderLabel={skipLabel}
										leadingIcon={<Icon name="chevron-right" size="xs" />}
									>
										<span style={{ color: config?.color }} aria-hidden="true">
											{config?.icon}
										</span>
										<span>{skipLabel}</span>
									</Badge>
								);
							}

							const turnLabel = t('tools.tableCompass.compass.historyTurnEntry', {
								turn: entry.turn ?? 1,
								name: entry.playerName ?? '',
							});
							return (
								<Badge
									key={entry.id}
									variant="subtle"
									tone="neutral"
									tabular
									screenReaderLabel={turnLabel}
								>
									<span className={S.HistoryTurnNumber}>#{entry.turn ?? 1}</span>
									<span style={{ color: config?.color }} aria-hidden="true">
										{config?.icon}
									</span>
									<span>{entry.playerName}</span>
								</Badge>
							);
						})}
					</div>
				)}
			</section>
		</Stack>
	);
}
