import type {
	AchievementDefinition,
	AchievementEvaluationContext,
	GameId,
	MedalProgress,
	MedalTier,
	MedalUnlock,
} from '../types/index.js';

const TIER_ORDER: Record<MedalTier, number> = {
	bronze: 1,
	silver: 2,
	gold: 3,
};

export function evaluateMedals<G extends GameId>(
	context: AchievementEvaluationContext<G>,
	definitions: readonly AchievementDefinition<G>[],
	now: number,
): {
	newlyUnlocked: MedalUnlock[];
	updatedProgress: Record<string, MedalProgress>;
} {
	const newlyUnlocked: MedalUnlock[] = [];
	const updatedProgress: Record<string, MedalProgress> = { ...context.priorState.medalProgress };

	for (const def of definitions) {
		const isLadder = def.type === 'ladder';

		if (isLadder) {
			const priorUnlock = context.priorState.unlockedMedals[def.id];
			const priorTier = priorUnlock?.tier ?? null;
			const priorLevel = priorTier ? TIER_ORDER[priorTier] : 0;

			const evalResult = def.evaluate(context);

			const currentTier = evalResult.currentTier ?? (evalResult.unlocked ? (def.tier ?? 'bronze') : null);
			const currentLevel = currentTier ? TIER_ORDER[currentTier] : 0;

			const currentProgress = evalResult.currentProgress ?? evalResult.progress ?? 0;
			const nextThreshold =
				evalResult.nextThreshold !== undefined
					? evalResult.nextThreshold
					: currentTier === 'gold'
						? null
						: (evalResult.target ?? null);

			const bronzeUnlocked = currentLevel >= 1 || Boolean(evalResult.bronzeUnlocked);
			const silverUnlocked = currentLevel >= 2 || Boolean(evalResult.silverUnlocked);
			const goldUnlocked = currentLevel >= 3 || Boolean(evalResult.goldUnlocked);

			const target = nextThreshold ?? def.thresholds?.gold ?? evalResult.target ?? currentProgress;

			updatedProgress[def.id] = {
				current: currentProgress,
				target,
				currentProgress,
				currentTier,
				nextThreshold,
				bronzeUnlocked,
				silverUnlocked,
				goldUnlocked,
			};

			if (currentLevel > priorLevel && currentTier !== null) {
				newlyUnlocked.push({
					id: def.id,
					tier: currentTier,
					unlockedAt: now,
				});
			}
		} else {
			const alreadyUnlocked = Boolean(context.priorState.unlockedMedals[def.id]);
			if (alreadyUnlocked) {
				continue;
			}

			const evalResult = def.evaluate(context);

			if (evalResult.progress !== undefined && evalResult.target !== undefined) {
				updatedProgress[def.id] = {
					current: Math.min(evalResult.progress, evalResult.target),
					target: evalResult.target,
					currentProgress: evalResult.progress,
					currentTier: evalResult.unlocked ? def.tier : null,
					nextThreshold: evalResult.target,
					bronzeUnlocked: def.tier === 'bronze' && Boolean(evalResult.unlocked),
					silverUnlocked: def.tier === 'silver' && Boolean(evalResult.unlocked),
					goldUnlocked: def.tier === 'gold' && Boolean(evalResult.unlocked),
				};
			}

			if (evalResult.unlocked) {
				newlyUnlocked.push({
					id: def.id,
					tier: def.tier,
					unlockedAt: now,
				});
			}
		}
	}

	return { newlyUnlocked, updatedProgress };
}

export const evaluateAchievements = evaluateMedals;
