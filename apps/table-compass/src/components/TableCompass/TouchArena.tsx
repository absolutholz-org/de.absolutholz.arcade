import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Divider } from '@arcade/lib-ui/components/Divider';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { SegmentedControl } from '@arcade/lib-ui/components/SegmentedControl';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './TableCompass.styles';
import type { Seat, TouchPoint } from './TableCompass.types';
import { COUNTDOWN_DURATION_MS, MAX_PLAYERS, MIN_PLAYERS, PLAYER_CONFIGS } from './constants';
import { generateSeatsForCount } from './useTableCompass';

interface TouchArenaProps {
	hasActiveCompass: boolean;
	onPickComplete: (seats: Seat[], announcement?: string) => void;
	onReturnToCompass: () => void;
}

export function TouchArena({ hasActiveCompass, onPickComplete, onReturnToCompass }: TouchArenaProps) {
	const { t } = useI18n();
	const arenaRef = useRef<HTMLDivElement>(null);
	const [touches, setTouches] = useState<TouchPoint[]>([]);
	const [countdownProgress, setCountdownProgress] = useState<number>(0);
	const [fallbackCount, setFallbackCount] = useState<number>(4);

	const countdownStartRef = useRef<number | null>(null);
	const rafRef = useRef<number | null>(null);
	const touchesRef = useRef<TouchPoint[]>([]);
	touchesRef.current = touches;

	// Reset countdown helper
	const resetCountdown = useCallback(() => {
		countdownStartRef.current = null;
		setCountdownProgress(0);
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
	}, []);

	// Complete selection when timer reaches 2s
	const completeSelection = useCallback(() => {
		const currentTouches = touchesRef.current;
		if (currentTouches.length < MIN_PLAYERS || !arenaRef.current) return;

		const rect = arenaRef.current.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// 1. Calculate angles relative to center
		const rawSeats = currentTouches.map((touch, idx) => {
			const dx = touch.x - centerX;
			const dy = touch.y - centerY;
			const rad = Math.atan2(dy, dx);
			const deg = (rad * 180) / Math.PI;
			const angleDeg = (deg + 360) % 360;

			return {
				id: `seat-${idx}-${Date.now()}`,
				playerConfigIndex: touch.playerConfigIndex,
				name: PLAYER_CONFIGS[touch.playerConfigIndex].defaultNameKey,
				x: Math.max(0.08, Math.min(0.92, touch.x / rect.width)),
				y: Math.max(0.08, Math.min(0.92, touch.y / rect.height)),
				angleDeg,
			};
		});

		// 2. Sort seats in clockwise order around the table
		rawSeats.sort((a, b) => a.angleDeg - b.angleDeg);

		// 3. Pick random starting index
		const starterIdx = Math.floor(Math.random() * rawSeats.length);

		// 4. Assign ranks
		const finalizedSeats: Seat[] = rawSeats.map((seat, idx) => {
			const isStarter = idx === starterIdx;
			const rank = ((idx - starterIdx + rawSeats.length) % rawSeats.length) + 1;
			return {
				...seat,
				isStarter,
				turnRank: rank,
			};
		});

		const starterSeat = finalizedSeats.find((s) => s.isStarter);
		const starterName = starterSeat?.name || 'Player 1';
		const announcement = t('tools.tableCompass.pick.selectedStarter', { name: starterName });

		resetCountdown();
		setTouches([]);
		onPickComplete(finalizedSeats, announcement);
	}, [resetCountdown, onPickComplete, t]);

	// Countdown loop
	useEffect(() => {
		if (touches.length >= MIN_PLAYERS) {
			if (!countdownStartRef.current) {
				countdownStartRef.current = performance.now();
			}

			const tick = (now: number) => {
				if (!countdownStartRef.current) return;
				const elapsed = now - countdownStartRef.current;
				const progress = Math.min(1, elapsed / COUNTDOWN_DURATION_MS);
				setCountdownProgress(progress);

				if (progress >= 1) {
					completeSelection();
				} else {
					rafRef.current = requestAnimationFrame(tick);
				}
			};

			rafRef.current = requestAnimationFrame(tick);
		} else {
			resetCountdown();
		}

		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [touches.length, completeSelection, resetCountdown]);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!arenaRef.current) return;
		const rect = arenaRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setTouches((prev) => {
			if (prev.length >= MAX_PLAYERS) return prev;
			if (prev.some((t) => t.pointerId === e.pointerId)) return prev;

			// Find first unused playerConfigIndex
			const usedIndices = new Set(prev.map((t) => t.playerConfigIndex));
			let nextConfigIndex = 0;
			for (let i = 0; i < PLAYER_CONFIGS.length; i++) {
				if (!usedIndices.has(i)) {
					nextConfigIndex = i;
					break;
				}
			}

			// Smoothly reset timer on finger change
			countdownStartRef.current = performance.now();

			return [
				...prev,
				{
					pointerId: e.pointerId,
					x,
					y,
					playerConfigIndex: nextConfigIndex,
				},
			];
		});
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!arenaRef.current) return;
		const rect = arenaRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setTouches((prev) => prev.map((t) => (t.pointerId === e.pointerId ? { ...t, x, y } : t)));
	};

	const removePointer = (pointerId: number) => {
		setTouches((prev) => {
			const filtered = prev.filter((t) => t.pointerId !== pointerId);
			if (filtered.length >= MIN_PLAYERS) {
				countdownStartRef.current = performance.now();
			} else {
				resetCountdown();
			}
			return filtered;
		});
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		removePointer(e.pointerId);
	};

	const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
		removePointer(e.pointerId);
	};

	// Accessible random starter selection for non-touch / keyboard users
	const handleAccessiblePick = () => {
		const fallbackSeats = generateSeatsForCount(fallbackCount, 'turn-order');
		const starterSeat = fallbackSeats.find((s) => s.isStarter);
		const starterName = starterSeat?.name || 'Player 1';
		const announcement = t('tools.tableCompass.pick.selectedStarter', { name: starterName });
		onPickComplete(fallbackSeats, announcement);
	};

	const playerCountItems = [2, 3, 4, 5, 6, 7, 8].map((num) => ({
		value: String(num),
		label: String(num),
	}));

	const radius = 42;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - countdownProgress * circumference;

	return (
		<Stack spacing="md">
			{hasActiveCompass && (
				<Stack direction="row" justify="end" align="center" className={S.ToolHeader}>
					<Button variant="outline" size="sm" onClick={onReturnToCompass}>
						<Icon name="arrow-left" size="sm" />
						{t('tools.tableCompass.pick.backToCompass')}
					</Button>
				</Stack>
			)}

			<section
				ref={arenaRef}
				className={S.Arena}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerCancel}
				aria-label={t('tools.tableCompass.title')}
			>
				{touches.length === 0 && (
					<div className={S.ArenaHint}>
						<span style={{ fontSize: '3rem' }}>👆</span>
						<h3>{t('tools.tableCompass.pick.instruction')}</h3>
						<p>{t('tools.tableCompass.tagline')}</p>
					</div>
				)}

				{touches.length === 1 && (
					<div className={S.ArenaHint}>
						<h3>{t('tools.tableCompass.pick.holdingInstruction')}</h3>
						<p>{t('tools.tableCompass.pick.instruction')}</p>
					</div>
				)}

				{touches.map((touch) => {
					const config = PLAYER_CONFIGS[touch.playerConfigIndex];
					return (
						<div
							key={touch.pointerId}
							className={S.TouchRing}
							style={{
								left: `${touch.x}px`,
								top: `${touch.y}px`,
								backgroundColor: config.bgLight,
								boxShadow: `0 0 24px ${config.color}`,
							}}
						>
							<svg className={S.CountdownSvg} viewBox="0 0 92 92" aria-hidden="true">
								<circle
									cx="46"
									cy="46"
									r={radius}
									className={S.CountdownCircle}
									stroke={config.color}
									strokeWidth="6"
									strokeDasharray={circumference}
									strokeDashoffset={strokeDashoffset}
								/>
							</svg>

							<div className={S.TouchBadge} style={{ borderColor: config.color, color: config.color }}>
								{config.icon}
							</div>
						</div>
					);
				})}
			</section>

			<div className={S.DividerWrap}>
				<Divider>{t('tools.tableCompass.pick.manualSetupDivider')}</Divider>
			</div>

			<div className={S.FallbackSection}>
				<Stack spacing="md" align="center">
					<Stack direction="row" justify="center" align="center" wrap spacing="sm">
						<span className={S.FallbackLabel}>{t('tools.tableCompass.pick.playerCountLabel')}:</span>
						<SegmentedControl
							name="fallbackCount"
							items={playerCountItems}
							value={String(fallbackCount)}
							onChange={(val) => setFallbackCount(Number(val))}
						/>
					</Stack>

					<Button variant="primary" size="md" onClick={handleAccessiblePick}>
						🎲 {t('tools.tableCompass.pick.pickRandomStarter')}
					</Button>
				</Stack>
			</div>
		</Stack>
	);
}
