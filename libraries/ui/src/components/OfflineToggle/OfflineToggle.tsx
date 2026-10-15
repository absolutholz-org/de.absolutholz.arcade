import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { css } from '@linaria/core';
import type React from 'react';

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

const toggleBtnClass = css`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	font-size: 0.875rem;
	font-weight: 500;
	border-radius: var(--radius-sm, 0.375rem);
	cursor: pointer;
	border: 1px solid var(--color-container-3, #d1d5db);
	background: var(--color-container-1, #ffffff);
	color: var(--color-text-1, #111827);
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background: var(--color-container-2, #f3f4f6);
	}

	&:focus-visible {
		outline: 2px solid var(--color-action-primary, #2563eb);
		outline-offset: 2px;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	&[data-installed='true'] {
		border-color: var(--color-status-success, #10b981);
		color: var(--color-status-success, #059669);
	}
`;

const removeBtnClass = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.375rem 0.625rem;
	font-size: 0.875rem;
	font-weight: 600;
	border-radius: var(--radius-sm, 0.375rem);
	cursor: pointer;
	border: 1px solid var(--color-container-3, #d1d5db);
	background: transparent;
	color: var(--color-text-2, #6b7280);
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background: var(--color-container-2, #f3f4f6);
		color: var(--color-status-danger, #ef4444);
	}
`;

export const OfflineToggle: React.FC<OfflineToggleProps> = ({ gameId, status, onToggle, onUninstall, className }) => {
	const { t } = useI18n('common');

	const isInstalled = status === 'installed';
	const isDownloading = status === 'downloading';
	const isChecking = status === 'checking';

	return (
		<div className={`${toggleContainerClass} ${className || ''}`}>
			<button
				type="button"
				onClick={() => onToggle()}
				disabled={isDownloading || isChecking}
				className={toggleBtnClass}
				data-installed={isInstalled ? 'true' : 'false'}
				aria-label={
					isInstalled ? `${t('offline.installed')}: ${gameId}` : `${t('offline.saveOffline')}: ${gameId}`
				}
			>
				{isDownloading ? (
					<span>⏳ {t('offline.downloading')}</span>
				) : isInstalled ? (
					<span>✓ {t('offline.installed')}</span>
				) : (
					<span>📥 {t('offline.saveOffline')}</span>
				)}
			</button>
			{isInstalled && onUninstall && (
				<button
					type="button"
					onClick={() => onUninstall()}
					className={removeBtnClass}
					aria-label={`${t('offline.uninstall')}: ${gameId}`}
					title={t('offline.uninstall')}
				>
					✕
				</button>
			)}
		</div>
	);
};
