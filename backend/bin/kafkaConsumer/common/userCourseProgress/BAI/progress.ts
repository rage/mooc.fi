import { range } from "lodash"

import {
  BAIexercises,
  BAITierNames,
  BAItiers,
  exerciseCompletionsNeeded,
  pointsNeeded,
  requiredByTier,
} from "../../../../../config/courseConfig"
import { ExerciseCompletionPart, TierProgress } from "../interfaces"

interface TierProgressGroup {
  group: string
  tier: number
  max_points: number
  n_points: number
  progress: number
}

export type TierProgressMap = Record<number, TierProgress>

interface Progress {
  total_n_points: number
  total_max_points: number
}

export const getTierProgress = (
  exerciseCompletionsForCourses: ExerciseCompletionPart[],
) => {
  const tierProgressMap = exerciseCompletionsForCourses.reduce((acc, curr) => {
    const { exercise, tier } = BAIexercises[curr.custom_id ?? ""] ?? {}

    if (!exercise) return acc

    const max_points = curr.max_points || 0
    const n_points = Math.max(acc[exercise]?.n_points || 0, curr.n_points || 0)

    return {
      ...acc,
      [exercise]: {
        tier: Math.max(acc[exercise]?.tier || 0, tier),
        max_points,
        n_points,
        progress: n_points / (max_points || 1),
        custom_id: curr.custom_id,
      },
    }
  }, {} as TierProgressMap)
  /*
    [exercise #]: { tier, n_points, max_points } -- what's the maximum tier completed and
      what's the highest amount of points received, not necessarily from maximum tier
    ...
  */
  const tierProgress: TierProgressGroup[] = Object.entries(tierProgressMap).map(
    ([key, value]) => ({
      group: key,
      ...value,
    }),
  )

  const progress: Progress = Object.values(tierProgressMap).reduce(
    (acc, curr) => ({
      total_n_points: acc.total_n_points + curr.n_points,
      total_max_points: acc.total_max_points + curr.max_points,
    }),
    { total_n_points: 0, total_max_points: 0 },
  )

  return {
    tierProgressMap,
    tierProgress,
    progress,
  }
}

interface HasRuleConditionsArgs {
  totalExerciseCompletions: number
  n_points: number
  points_needed: number
  exercise_completions_needed: number
}

export const hasRuleConditions = ({
  totalExerciseCompletions,
  n_points,
  points_needed,
  exercise_completions_needed,
}: HasRuleConditionsArgs) => {
  const hasEnoughPoints = n_points >= points_needed //(handlerCourse.points_needed ?? 9999999)
  const hasEnoughExerciseCompletions =
    totalExerciseCompletions >= exercise_completions_needed //(handlerCourse.exercise_completions_needed ?? 0)
  const hasBasicRule = hasEnoughPoints && hasEnoughExerciseCompletions

  return {
    hasEnoughPoints,
    hasEnoughExerciseCompletions,
    hasBasicRule,
  }
}

interface GetTierInfo {
  tierProgressMap: TierProgressMap
  hasBasicRule: boolean
  required_by_tier: Record<number, number>
}

export type TierInfo = Record<
  string,
  {
    hasTier: boolean
    missingFromTier: number
    exerciseCompletions: number
  }
>

export const getTierInfo = ({
  tierProgressMap,
  hasBasicRule,
  required_by_tier,
}: GetTierInfo) => {
  const tierCompletions = range(1, 4).reduce(
    (acc, tier) => ({
      ...acc,
      [tier]: Object.values(tierProgressMap).filter((t) => t.tier >= tier)
        .length,
    }),
    {} as Record<number, number>,
  )
  /*
    [tier #]: # of exercises completed from _at least_ this tier,
      so tier 3 is counted in both 1 and 2, and so on
  */

  const hasTier: Record<number, boolean> = {
    1: hasBasicRule,
    2: hasBasicRule && tierCompletions[2] >= required_by_tier[2],
    3: hasBasicRule && tierCompletions[3] >= required_by_tier[3],
  }

  const missingFromTier = range(1, 4).reduce(
    (acc, tier) => ({
      ...acc,
      [tier]: Math.max(0, required_by_tier[tier] - tierCompletions[tier]),
    }),
    {} as Record<number, number>,
  )
  /*
    [tier #]: how many exercises missing to get to this tier
  */

  const highestTier = Object.entries(hasTier).reduce(
    (acc, [tier, has]) => (has ? Math.max(acc, Number(tier)) : acc),
    0,
  )

  const tierInfo: TierInfo = Object.keys(BAItiers)
    .map(Number)
    .reduce(
      (acc, tier) => ({
        ...acc,
        [BAITierNames[tier]]: {
          hasTier: hasTier[tier],
          missingFromTier: missingFromTier[tier],
          exerciseCompletions: tierCompletions[tier],
        },
      }),
      {},
    )

  return {
    tierInfo,
    highestTier,
  }
}

interface GetProgressArgs {
  n_points?: number | null
  max_points?: number | null
  tierInfo: TierInfo
  tierProgressMap: TierProgressMap
  projectCompletion: boolean
  highestTier: number
  totalExerciseCompletions: number
}

export const getProgress = ({
  n_points,
  max_points,
  tierInfo,
  tierProgressMap,
  projectCompletion,
  highestTier,
  totalExerciseCompletions,
}: GetProgressArgs) => {
  const pointsProgress = (n_points || 0) / (max_points || 1)
  const newProgress = {
    progress: [
      {
        group: "total",
        max_points,
        n_points,
        progress: isNaN(pointsProgress) ? 0 : pointsProgress,
      },
    ],
    extra: {
      tiers: tierInfo as any,
      exercises: tierProgressMap as any,
      projectCompletion,
      highestTier,
      totalExerciseCompletions,
    },
  }

  return newProgress
}

export const getBAIProgress = (
  projectCompletion: boolean,
  exerciseCompletionsForCourses: ExerciseCompletionPart[],
) => {
  const { progress, tierProgress, tierProgressMap } = getTierProgress(
    exerciseCompletionsForCourses,
  )

  const totalExerciseCompletions = Object.keys(tierProgress).length

  const { hasBasicRule } = hasRuleConditions({
    n_points: progress.total_n_points,
    totalExerciseCompletions,
    points_needed: pointsNeeded,
    exercise_completions_needed: exerciseCompletionsNeeded,
  })

  const { tierInfo, highestTier } = getTierInfo({
    tierProgressMap,
    hasBasicRule,
    required_by_tier: requiredByTier,
  })

  const newProgress = getProgress({
    n_points: progress.total_n_points,
    max_points: progress.total_max_points,
    tierInfo,
    tierProgressMap,
    projectCompletion,
    highestTier,
    totalExerciseCompletions,
  })

  return {
    progress: newProgress,
    highestTier,
  }
}
