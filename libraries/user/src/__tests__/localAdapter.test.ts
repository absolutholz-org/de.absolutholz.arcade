import { createGameStorage } from '@arcade/lib-storage';
import { MemoryStorageDriver } from '@arcade/lib-storage/drivers/memoryDriver';
import { beforeEach, describe, expect, it } from 'vitest';
import { LocalAdapter } from '../internal/adapters/localAdapter.js';
import type { UserProfile } from '../types.js';

describe('LocalAdapter', () => {
	let memoryDriver: MemoryStorageDriver;
	let adapter: LocalAdapter;

	beforeEach(() => {
		memoryDriver = new MemoryStorageDriver();
		const storage = createGameStorage('user-test', { driver: memoryDriver });
		adapter = new LocalAdapter(storage);
	});

	it('returns null when no profile has been saved', async () => {
		const profile = await adapter.getProfile();
		expect(profile).toBeNull();
	});

	it('creates and persists a guest profile with local storage mode', async () => {
		const guest = await adapter.createGuestProfile();

		expect(guest.id).toMatch(/^guest_/);
		expect(guest.displayName).toBe('Guest');
		expect(guest.storageMode).toBe('local');
		expect(typeof guest.createdAt).toBe('number');

		const stored = await adapter.getProfile();
		expect(stored).toEqual(guest);
	});

	it('getOrCreateGuestProfile returns existing profile if one exists', async () => {
		const created = await adapter.createGuestProfile();
		const fetched = await adapter.getOrCreateGuestProfile();

		expect(fetched).toEqual(created);
	});

	it('getOrCreateGuestProfile creates new profile if none exists', async () => {
		const fetched = await adapter.getOrCreateGuestProfile();

		expect(fetched.id).toMatch(/^guest_/);
		expect(fetched.displayName).toBe('Guest');
		expect(fetched.storageMode).toBe('local');
	});

	it('updates and persists modifications to user profile', async () => {
		const guest = await adapter.createGuestProfile();
		const updatedProfile: UserProfile = {
			...guest,
			displayName: 'RetroGamer',
		};

		await adapter.saveProfile(updatedProfile);
		const result = await adapter.getProfile();

		expect(result).not.toBeNull();
		expect(result?.displayName).toBe('RetroGamer');
		expect(result?.id).toBe(guest.id);
	});

	it('clears stored profile', async () => {
		await adapter.createGuestProfile();
		expect(await adapter.getProfile()).not.toBeNull();

		await adapter.clearProfile();
		expect(await adapter.getProfile()).toBeNull();
	});

	it('persists and retrieves storage mode preference', async () => {
		expect(await adapter.getStorageMode()).toBeNull();

		await adapter.setStorageMode('cloud');
		expect(await adapter.getStorageMode()).toBe('cloud');

		await adapter.setStorageMode('local');
		expect(await adapter.getStorageMode()).toBe('local');
	});
});
