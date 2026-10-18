import type {
	AchievementDefinition,
	AchievementEvaluationContext,
	GameId,
	MedalProgress,
	MedalUnlock,
} from '../types/index.js';

export function evaluateAchievements<G extends GameId>(
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
		const alreadyUnlocked = Boolean(context.priorState.unlockedMedals[def.id]);
		if (alreadyUnlocked) {
			continue;
		}

		const evalResult = def.evaluate(context);

		if (evalResult.progress !== undefined && evalResult.target !== undefined) {
			updatedProgress[def.id] = {
				current: Math.min(evalResult.progress, evalResult.target),
				target: evalResult.target,
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

	return { newlyUnlocked, updatedProgress };
}
