import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type LogTimeRange, clearAllLogs, exportLogsAsJson } from '@arcade/lib-logger';
import { useId, useState } from 'react';
import { DEFAULT_LOG_RANGE, LOG_RANGE_OPTIONS } from './_DiagnosticsSettingsSection.constants';

export function useDiagnosticsSettingsSection(id?: string) {
	const { t } = useI18n('common');
	const generatedId = useId();
	const baseId = id ?? `diagnostics-${generatedId}`;
	const [range, setRange] = useState<LogTimeRange>(DEFAULT_LOG_RANGE);
	const [isConfirming, setIsConfirming] = useState(false);
	const [isBusy, setIsBusy] = useState(false);
	const [status, setStatus] = useState('');

	const rangeOptions = LOG_RANGE_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }));

	const handleDownload = async (): Promise<void> => {
		setIsBusy(true);
		try {
			await exportLogsAsJson(range);
			setStatus(t('settings.diagnosticsDownloaded'));
		} finally {
			setIsBusy(false);
		}
	};

	const handleClear = async (): Promise<void> => {
		setIsBusy(true);
		try {
			await clearAllLogs();
			setStatus(t('settings.diagnosticsCleared'));
		} finally {
			setIsBusy(false);
			setIsConfirming(false);
		}
	};

	return {
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
	};
}
