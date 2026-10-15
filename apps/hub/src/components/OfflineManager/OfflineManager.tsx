import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { OfflineToggle, formatBytes, useOfflineGame } from '@arcade/lib-ui';
import type React from 'react';

const MONOREPO_GAMES = [
	{ id: 'sudoku', name: 'Sudoku', icon: '🔢' },
	{ id: 'minesweeper', name: 'Minesweeper', icon: '💣' },
	{ id: 'nonogram', name: 'Nonogram', icon: '🎨' },
	{ id: 'queens', name: 'Queens', icon: '👑' },
	{ id: 'hashiwokakero', name: 'Hashiwokakero', icon: '🌉' },
];

function GameRow({ game }: { game: { id: string; name: string; icon: string } }) {
	const { status, totalBytes, installGame, uninstallGame } = useOfflineGame(game.id);
	return (
		<div className="offline-game-item">
			<div className="game-meta">
				<span className="game-icon" aria-hidden="true">
					{game.icon}
				</span>
				<div>
					<span className="game-name">{game.name}</span>
					{totalBytes > 0 && <span className="game-size"> · {formatBytes(totalBytes)}</span>}
				</div>
			</div>
			<OfflineToggle
				gameId={game.id}
				status={status}
				totalBytes={totalBytes}
				onToggle={status === 'installed' ? uninstallGame : installGame}
				onUninstall={uninstallGame}
			/>
		</div>
	);
}

function OfflineManagerContent() {
	const { t } = useI18n('common');

	return (
		<div className="offline-manager-container">
			<h2>{t('offline.allGamesTitle')}</h2>
			<p className="section-desc">{t('offline.allGamesDescription')}</p>
			<div className="games-list">
				{MONOREPO_GAMES.map((game) => (
					<GameRow key={game.id} game={game} />
				))}
			</div>
		</div>
	);
}

export function OfflineManager({ lang }: { lang: SupportedLanguageCode }) {
	return (
		<I18nProvider language={lang}>
			<OfflineManagerContent />
		</I18nProvider>
	);
}
