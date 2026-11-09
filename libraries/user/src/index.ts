export * from './types.js';
export { createUserService, getSharedUserService, resetSharedUserService } from './service.js';
export { LocalAdapter, LocalStorageAdapter } from './internal/adapters/localAdapter.js';
export {
	CloudAdapter,
	ServerSyncStorageAdapter,
	mapFirebaseUserToProfile,
} from './internal/adapters/cloudAdapter.js';
export {
	getFavoritesManager,
	resetSharedFavoritesManager,
	type FavoritesManager,
	FAVORITES_UPDATED_EVENT,
} from './favorites.js';
export { useFavorites, type UseFavoritesReturn } from './useFavorites.js';
