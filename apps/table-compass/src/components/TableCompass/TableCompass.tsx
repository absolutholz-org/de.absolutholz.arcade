import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '@arcade/lib-ui/components/Button';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Switch } from '@arcade/lib-ui/components/Switch';
import { useState } from 'react';
import { CompassView } from './CompassView';
import { PlayerNamingDialog } from './PlayerNamingDialog';
import * as S from './TableCompass.styles';
import type { TableCompassProps } from './TableCompass.types';
import { TouchArena } from './TouchArena';
import { useTableCompass } from './useTableCompass';
import { useWakeLock } from './useWakeLock';

function TableCompassContent({ className }: { className?: string }) {
	const { t } = useI18n();
	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
	const [wakeLockEnabled, setWakeLockEnabled] = useState<boolean>(true);

	const {
		phase,
		pickMode,
		setPickMode,
		direction,
		seats,
		activeSeatIndex,
		turnCount,
		isNamingOpen,
		setIsNamingOpen,
		liveMessage,
		handlePickComplete,
		handleStartCompass,
		handleNextTurn,
		handlePreviousTurn,
		handleReverseDirection,
		handleUpdateSeatName,
		handleResetToPick,
		handleSkipToCompass,
	} = useTableCompass();

	const isCompassActive = phase === 'compass' || phase === 'naming';
	const { isSupported: wakeLockSupported } = useWakeLock(isCompassActive && wakeLockEnabled);

	return (
		<Stack spacing="md" className={className}>
			{/* Visually hidden aria-live region for discrete screen reader announcements */}
			<div className={S.VisuallyHidden} aria-live="polite" aria-atomic="true">
				{liveMessage}
			</div>

			{/* Unified Top Action Row */}
			<Stack direction="row" justify="between" align="center" wrap spacing="sm" className={S.ToolHeader}>
				{isCompassActive && wakeLockSupported ? (
					<Switch
						checked={wakeLockEnabled}
						onChange={(e) => setWakeLockEnabled(e.target.checked)}
						label={t('tools.tableCompass.compass.keepScreenOn')}
						size="sm"
					/>
				) : (
					<span />
				)}

				<Stack direction="row" inline fullWidth={false} align="center" wrap spacing="xs">
					{isCompassActive && (
						<>
							<Button variant="outline" size="sm" onClick={() => setIsNamingOpen(true)}>
								✏️ {t('tools.tableCompass.compass.editNames')}
							</Button>
							<Button variant="outline" size="sm" onClick={handleResetToPick}>
								🔄 {t('tools.tableCompass.compass.rePick')}
							</Button>
						</>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsSettingsOpen(true)}
						aria-label={t('navigation.settings')}
					>
						⚙️ {t('navigation.settings')}
					</Button>
				</Stack>
			</Stack>

			{phase === 'pick' && (
				<TouchArena
					pickMode={pickMode}
					onPickModeChange={setPickMode}
					onPickComplete={handlePickComplete}
					onSkipToCompass={handleSkipToCompass}
				/>
			)}

			{isCompassActive && (
				<CompassView
					seats={seats}
					activeSeatIndex={activeSeatIndex}
					direction={direction}
					turnCount={turnCount}
					onNextTurn={handleNextTurn}
					onPreviousTurn={handlePreviousTurn}
					onReverseDirection={handleReverseDirection}
				/>
			)}

			{/* Player Naming Dialog (shown after finger pick or when requested) */}
			<PlayerNamingDialog
				isOpen={phase === 'naming' || isNamingOpen}
				seats={seats}
				onUpdateName={handleUpdateSeatName}
				onStartCompass={handleStartCompass}
				onClose={() => {
					if (phase === 'naming') {
						handleStartCompass();
					} else {
						setIsNamingOpen(false);
					}
				}}
			/>

			{/* Shared Game Settings Dialog */}
			<GameSettingsDialog
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				gameTitle={t('tools.tableCompass.title')}
			/>
		</Stack>
	);
}

export function TableCompass({ lang, className }: TableCompassProps) {
	return (
		<I18nProvider language={lang}>
			<TableCompassContent className={className} />
		</I18nProvider>
	);
}
