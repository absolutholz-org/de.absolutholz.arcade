import { useOfflineGame } from '../../hooks/useOfflineGame';
import { OfflineToggle } from '../OfflineToggle/OfflineToggle';
import * as S from './GameOfflineToolbar.styles';

export interface GameOfflineToolbarProps {
	gameId: string;
	className?: string;
}

export function GameOfflineToolbar({ gameId, className }: GameOfflineToolbarProps) {
	const { status, installGame, uninstallGame } = useOfflineGame(gameId);

	return (
		<S.Root className={className}>
			<OfflineToggle
				gameId={gameId}
				status={status}
				onToggle={status === 'installed' ? uninstallGame : installGame}
				onUninstall={uninstallGame}
			/>
		</S.Root>
	);
}
