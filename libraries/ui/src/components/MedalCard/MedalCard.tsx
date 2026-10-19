import type { JSX, ReactNode } from 'react';
import { MedalIcon, type MedalTier } from '../MedalIcon/MedalIcon';
import * as S from './MedalCard.styles';
import { TriadBadge } from './TriadBadge';

export type MedalCardMode = 'standalone' | 'progressive';

export interface MedalProgressData {
	readonly current: number;
	readonly target: number;
}

export interface MedalCardProps {
	/** Mode of the card: standalone single-tier feat or progressive 3-tier ladder */
	mode?: MedalCardMode;

	/** Title of the medal or achievement */
	title: string;

	/** Description of the requirements to earn the achievement */
	description?: string;

	/** Optional badge displaying the game identifier (e.g. 'Sudoku') */
	gameBadge?: string;

	/** Optional tier label text (e.g. 'Bronze', 'Gold') */
	tierLabel?: string;

	/** Unlocked timestamp (milliseconds) or date string */
	unlockedAt?: number | string;

	/** Pre-formatted date label (e.g. 'Unlocked on Oct 19, 2026') */
	unlockedDateText?: string;

	/** Fallback text shown when locked without progress (default: 'Locked') */
	lockedText?: string;

	// --- Standalone Mode Props ---
	/** Medal tier for standalone mode (default: 'bronze') */
	tier?: MedalTier;

	/** Whether the standalone medal is unlocked */
	unlocked?: boolean;

	/** Progress towards achievement in standalone mode */
	progress?: MedalProgressData;

	// --- Progressive Mode Props ---
	/** Bronze tier unlock status for progressive mode */
	bronzeUnlocked?: boolean;

	/** Silver tier unlock status for progressive mode */
	silverUnlocked?: boolean;

	/** Gold tier unlock status for progressive mode */
	goldUnlocked?: boolean;

	/** Current tier progress toward the next unearned tier in progressive mode */
	progressiveProgress?: {
		current: number;
		target: number;
		nextTier?: MedalTier;
	};

	/** Optional custom emblem node passed into standalone MedalIcon */
	customEmblem?: ReactNode;

	/** Additional actions or child elements */
	children?: ReactNode;

	/** Additional CSS class */
	className?: string;
}

/**
 * Medal card component supporting both standalone single-tier achievements and
 * progressive 3-tier achievement ladders.
 */
export function MedalCard({
	mode,
	title,
	description,
	gameBadge,
	tierLabel,
	unlockedAt,
	unlockedDateText,
	lockedText = 'Locked',
	tier = 'bronze',
	unlocked = false,
	progress,
	bronzeUnlocked = false,
	silverUnlocked = false,
	goldUnlocked = false,
	progressiveProgress,
	customEmblem,
	children,
	className,
}: MedalCardProps): JSX.Element {
	const isProgressive =
		mode === 'progressive' ||
		(mode === undefined && (bronzeUnlocked || silverUnlocked || goldUnlocked || progressiveProgress !== undefined));

	// Determine next unearned tier for progressive mode
	const nextTier: MedalTier | null = !bronzeUnlocked
		? 'bronze'
		: !silverUnlocked
			? 'silver'
			: !goldUnlocked
				? 'gold'
				: null;

	const allTiersUnlocked = bronzeUnlocked && silverUnlocked && goldUnlocked;

	const overallStatus = isProgressive ? (allTiersUnlocked ? 'unlocked' : 'locked') : unlocked ? 'unlocked' : 'locked';

	const activeTier = isProgressive ? (nextTier ?? 'gold') : tier;

	// Single progress percentage calculation
	const singlePercent =
		progress && progress.target > 0 ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0;

	// Progressive next tier progress percentage
	const progressivePercent =
		progressiveProgress && progressiveProgress.target > 0
			? Math.min(100, Math.round((progressiveProgress.current / progressiveProgress.target) * 100))
			: 0;

	const formattedUnlockedDate =
		unlockedDateText ?? (unlockedAt ? `Unlocked on ${new Date(unlockedAt).toLocaleDateString()}` : undefined);

	return (
		<S.Card
			className={className}
			data-status={overallStatus}
			data-tier={activeTier}
			data-mode={isProgressive ? 'progressive' : 'standalone'}
		>
			<S.Header>
				<S.BadgeSlot>
					{isProgressive ? (
						<TriadBadge
							bronzeUnlocked={bronzeUnlocked}
							silverUnlocked={silverUnlocked}
							goldUnlocked={goldUnlocked}
							size={36}
						/>
					) : (
						<MedalIcon tier={tier} state={unlocked ? 'unlocked' : 'locked'} size={48}>
							{customEmblem}
						</MedalIcon>
					)}
				</S.BadgeSlot>

				<S.Meta>
					<S.TagRow>
						{gameBadge && <S.GameBadge>{gameBadge}</S.GameBadge>}
						{tierLabel && <S.TierBadge data-tier={activeTier}>{tierLabel}</S.TierBadge>}
					</S.TagRow>
					<S.Title>{title}</S.Title>
				</S.Meta>
			</S.Header>

			{description && <S.Description>{description}</S.Description>}

			<S.Footer>
				{isProgressive ? (
					// Progressive ladder multi-step progress bar
					<S.ProgressContainer>
						<S.MultiStepTrack aria-hidden="true">
							{/* Bronze Step */}
							<S.StepSegment>
								<S.StepSegmentFill
									data-tier="bronze"
									style={{
										width: bronzeUnlocked
											? '100%'
											: nextTier === 'bronze'
												? `${progressivePercent}%`
												: '0%',
									}}
								/>
							</S.StepSegment>

							{/* Silver Step */}
							<S.StepSegment>
								<S.StepSegmentFill
									data-tier="silver"
									style={{
										width: silverUnlocked
											? '100%'
											: nextTier === 'silver'
												? `${progressivePercent}%`
												: '0%',
									}}
								/>
							</S.StepSegment>

							{/* Gold Step */}
							<S.StepSegment>
								<S.StepSegmentFill
									data-tier="gold"
									style={{
										width: goldUnlocked
											? '100%'
											: nextTier === 'gold'
												? `${progressivePercent}%`
												: '0%',
									}}
								/>
							</S.StepSegment>
						</S.MultiStepTrack>

						<S.ProgressLabel>
							{allTiersUnlocked ? (
								<span>All Tiers Mastered (3/3)</span>
							) : progressiveProgress ? (
								<>
									<span>
										{progressiveProgress.current} / {progressiveProgress.target} (
										{progressivePercent}%)
									</span>
									<span style={{ textTransform: 'capitalize' }}>Next: {nextTier}</span>
								</>
							) : (
								<>
									<span>
										{[bronzeUnlocked, silverUnlocked, goldUnlocked].filter(Boolean).length} / 3
										Tiers
									</span>
									{nextTier && <span style={{ textTransform: 'capitalize' }}>Next: {nextTier}</span>}
								</>
							)}
						</S.ProgressLabel>
					</S.ProgressContainer>
				) : unlocked && formattedUnlockedDate ? (
					// Standalone unlocked state
					<S.UnlockedDate>{formattedUnlockedDate}</S.UnlockedDate>
				) : progress && progress.target > 0 ? (
					// Standalone with active progress
					<S.ProgressContainer>
						<S.ProgressBarTrack>
							<S.ProgressBarFill style={{ width: `${singlePercent}%` }} />
						</S.ProgressBarTrack>
						<S.ProgressLabel>
							<span>
								{progress.current} / {progress.target}
							</span>
							<span>{singlePercent}%</span>
						</S.ProgressLabel>
					</S.ProgressContainer>
				) : (
					// Standalone locked without progress
					<S.ProgressLabel>
						<span>{lockedText}</span>
					</S.ProgressLabel>
				)}

				{children}
			</S.Footer>
		</S.Card>
	);
}
