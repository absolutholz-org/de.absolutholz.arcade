import { addLogEntry } from './storage.js';
import type { LogEntry, LogLevel, LoggerInstance } from './types.js';

type SerializedError = NonNullable<LogEntry['error']>;

/** Safely converts any thrown value into a plain serializable error record. */
export function serializeError(error: unknown): SerializedError | undefined {
	if (error === undefined || error === null) return undefined;
	if (error instanceof Error) {
		return { name: error.name, message: error.message, ...(error.stack ? { stack: error.stack } : {}) };
	}
	if (typeof error === 'string') return { name: 'Error', message: error };
	if (typeof error === 'object') {
		const candidate = error as { name?: unknown; message?: unknown; stack?: unknown };
		const name = typeof candidate.name === 'string' ? candidate.name : 'UnknownError';
		let message: string;
		if (typeof candidate.message === 'string') {
			message = candidate.message;
		} else {
			try {
				message = JSON.stringify(error) ?? String(error);
			} catch {
				message = String(error);
			}
		}
		return { name, message, ...(typeof candidate.stack === 'string' ? { stack: candidate.stack } : {}) };
	}
	return { name: 'Error', message: String(error) };
}

/** Strips non-cloneable values (functions, cycles) so IndexedDB writes cannot throw. */
function sanitizeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
	if (!context) return undefined;
	try {
		return JSON.parse(JSON.stringify(context)) as Record<string, unknown>;
	} catch {
		return { _unserializable: true };
	}
}

declare const process: { env?: { NODE_ENV?: string } } | undefined;

function isDevelopment(): boolean {
	return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
}

function record(
	source: string,
	level: LogLevel,
	message: string,
	context?: Record<string, unknown>,
	error?: unknown,
): void {
	const serializedError = serializeError(error);
	const entry: LogEntry = {
		timestamp: Date.now(),
		level,
		source,
		message,
		...(context ? { context: sanitizeContext(context) } : {}),
		...(serializedError ? { error: serializedError } : {}),
	};
	if (isDevelopment()) {
		const args: unknown[] = [`[${source}]`, message];
		if (context) args.push(context);
		if (error !== undefined) args.push(error);
		console[level](...args);
	}
	void addLogEntry(entry);
}

export function createLogger(source: string): LoggerInstance {
	return {
		debug: (message, context) => record(source, 'debug', message, context),
		info: (message, context) => record(source, 'info', message, context),
		warn: (message, context) => record(source, 'warn', message, context),
		error: (message, error, context) => record(source, 'error', message, context, error),
	};
}

export function initGlobalErrorHandlers(source = 'arcade-runtime'): () => void {
	if (typeof window === 'undefined') return () => undefined;
	const logger = createLogger(source);

	const onError = (event: ErrorEvent): void => {
		logger.error(event.message || 'Uncaught error', event.error ?? event.message, {
			filename: event.filename,
			lineno: event.lineno,
			colno: event.colno,
		});
	};
	const onRejection = (event: PromiseRejectionEvent): void => {
		logger.error('Unhandled promise rejection', event.reason);
	};

	window.addEventListener('error', onError);
	window.addEventListener('unhandledrejection', onRejection);
	return () => {
		window.removeEventListener('error', onError);
		window.removeEventListener('unhandledrejection', onRejection);
	};
}
