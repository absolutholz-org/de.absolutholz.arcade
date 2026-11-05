import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { css } from '@linaria/core';
import type React from 'react';
import { Button } from '../Button';

export type OfflineToggleStatus = 'idle' | 'checking' | 'installed' | 'downloading' | 'error';

export interface OfflineToggleProps {
	gameId: string;
	status: OfflineToggleStatus;
	onToggle: () => undefined | Promise<unknown>;
	onUninstall?: () => undefined | Promise<unknown>;
	className?: string;
}

const toggleContainerClass = css`
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
`;

export const OfflineToggle: React.FC<OfflineToggleProps> = ({ gameId, status, onToggle, onUninstall, className }) => {
	const { t } = useI18n('common');

	const isInstalled = status === 'installed';
	const isDownloading = status === 'downloading';
	const isChecking = status === 'checking';

	const icon = isDownloading ? '⏳' : isInstalled ? '✓' : '📥';
	const label = isDownloading
		? t('offline.downloading')
		: isInstalled
			? t('offline.installed')
			: t('offline.saveOffline');

	return (
		<div className={`${toggleContainerClass} ${className || ''}`}>
			<Button
				variant="secondary"
				size="sm"
				onClick={() => onToggle()}
				disabled={isDownloading || isChecking}
				aria-label={
					isInstalled ? `${t('offline.installed')}: ${gameId}` : `${t('offline.saveOffline')}: ${gameId}`
				}
				leadingIcon={<span aria-hidden="true">{icon}</span>}
			>
				{label}
			</Button>
			{isInstalled && onUninstall && (
				<Button
					variant="ghost"
					size="sm"
					isIconOnly
					onClick={() => onUninstall()}
					aria-label={`${t('offline.uninstall')}: ${gameId}`}
					title={t('offline.uninstall')}
				>
					✕
				</Button>
			)}
		</div>
	);
};
