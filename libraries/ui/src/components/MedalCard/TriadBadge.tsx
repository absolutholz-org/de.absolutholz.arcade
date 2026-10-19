import type { JSX } from 'react';
import { MedalIcon } from '../MedalIcon/MedalIcon';
import * as S from './TriadBadge.styles';

export interface TriadBadgeProps {
	/** Whether the Bronze tier is unlocked */
	bronzeUnlocked?: boolean;
	/** Whether the Silver tier is unlocked */
	silverUnlocked?: boolean;
	/** Whether the Gold tier is unlocked */
	goldUnlocked?: boolean;
	/** Size of individual medals in the cluster (default: 36) */
	size?: number | string;
	/** Additional CSS class */
	className?: string;
}

/**
 * Overlapping triangular 3-medal cluster badge for progressive ladder achievements.
 * - Top-Left: Silver medal
 * - Top-Right: Bronze medal
 * - Bottom-Center: Gold medal (elevated z-index and subtle drop shadow)
 */
export function TriadBadge({
	bronzeUnlocked = false,
	silverUnlocked = false,
	goldUnlocked = false,
	size = 36,
	className,
}: TriadBadgeProps): JSX.Element {
	return (
		<S.ClusterContainer className={className} aria-hidden="true">
			<S.TopRow>
				{/* Top-Left: Silver medal */}
				<MedalIcon tier="silver" state={silverUnlocked ? 'unlocked' : 'locked'} size={size} />
				{/* Top-Right: Bronze medal */}
				<MedalIcon tier="bronze" state={bronzeUnlocked ? 'unlocked' : 'locked'} size={size} />
			</S.TopRow>
			<S.BottomRow>
				{/* Bottom-Center: Gold medal */}
				<div data-slot="gold-medal">
					<MedalIcon tier="gold" state={goldUnlocked ? 'unlocked' : 'locked'} size={size} />
				</div>
			</S.BottomRow>
		</S.ClusterContainer>
	);
}
