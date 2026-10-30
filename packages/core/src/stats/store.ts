export {
	STATS_UPDATED_EVENT,
	AGGREGATED_STATS_STORAGE_KEY,
	DEFAULT_REGISTERED_GAMES,
	createInitialAggregatedGameStats,
	updateAggregatedGameStats,
	getGameStats,
	recordGameSession,
	getGlobalStats,
	subscribeToStatsUpdated,
} from '../../../../libraries/storage/src/stats/store.js';
