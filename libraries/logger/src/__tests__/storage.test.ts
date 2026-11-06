import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { serializeError } from '../logger.js';
import { getLogsByTimeRange } from '../management.js';
import { addLogEntry, clearLogStore, pruneStaleLogs, resetDatabaseConnection } from '../storage.js';
import type { LogEntry } from '../types.js';

const HOUR = 3_600_000;
const entry = (ageMs: number, message: string): LogEntry => ({
	timestamp: Date.now() - ageMs,
	level: 'info',
	source: 'test',
	message,
});

describe('storage', () => {
	beforeEach(async () => {
		await clearLogStore();
	});
	afterEach(async () => {
		await resetDatabaseConnection();
		indexedDB.deleteDatabase('arcade_diagnostics');
	});

	it('pruneStaleLogs removes entries older than the retention window', async () => {
		await addLogEntry(entry(8 * 24 * HOUR, 'old'));
		await addLogEntry(entry(HOUR, 'fresh'));
		expect(await pruneStaleLogs(7)).toBe(1);
		const remaining = await getLogsByTimeRange('all');
		expect(remaining.map((e) => e.message)).toEqual(['fresh']);
	});

	it('getLogsByTimeRange filters by range', async () => {
		await addLogEntry(entry(30 * 60_000, 'recent'));
		await addLogEntry(entry(5 * HOUR, 'mid'));
		await addLogEntry(entry(2 * 24 * HOUR, 'older'));
		expect((await getLogsByTimeRange('1h')).map((e) => e.message)).toEqual(['recent']);
		expect((await getLogsByTimeRange('12h')).map((e) => e.message)).toEqual(['mid', 'recent']);
		expect(await getLogsByTimeRange('24h')).toHaveLength(2);
		expect(await getLogsByTimeRange('3d')).toHaveLength(3);
		expect(await getLogsByTimeRange('all')).toHaveLength(3);
	});

	it('resolves gracefully when IndexedDB is unavailable', async () => {
		await resetDatabaseConnection();
		vi.stubGlobal('indexedDB', undefined);
		await expect(addLogEntry(entry(0, 'x'))).resolves.toBeUndefined();
		expect(await pruneStaleLogs()).toBe(0);
		expect(await getLogsByTimeRange('all')).toEqual([]);
		vi.unstubAllGlobals();
		await resetDatabaseConnection();
	});
});

describe('serializeError', () => {
	it('handles Error instances', () => {
		const result = serializeError(new TypeError('boom'));
		expect(result?.name).toBe('TypeError');
		expect(result?.message).toBe('boom');
		expect(result?.stack).toBeTypeOf('string');
	});
	it('handles strings, objects and primitives', () => {
		expect(serializeError('oops')).toEqual({ name: 'Error', message: 'oops' });
		expect(serializeError({ code: 5 })).toEqual({ name: 'UnknownError', message: '{"code":5}' });
		expect(serializeError(42)).toEqual({ name: 'Error', message: '42' });
		expect(serializeError(undefined)).toBeUndefined();
	});
});
