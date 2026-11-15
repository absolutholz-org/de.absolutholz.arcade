import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { WakeLockToggleButton } from '@arcade/lib-ui/components/WakeLockToggleButton';
import { useWakeLock } from '@arcade/lib-ui/hooks/useWakeLock';
import { useState } from 'react';
import { CompassView } from './CompassView';
import { PlayerNamingDialog } from './PlayerNamingDialog';
import * as S from './TableCompass.styles';
import type { TableCompassProps } from './TableCompass.types';
import { TouchArena } from './TouchArena';
import { useTableCompass } from './useTableCompass';

function TableCompassContent({ className }: { className?: string }) {
	const [wakeLockEnabled, setWakeLockEnabled] = useState<boolean>(true);

	const {
		phase,
		direction,
		seats,
		activeSeatIndex,
		turnCount,
		history,
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
		handleClearHistory,
		handleResetToPick,
		handleReturnToCompass,
		hasActiveCompass,
	} = useTableCompass();

	const isCompassActive = phase === 'compass' || phase === 'naming';
	const { isSupported: wakeLockSupported, isActive: wakeLockActive } = useWakeLock(wakeLockEnabled);

	return (
		<Stack spacing="md" className={className}>
			{/* Visually hidden aria-live region for discrete screen reader announcements */}
			<VisuallyHidden aria-live="polite" aria-atomic="true">
				{liveMessage}
			</VisuallyHidden>

			{/* Wake Lock Toggle */}
			{wakeLockSupported && (
				<div className={S.ToolHeader}>
					<WakeLockToggleButton
						enabled={wakeLockEnabled}
						isActive={wakeLockActive}
						isSupported={wakeLockSupported}
						onToggle={setWakeLockEnabled}
					/>
				</div>
			)}

			{phase === 'pick' && (
				<TouchArena
					hasActiveCompass={hasActiveCompass}
					onPickComplete={handlePickComplete}
					onReturnToCompass={handleReturnToCompass}
				/>
			)}

			{isCompassActive && (
				<CompassView
					seats={seats}
					activeSeatIndex={activeSeatIndex}
					direction={direction}
					turnCount={turnCount}
					history={history}
					onNextTurn={handleNextTurn}
					onSkipPlayer={handleSkipPlayer}
					onPreviousTurn={handlePreviousTurn}
					onReverseDirection={handleReverseDirection}
					onEditNames={() => setIsNamingOpen(true)}
					onRePick={handleResetToPick}
					onClearHistory={handleClearHistory}
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
