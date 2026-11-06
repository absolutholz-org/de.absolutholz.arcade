import { clearLogStore, readLogsSince } from './storage.js';
import type { LogEntry, LogExportPayload, LogTimeRange } from './types.js';

const HOUR_MS = 3_600_000;

const RANGE_WINDOW_MS: Record<Exclude<LogTimeRange, 'all'>, number> = {
	'1h': HOUR_MS,
	'12h': 12 * HOUR_MS,
	'24h': 24 * HOUR_MS,
	'3d': 72 * HOUR_MS,
};

export function getRangeStartTimestamp(range: LogTimeRange, now = Date.now()): number {
	return range === 'all' ? 0 : now - RANGE_WINDOW_MS[range];
}

export function getLogsByTimeRange(range: LogTimeRange): Promise<LogEntry[]> {
	return readLogsSince(getRangeStartTimestamp(range));
}

export function clearAllLogs(): Promise<void> {
	return clearLogStore();
}

function pad(value: number): string {
	return String(value).padStart(2, '0');
}

function formatFilenameTimestamp(date: Date): string {
	const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	return `${day}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export async function exportLogsAsJson(range: LogTimeRange): Promise<{ count: number; filename: string }> {
	const entries = await getLogsByTimeRange(range);
	const now = new Date();
	const payload: LogExportPayload = {
		exportedAt: now.toISOString(),
		timeRange: range,
		client: {
			userAgent: navigator.userAgent,
			screen: `${window.screen.width}x${window.screen.height}`,
			url: window.location.href,
		},
		entryCount: entries.length,
		entries,
	};
	const filename = `arcade-logs-${range}-${formatFilenameTimestamp(now)}.json`;

	const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	try {
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = filename;
		anchor.hidden = true;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	} finally {
		URL.revokeObjectURL(url);
	}
	return { count: entries.length, filename };
}
