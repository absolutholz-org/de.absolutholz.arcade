import type { LogTimeRange } from '@arcade/lib-logger';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { useDiagnosticsSettingsSection } from './_DiagnosticsSettingsSection.hooks';
import * as S from './_DiagnosticsSettingsSection.styles';
import type { DiagnosticsSettingsSectionProps } from './_DiagnosticsSettingsSection.types';

export function DiagnosticsSettingsSection({ className, id }: DiagnosticsSettingsSectionProps) {
	const {
		baseId,
		handleClear,
		handleDownload,
		isBusy,
		isConfirming,
		range,
		rangeOptions,
		setIsConfirming,
		setRange,
		status,
		t,
	} = useDiagnosticsSettingsSection(id);

	return (
		<Stack id={baseId} className={className} spacing="md">
			<Stack spacing="xs">
				<Text variant="h2" as="h2">
					{t('settings.diagnosticsSectionTitle')}
				</Text>
				<Text variant="small" as="p">
					{t('settings.diagnosticsDescription')}
				</Text>
			</Stack>
			<Stack direction="row" wrap align="center" spacing="sm">
				<Text variant="small" as="label" htmlFor={`${baseId}-range`}>
					{t('settings.diagnosticsRangeLabel')}
				</Text>
				<S.Select
					id={`${baseId}-range`}
					value={range}
					onChange={(e) => setRange(e.target.value as LogTimeRange)}
				>
					{rangeOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</S.Select>
				<Button type="button" variant="primary" size="sm" disabled={isBusy} onClick={handleDownload}>
					{t('settings.diagnosticsDownload')}
				</Button>
				{isConfirming ? (
					<Stack as="fieldset" direction="row" wrap align="center" spacing="sm" fullWidth={false}>
						<Text variant="small" as="legend">
							{t('settings.diagnosticsClearConfirm')}
						</Text>
						<Button type="button" variant="secondary" size="sm" disabled={isBusy} onClick={handleClear}>
							{t('settings.diagnosticsClearYes')}
						</Button>
						<Button type="button" variant="ghost" size="sm" onClick={() => setIsConfirming(false)}>
							{t('settings.diagnosticsClearCancel')}
						</Button>
					</Stack>
				) : (
					<Button type="button" variant="ghost" size="sm" onClick={() => setIsConfirming(true)}>
						{t('settings.diagnosticsClear')}
					</Button>
				)}
			</Stack>
			<Text variant="small" as="output" aria-live="polite">
				{status}
			</Text>
		</Stack>
	);
}
