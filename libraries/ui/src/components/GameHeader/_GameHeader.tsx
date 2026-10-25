import { Button } from '../Button';
import { Icon } from '../Icon';
import { PageContainer } from '../PageContainer';
import {
	DEFAULT_CONTAINER_WIDTH,
	DEFAULT_HEADER_ARIA_LABEL,
	LOBBY_ARIA_LABEL,
	SETTINGS_ARIA_LABEL,
	USER_ARIA_LABEL,
} from './_GameHeader.constants';
import * as S from './_GameHeader.styles';
import type { GameHeaderProps } from './_GameHeader.types';

/**
 * Mobile-first arcade game header with a strict 3-track layout:
 * - Left track: Navigation back to lobby
 * - Center track: Mathematical center for game state (mode badge, timer)
 * - Right track: User and Settings utility cluster
 */
export function GameHeader({
	onLobbyClick,
	lobbyHref,
	onOpenSettings,
	onUserClick,
	children,
	containerWidth = DEFAULT_CONTAINER_WIDTH,
	'aria-label': ariaLabel = DEFAULT_HEADER_ARIA_LABEL,
	className,
}: GameHeaderProps) {
	return (
		<S.GameHeader aria-label={ariaLabel} className={className}>
			<PageContainer variant={containerWidth}>
				<div className="game-header-grid">
					<div className="game-header-left">
						{lobbyHref ? (
							<Button
								as="a"
								href={lobbyHref}
								onClick={onLobbyClick}
								variant="ghost"
								size="md"
								isIconOnly
								aria-label={LOBBY_ARIA_LABEL}
								title={LOBBY_ARIA_LABEL}
								className="game-header-btn"
								leadingIcon={<Icon name="arrow-left" size="sm" />}
							/>
						) : (
							<Button
								type="button"
								onClick={onLobbyClick}
								variant="ghost"
								size="md"
								isIconOnly
								aria-label={LOBBY_ARIA_LABEL}
								title={LOBBY_ARIA_LABEL}
								className="game-header-btn"
								leadingIcon={<Icon name="arrow-left" size="sm" />}
							/>
						)}
					</div>

					<div className="game-header-center">{children}</div>

					<div className="game-header-right">
						{onUserClick && (
							<Button
								type="button"
								onClick={onUserClick}
								variant="ghost"
								size="md"
								isIconOnly
								aria-label={USER_ARIA_LABEL}
								title={USER_ARIA_LABEL}
								className="game-header-btn"
								leadingIcon={<Icon name="user" size="sm" />}
							/>
						)}
						<Button
							type="button"
							onClick={onOpenSettings}
							variant="ghost"
							size="md"
							isIconOnly
							aria-label={SETTINGS_ARIA_LABEL}
							title={SETTINGS_ARIA_LABEL}
							className="game-header-btn"
							leadingIcon={<Icon name="settings" size="sm" />}
						/>
					</div>
				</div>
			</PageContainer>
		</S.GameHeader>
	);
}
