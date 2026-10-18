import { saveConsentPreferences } from '@arcade/lib-consent';
import { createGameStorage } from '@arcade/lib-storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetFirebaseServices } from '../internal/firebase.js';
import { createUserService } from '../service.js';
import type { UserProfile, UserSession } from '../types.js';

// Setup in-memory localStorage for Node.js test environment
const mockStorageMap = new Map<string, string>();
const mockLocalStorage: Storage = {
	get length() {
		return mockStorageMap.size;
	},
	clear() {
		mockStorageMap.clear();
	},
	getItem(key: string) {
		return mockStorageMap.get(key) ?? null;
	},
	key(index: number) {
		return Array.from(mockStorageMap.keys())[index] ?? null;
	},
	removeItem(key: string) {
		mockStorageMap.delete(key);
	},
	setItem(key: string, value: string) {
		mockStorageMap.set(key, value);
	},
};
Object.defineProperty(globalThis, 'localStorage', {
	value: mockLocalStorage,
	writable: true,
	configurable: true,
});
Object.defineProperty(globalThis, 'window', {
	value: {
		localStorage: mockLocalStorage,
		dispatchEvent: () => true,
		addEventListener: () => {},
		removeEventListener: () => {},
	},
	writable: true,
	configurable: true,
});

// Setup shared mock state for Firebase modules
let authStateListeners: Array<(user: unknown) => void> = [];
let mockCurrentUser: {
	uid: string;
	displayName: string | null;
	email: string | null;
	photoURL: string | null;
	isAnonymous: boolean;
	metadata: { creationTime: string };
} | null = null;

let mockFirestoreDoc: Partial<UserProfile> | null = null;

vi.mock('firebase/app', () => ({
	initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })),
	getApps: vi.fn(() => []),
	getApp: vi.fn(() => ({ name: '[DEFAULT]' })),
}));

vi.mock('firebase/auth', () => ({
	getAuth: vi.fn(() => ({
		get currentUser() {
			return mockCurrentUser;
		},
	})),
	GoogleAuthProvider: vi.fn(),
	signInAnonymously: vi.fn(async () => {
		mockCurrentUser = {
			uid: 'cloud-anon-123',
			displayName: null,
			email: null,
			photoURL: null,
			isAnonymous: true,
			metadata: { creationTime: '2026-01-01T00:00:00Z' },
		};
		return { user: mockCurrentUser };
	}),
	signInWithPopup: vi.fn(async () => {
		mockCurrentUser = {
			uid: 'cloud-google-456',
			displayName: 'Cloud Player',
			email: 'player@example.com',
			photoURL: 'https://example.com/avatar.png',
			isAnonymous: false,
			metadata: { creationTime: '2026-01-01T00:00:00Z' },
		};
		return { user: mockCurrentUser };
	}),
	createUserWithEmailAndPassword: vi.fn(async (_auth: unknown, email: string) => {
		mockCurrentUser = {
			uid: 'cloud-signup-789',
			displayName: null,
			email,
			photoURL: null,
			isAnonymous: false,
			metadata: { creationTime: '2026-01-01T00:00:00Z' },
		};
		return { user: mockCurrentUser };
	}),
	signInWithEmailAndPassword: vi.fn(async (_auth: unknown, email: string) => {
		mockCurrentUser = {
			uid: 'cloud-signin-789',
			displayName: 'Existing Player',
			email,
			photoURL: null,
			isAnonymous: false,
			metadata: { creationTime: '2026-01-01T00:00:00Z' },
		};
		return { user: mockCurrentUser };
	}),
	sendPasswordResetEmail: vi.fn(async () => {}),
	signOut: vi.fn(async () => {
		mockCurrentUser = null;
	}),
	updateProfile: vi.fn(async (_user: unknown, updates: { displayName?: string }) => {
		if (mockCurrentUser && updates.displayName) {
			mockCurrentUser.displayName = updates.displayName;
		}
	}),
	onAuthStateChanged: vi.fn((_auth: unknown, callback: (user: unknown) => void) => {
		authStateListeners.push(callback);
		return () => {
			authStateListeners = authStateListeners.filter((l) => l !== callback);
		};
	}),
}));

vi.mock('firebase/firestore', () => ({
	getFirestore: vi.fn(() => ({})),
	doc: vi.fn((_db: unknown, collection: string, id: string) => ({ collection, id })),
	getDoc: vi.fn(async () => ({
		exists: () => mockFirestoreDoc !== null,
		data: () => mockFirestoreDoc,
	})),
	setDoc: vi.fn(async (_docRef: unknown, data: Partial<UserProfile>) => {
		mockFirestoreDoc = { ...mockFirestoreDoc, ...data };
	}),
	updateDoc: vi.fn(async (_docRef: unknown, updates: Partial<UserProfile>) => {
		mockFirestoreDoc = { ...mockFirestoreDoc, ...updates };
	}),
	deleteDoc: vi.fn(async () => {
		mockFirestoreDoc = null;
	}),
}));

describe('UserService & createUserService', () => {
	const firebaseConfig = {
		apiKey: 'fake-api-key',
		projectId: 'arcade-test',
	};

	beforeEach(async () => {
		vi.clearAllMocks();
		resetFirebaseServices();
		authStateListeners = [];
		mockCurrentUser = null;
		mockFirestoreDoc = null;
		saveConsentPreferences({ cloudSync: true, publicBroadcast: false, analytics: false });
		await createGameStorage('user').clear();
	});

	it('immediately invokes subscriber with initial session upon subscription', () => {
		const service = createUserService();
		const listener = vi.fn();

		service.subscribe(listener);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith({
			user: null,
			isAuthenticated: false,
			isCloudSynced: false,
		});
	});

	it('notifies subscribers when initialized with a local guest session', async () => {
		const service = createUserService({ firebaseConfig });
		const emissions: UserSession[] = [];

		service.subscribe((session) => {
			emissions.push(session);
		});

		const initialSession = await service.initialize();

		expect(initialSession.user).not.toBeNull();
		expect(initialSession.user?.displayName).toBe('Guest');
		expect(initialSession.isAuthenticated).toBe(false);
		expect(initialSession.isCloudSynced).toBe(false);

		// Subscriber received immediate state + initialized state
		expect(emissions.length).toBeGreaterThanOrEqual(2);
		const lastEmission = emissions[emissions.length - 1];
		expect(lastEmission.user?.displayName).toBe('Guest');
	});

	it('notifies subscribers on anonymous cloud sign-in transition', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		const cloudProfile = await service.signInAnonymously();

		expect(cloudProfile.id).toBe('cloud-anon-123');
		expect(cloudProfile.storageMode).toBe('cloud');

		const latest = emissions[emissions.length - 1];
		expect(latest.isAuthenticated).toBe(true);
		expect(latest.isCloudSynced).toBe(true);
		expect(latest.user?.id).toBe('cloud-anon-123');
	});

	it('notifies subscribers on Google sign-in transition', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		const profile = await service.signInWithGoogle();

		expect(profile.id).toBe('cloud-google-456');
		expect(profile.displayName).toBe('Cloud Player');

		const latest = emissions[emissions.length - 1];
		expect(latest.isAuthenticated).toBe(true);
		expect(latest.isCloudSynced).toBe(true);
		expect(latest.user?.displayName).toBe('Cloud Player');
	});

	it('notifies subscribers when updating profile display name', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		const updated = await service.updateProfile({ displayName: 'ArcadeMaster' });
		expect(updated.displayName).toBe('ArcadeMaster');

		const latest = emissions[emissions.length - 1];
		expect(latest.user?.displayName).toBe('ArcadeMaster');
	});

	it('notifies subscribers when updating profile display name for authenticated cloud user', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();
		await service.signInWithGoogle();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		const updated = await service.updateProfile({ displayName: 'Grandmaster' });
		expect(updated.displayName).toBe('Grandmaster');

		const latest = emissions[emissions.length - 1];
		expect(latest.isAuthenticated).toBe(true);
		expect(latest.isCloudSynced).toBe(true);
		expect(latest.user?.displayName).toBe('Grandmaster');
	});

	it('throws error when updating profile with empty display name', async () => {
		const service = createUserService();
		await service.initialize();

		await expect(service.updateProfile({ displayName: '   ' })).rejects.toThrow('Display name cannot be empty');
	});

	it('notifies subscribers when toggling storage mode between local and cloud', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		// Switch to cloud mode (triggers anonymous cloud login if not authenticated)
		await service.setStorageMode('cloud');
		let latest = emissions[emissions.length - 1];
		expect(latest.isCloudSynced).toBe(true);

		// Switch back to local mode
		await service.setStorageMode('local');
		latest = emissions[emissions.length - 1];
		expect(latest.isCloudSynced).toBe(false);
		expect(latest.user?.storageMode).toBe('local');
	});

	it('supports updateDisplayName method directly and persists update', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const updated = await service.updateDisplayName('DirectName');
		expect(updated.displayName).toBe('DirectName');
		expect(service.getSession().user?.displayName).toBe('DirectName');
	});

	it('persists storageMode cloud on user profile when authenticated user toggles to cloud', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();
		await service.signInWithGoogle();

		await service.setStorageMode('local');
		expect(service.getSession().user?.storageMode).toBe('local');

		await service.setStorageMode('cloud');
		const session = service.getSession();
		expect(session.isCloudSynced).toBe(true);
		expect(session.user?.storageMode).toBe('cloud');
	});

	it('notifies subscribers when signing out and reverting to local guest', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();
		await service.signInWithGoogle();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		await service.signOut();

		const latest = emissions[emissions.length - 1];
		expect(latest.isAuthenticated).toBe(false);
		expect(latest.isCloudSynced).toBe(false);
		expect(latest.user?.displayName).toBe('Guest');
		expect(latest.user?.storageMode).toBe('local');
	});

	it('cleanly disposes subscriber via returned Unsubscribe callback', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const listener = vi.fn();
		const unsubscribe = service.subscribe(listener);

		// Listener called once immediately on subscription
		expect(listener).toHaveBeenCalledTimes(1);
		listener.mockClear();

		// Dispose subscriber
		unsubscribe();

		// Perform state transitions that would normally trigger notifications
		await service.updateProfile({ displayName: 'PhantomUser' });
		await service.signInAnonymously();
		await service.signOut();

		// Listener should never have been called after unsubscribe
		expect(listener).not.toHaveBeenCalled();
	});

	it('notifies subscribers on email and password registration', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		const profile = await service.signUpWithEmail('newplayer@example.com', 'supersecret123', 'PuzzleHero');

		expect(profile.id).toBe('cloud-signup-789');
		expect(profile.displayName).toBe('PuzzleHero');
		expect(profile.email).toBe('newplayer@example.com');
		expect(profile.storageMode).toBe('cloud');

		const latest = emissions[emissions.length - 1];
		expect(latest.isAuthenticated).toBe(true);
		expect(latest.isCloudSynced).toBe(true);
		expect(latest.user?.displayName).toBe('PuzzleHero');
		expect(latest.user?.email).toBe('newplayer@example.com');
	});

	it('notifies subscribers on email and password sign-in', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		const emissions: UserSession[] = [];
		service.subscribe((session) => emissions.push(session));

		const profile = await service.signInWithEmail('existing@example.com', 'password123');

		expect(profile.id).toBe('cloud-signin-789');
		expect(profile.email).toBe('existing@example.com');
		expect(profile.storageMode).toBe('cloud');

		const latest = emissions[emissions.length - 1];
		expect(latest.isAuthenticated).toBe(true);
		expect(latest.isCloudSynced).toBe(true);
		expect(latest.user?.id).toBe('cloud-signin-789');
	});

	it('triggers password reset email dispatch via cloud adapter', async () => {
		const service = createUserService({ firebaseConfig });
		await service.initialize();

		await expect(service.sendPasswordReset('forgot@example.com')).resolves.toBeUndefined();
	});

	it('rejects email authentication operations when cloud adapter is not configured', async () => {
		const service = createUserService(); // No firebaseConfig provided
		await service.initialize();

		await expect(service.signUpWithEmail('test@example.com', 'pass')).rejects.toThrow('Email registration failed');
		await expect(service.signInWithEmail('test@example.com', 'pass')).rejects.toThrow('Email sign-in failed');
		await expect(service.sendPasswordReset('test@example.com')).rejects.toThrow('Password reset failed');
	});
});
