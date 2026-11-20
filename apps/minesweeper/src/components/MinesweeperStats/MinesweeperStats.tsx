import { GameStatsDashboard, type GameStatsDashboardProps } from '@arcade/lib-ui/components/GameStatsDashboard';
import { useEffect } from 'react';
import { scrubLegacyMinesweeperStats } from '../../utils/scrubLegacyStats';

/**
 * Minesweeper stats wrapper that scrubs deprecated `bestMoves` and `flawlessWins`
 * fields from persisted storage before/as the shared dashboard renders.
 */
export function MinesweeperStats(props: GameStatsDashboardProps) {
	useEffect(() => {
		void scrubLegacyMinesweeperStats();
	}, []);

	return <GameStatsDashboard {...props} />;
}
