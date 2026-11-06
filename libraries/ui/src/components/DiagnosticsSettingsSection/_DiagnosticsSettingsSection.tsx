import { Button } from '../Button';
import { CollapsibleListbox } from '../CollapsibleListbox';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { useDiagnosticsSettingsSection } from './_DiagnosticsSettingsSection.hooks';
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
				<Text variant="small" as="span" id={`${baseId}-range-label`}>
					{t('settings.diagnosticsRangeLabel')}
				</Text>
				<CollapsibleListbox
					id={`${baseId}-range`}
					activeId={range}
					options={rangeOptions}
					onSelect={setRange}
					showLabel={true}
					variant="outline"
					size="sm"
					aria-labelledby={`${baseId}-range-label`}
				/>
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
