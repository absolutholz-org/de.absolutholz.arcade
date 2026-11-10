import { GameActionBar } from '../GameActionBar';

export interface GameOfflineToolbarProps {
	gameId: string;
	gameTitle?: string;
	className?: string;
}

/**
 * @deprecated Use GameActionBar instead.
 */
export function GameOfflineToolbar({ gameId, gameTitle, className }: GameOfflineToolbarProps) {
	return <GameActionBar gameId={gameId} gameTitle={gameTitle} justify="start" className={className} />;
}
