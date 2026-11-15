import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { Switch } from '@arcade/lib-ui/components/Switch';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
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
		handleSkipPlayer,
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
			<VisuallyHidden aria-live="polite" aria-atomic="true">
				{liveMessage}
			</VisuallyHidden>

			{/* Wake Lock Toggle */}
			{isCompassActive && wakeLockSupported && (
				<Stack direction="row" justify="start" align="center" className={S.ToolHeader}>
					<Switch
						checked={wakeLockEnabled}
						onChange={(e) => setWakeLockEnabled(e.target.checked)}
						label={t('tools.tableCompass.compass.keepScreenOn')}
						size="sm"
					/>
				</Stack>
			)}

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
					onSkipPlayer={handleSkipPlayer}
					onPreviousTurn={handlePreviousTurn}
					onReverseDirection={handleReverseDirection}
					onEditNames={() => setIsNamingOpen(true)}
					onRePick={handleResetToPick}
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
