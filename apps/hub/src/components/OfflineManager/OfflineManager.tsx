import { ALL_GAMES, type GameDefinition } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { OfflineToggle, useOfflineGame } from '@arcade/lib-ui';
import type React from 'react';

function GameRow({ game }: { game: GameDefinition }) {
	const { status, installGame, uninstallGame } = useOfflineGame(game.id);
	return (
		<div className="offline-game-item">
			<div className="game-meta">
				<span className="game-icon" aria-hidden="true">
					{game.assets.icon}
				</span>
				<span className="game-name">{game.name}</span>
			</div>
			<OfflineToggle
				gameId={game.id}
				status={status}
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
				{ALL_GAMES.map((game) => (
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
