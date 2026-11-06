export const LOG_RANGE_OPTIONS = [
	{ value: '1h', labelKey: 'settings.diagnosticsRange1h' },
	{ value: '12h', labelKey: 'settings.diagnosticsRange12h' },
	{ value: '24h', labelKey: 'settings.diagnosticsRange24h' },
	{ value: '3d', labelKey: 'settings.diagnosticsRange3d' },
	{ value: 'all', labelKey: 'settings.diagnosticsRangeAll' },
] as const;

export const DEFAULT_LOG_RANGE = 'all';
