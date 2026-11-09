import { createGameStorage } from '@arcade/lib-storage';
import { MemoryStorageDriver } from '@arcade/lib-storage/drivers/memoryDriver';
import type { User as FirebaseUser } from 'firebase/auth';
import { beforeEach, describe, expect, it } from 'vitest';
import { CloudAdapter, mapFirebaseUserToProfile } from '../internal/adapters/cloudAdapter.js';
import { LocalAdapter } from '../internal/adapters/localAdapter.js';
import {
	DEFAULT_PLAYER_AVATAR,
	DEFAULT_PLAYER_NAME,
	MAX_DISPLAY_NAME_LENGTH,
	type PlayerAvatar,
	type PlayerProfile,
	hydratePlayerProfile,
	isValidSingleGraphemeEmoji,
	resolveCurrentDataTier,
	sanitizeDisplayName,
	sanitizePlayerAvatar,
	serializePlayerProfile,
} from '../types.js';

describe('Player Profile Domain & Storage Adapters', () => {
	describe('resolveCurrentDataTier (ADR 0003)', () => {
		it('resolves Tier 1 for unauthenticated guest users regardless of consent', () => {
			expect(resolveCurrentDataTier(false, false, false)).toBe(1);
			expect(resolveCurrentDataTier(false, true, false)).toBe(1);
			expect(resolveCurrentDataTier(false, true, true)).toBe(1);
			expect(resolveCurrentDataTier(false, false, true)).toBe(1);
		});

		it('resolves Tier 2 for authenticated users with cloud sync disabled', () => {
			expect(resolveCurrentDataTier(true, false, false)).toBe(2);
			expect(resolveCurrentDataTier(true, false, true)).toBe(2);
		});

		it('resolves Tier 3 for authenticated users with cloud sync enabled and public consent disabled', () => {
			expect(resolveCurrentDataTier(true, true, false)).toBe(3);
		});

		it('resolves Tier 4 for authenticated users with cloud sync and public consent both enabled', () => {
			expect(resolveCurrentDataTier(true, true, true)).toBe(4);
		});
	});

	describe('Domain Sanitization & Validation', () => {
		describe('sanitizeDisplayName', () => {
			it('trims leading and trailing whitespace', () => {
				expect(sanitizeDisplayName('   RetroHero   ')).toBe('RetroHero');
			});

			it(`enforces maximum ${MAX_DISPLAY_NAME_LENGTH} character limit`, () => {
				const overlong = 'SuperMegaUltraArcadeChampion2026';
				expect(overlong.length).toBeGreaterThan(24);
				const sanitized = sanitizeDisplayName(overlong);
				expect(sanitized.length).toBe(MAX_DISPLAY_NAME_LENGTH);
				expect(sanitized).toBe('SuperMegaUltraArcadeCham');
			});

			it('defaults gracefully to fallback when displayName is empty, whitespace, null, or undefined', () => {
				expect(sanitizeDisplayName('')).toBe(DEFAULT_PLAYER_NAME);
				expect(sanitizeDisplayName('    ')).toBe(DEFAULT_PLAYER_NAME);
				expect(sanitizeDisplayName(null)).toBe(DEFAULT_PLAYER_NAME);
				expect(sanitizeDisplayName(undefined)).toBe(DEFAULT_PLAYER_NAME);
			});

			it('accepts custom fallback name', () => {
				expect(sanitizeDisplayName('', 'Guest')).toBe('Guest');
				expect(sanitizeDisplayName(null, 'Guest')).toBe('Guest');
			});
		});

		describe('isValidSingleGraphemeEmoji', () => {
			it('validates standard single-grapheme emojis', () => {
				expect(isValidSingleGraphemeEmoji('👾')).toBe(true);
				expect(isValidSingleGraphemeEmoji('🎮')).toBe(true);
				expect(isValidSingleGraphemeEmoji('🕹️')).toBe(true);
				expect(isValidSingleGraphemeEmoji('🚀')).toBe(true);
			});

			it('rejects multi-grapheme strings, words, or empty inputs', () => {
				expect(isValidSingleGraphemeEmoji('')).toBe(false);
				expect(isValidSingleGraphemeEmoji('   ')).toBe(false);
				expect(isValidSingleGraphemeEmoji(null)).toBe(false);
				expect(isValidSingleGraphemeEmoji(123)).toBe(false);
				expect(isValidSingleGraphemeEmoji('👾🎮')).toBe(false);
				expect(isValidSingleGraphemeEmoji('alien')).toBe(false);
			});
		});

		describe('sanitizePlayerAvatar', () => {
			it('returns sanitized avatar when valid single grapheme emoji is provided', () => {
				const avatar: PlayerAvatar = { type: 'emoji', value: '🎮' };
				expect(sanitizePlayerAvatar(avatar)).toEqual({ type: 'emoji', value: '🎮' });
			});

			it('falls back to DEFAULT_PLAYER_AVATAR when avatar object is missing or invalid', () => {
				expect(sanitizePlayerAvatar(null)).toEqual(DEFAULT_PLAYER_AVATAR);
				expect(sanitizePlayerAvatar(undefined)).toEqual(DEFAULT_PLAYER_AVATAR);
				expect(sanitizePlayerAvatar({ type: 'emoji', value: '' })).toEqual(DEFAULT_PLAYER_AVATAR);
				expect(sanitizePlayerAvatar({ type: 'url', value: 'https://img.png' })).toEqual(DEFAULT_PLAYER_AVATAR);
				expect(sanitizePlayerAvatar('not-an-object')).toEqual(DEFAULT_PLAYER_AVATAR);
			});
		});
	});

	describe('Serialization & Deserialization', () => {
		const baseProfile: PlayerProfile = {
			id: 'player_123',
			displayName: '  ArcadeGamer  ',
			avatar: { type: 'emoji', value: '🎮' },
			storageMode: 'local',
			createdAt: 1700000000000,
			updatedAt: 1700000050000,
		};

		it('serializes PlayerProfile with normalized fields', () => {
			const serialized = serializePlayerProfile(baseProfile);
			expect(serialized.displayName).toBe('ArcadeGamer');
			expect(serialized.avatar).toEqual({ type: 'emoji', value: '🎮' });
			expect(serialized.updatedAt).toBe(1700000050000);
		});

		it('hydrates legacy stored raw data lacking avatar and updatedAt without throwing', () => {
			const legacyRaw = {
				id: 'player_legacy_456',
				displayName: 'LegacyUser',
				storageMode: 'local',
				createdAt: 1650000000000,
			};

			const hydrated = hydratePlayerProfile(legacyRaw);

			expect(hydrated.id).toBe('player_legacy_456');
			expect(hydrated.displayName).toBe('LegacyUser');
			expect(hydrated.avatar).toEqual(DEFAULT_PLAYER_AVATAR);
			expect(hydrated.updatedAt).toBe(1650000000000);
			expect(hydrated.storageMode).toBe('local');
		});

		it('hydrates legacy stored raw data with empty displayName and corrupted avatar gracefully', () => {
			const corruptedRaw = {
				id: 'player_corrupted',
				displayName: '    ',
				avatar: { type: 'invalid', value: 'bad' },
				storageMode: 'local',
			};

			const hydrated = hydratePlayerProfile(corruptedRaw);

			expect(hydrated.displayName).toBe(DEFAULT_PLAYER_NAME);
			expect(hydrated.avatar).toEqual(DEFAULT_PLAYER_AVATAR);
			expect(typeof hydrated.createdAt).toBe('number');
			expect(typeof hydrated.updatedAt).toBe('number');
		});
	});

	describe('LocalAdapter Serialization & Legacy Fallbacks', () => {
		let memoryDriver: MemoryStorageDriver;
		let adapter: LocalAdapter;

		beforeEach(() => {
			memoryDriver = new MemoryStorageDriver();
			const storage = createGameStorage('user', { driver: memoryDriver });
			adapter = new LocalAdapter(storage);
		});

		it('persists and hydrates a full PlayerProfile including custom avatar', async () => {
			const profile: PlayerProfile = {
				id: 'player_test_789',
				displayName: 'PixelWizard',
				avatar: { type: 'emoji', value: '🕹️' },
				storageMode: 'local',
				createdAt: 1700000000000,
				updatedAt: 1700000100000,
			};

			await adapter.saveProfile(profile);
			const retrieved = await adapter.getProfile();

			expect(retrieved).not.toBeNull();
			expect(retrieved?.id).toBe(profile.id);
			expect(retrieved?.displayName).toBe('PixelWizard');
			expect(retrieved?.avatar).toEqual({ type: 'emoji', value: '🕹️' });
			expect(retrieved?.updatedAt).toBe(1700000100000);
		});

		it('verifies strict ADR 012 key namespacing under arcade::user::*', async () => {
			const profile: PlayerProfile = {
				id: 'test_ns',
				displayName: 'NamespacedUser',
				avatar: DEFAULT_PLAYER_AVATAR,
				storageMode: 'local',
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			await adapter.saveProfile(profile);
			await adapter.setStorageMode('local');

			const allKeys = await memoryDriver.getAllKeys();
			expect(allKeys).toContain('arcade::user::profile');
			expect(allKeys).toContain('arcade::user::storage_mode');
		});

		it('gracefully hydrates legacy profile in storage lacking avatar field', async () => {
			// Manually seed legacy data lacking avatar into the namespaced storage key
			const legacyData = JSON.stringify({
				id: 'legacy_guest_999',
				displayName: 'RetroChampion',
				storageMode: 'local',
				createdAt: 1680000000000,
			});
			await memoryDriver.setItem('arcade::user::profile', legacyData);

			const hydrated = await adapter.getProfile();

			expect(hydrated).not.toBeNull();
			expect(hydrated?.id).toBe('legacy_guest_999');
			expect(hydrated?.displayName).toBe('RetroChampion');
			// Avatar must default to DEFAULT_PLAYER_AVATAR without throwing
			expect(hydrated?.avatar).toEqual(DEFAULT_PLAYER_AVATAR);
			expect(hydrated?.updatedAt).toBe(1680000000000);
		});

		it('creates guest profile initialized with default avatar and updatedAt', async () => {
			const guest = await adapter.createGuestProfile();

			expect(guest.id).toMatch(/^guest_/);
			expect(guest.displayName).toBe('Guest');
			expect(guest.avatar).toEqual(DEFAULT_PLAYER_AVATAR);
			expect(guest.storageMode).toBe('local');
			expect(typeof guest.createdAt).toBe('number');
			expect(typeof guest.updatedAt).toBe('number');
			expect(guest.createdAt).toBe(guest.updatedAt);
		});
	});

	describe('CloudAdapter Fallback Handling', () => {
		const mockFirebaseUser: FirebaseUser = {
			uid: 'cloud_user_101',
			displayName: 'FirebaseName',
			email: 'player@arcade.com',
			photoURL: 'https://arcade.com/pfp.png',
			isAnonymous: false,
			metadata: {
				creationTime: '2026-01-01T12:00:00Z',
			},
		} as unknown as FirebaseUser;

		it('maps Firebase user with legacy Firestore document lacking avatar', () => {
			const legacyFirestoreDoc = {
				displayName: 'LegacyCloudHero',
			};

			const mapped = mapFirebaseUserToProfile(mockFirebaseUser, legacyFirestoreDoc);

			expect(mapped.id).toBe('cloud_user_101');
			expect(mapped.displayName).toBe('LegacyCloudHero');
			expect(mapped.avatar).toEqual(DEFAULT_PLAYER_AVATAR);
			expect(mapped.storageMode).toBe('cloud');
			expect(typeof mapped.updatedAt).toBe('number');
		});

		it('maps Firebase user with overlong displayName in Firestore document', () => {
			const firestoreDoc = {
				displayName: 'ThisDisplayNameIsWayTooLongForArcadeMonorepo',
				avatar: { type: 'emoji' as const, value: '🚀' },
			};

			const mapped = mapFirebaseUserToProfile(mockFirebaseUser, firestoreDoc);

			expect(mapped.displayName.length).toBe(MAX_DISPLAY_NAME_LENGTH);
			expect(mapped.avatar).toEqual({ type: 'emoji', value: '🚀' });
		});

		it('falls back to default avatar and player name when firestoreData is null', () => {
			const anonFirebaseUser: FirebaseUser = {
				uid: 'cloud_anon_202',
				displayName: null,
				email: null,
				photoURL: null,
				isAnonymous: true,
				metadata: { creationTime: '2026-01-01T12:00:00Z' },
			} as unknown as FirebaseUser;

			const mapped = mapFirebaseUserToProfile(anonFirebaseUser, null);

			expect(mapped.displayName).toBe('Guest');
			expect(mapped.avatar).toEqual(DEFAULT_PLAYER_AVATAR);
			expect(mapped.storageMode).toBe('cloud');
		});
	});
});
