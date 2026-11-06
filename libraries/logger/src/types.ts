export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogTimeRange = '1h' | '12h' | '24h' | '3d' | 'all';

export interface LogEntry {
	id?: number;
	timestamp: number; // Epoch ms
	level: LogLevel;
	source: string; // e.g. 'flood-it', 'minesweeper', 'shell', 'i18n'
	message: string;
	context?: Record<string, unknown>;
	error?: {
		name: string;
		message: string;
		stack?: string;
	};
}

export interface LogExportPayload {
	exportedAt: string;
	timeRange: LogTimeRange;
	client: {
		userAgent: string;
		screen: string;
		url: string;
	};
	entryCount: number;
	entries: LogEntry[];
}

export interface LoggerInstance {
	debug(message: string, context?: Record<string, unknown>): void;
	info(message: string, context?: Record<string, unknown>): void;
	warn(message: string, context?: Record<string, unknown>): void;
	error(message: string, error?: unknown, context?: Record<string, unknown>): void;
}
