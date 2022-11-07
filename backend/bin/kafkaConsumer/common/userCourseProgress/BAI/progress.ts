import { range } from "lodash"

import {
  BAIexercises,
  BAITierNames,
  BAItiers,
  exerciseCompletionsNeeded,
  pointsNeeded,
  requiredByTier,
} from "../../../../../config/courseConfig"
import {
  ExerciseCompletionPart,
  TierInfo,
  TierProgressGroup,
  TierProgressMap,
  TotalProgress,
} from "../interfaces"

export const getTierProgress = (
  exerciseCompletionsForCourses: ExerciseCompletionPart[],
) => {
  /*
    [exercise #]: { tier, n_points, max_points } -- what's the maximum tier completed and
      what's the highest amount of points received, not necessarily from maximum tier
    ...
  */
  const tierProgressMap = exerciseCompletionsForCourses.reduce<TierProgressMap>(
    (acc, curr) => {
      const { exercise, tier } = BAIexercises[curr.custom_id ?? ""] ?? {}

      if (!exercise) return acc

      const max_points = curr.max_points || 0
      const n_points = Math.max(
        acc[exercise]?.n_points || 0,
        curr.n_points || 0,
      )

      return {
        ...acc,
        [String(exercise)]: {
          tier: Math.max(acc[exercise]?.tier || 0, tier || 0),
          max_points,
          n_points,
          progress: n_points / (max_points || 1),
          custom_id: curr.custom_id,
        },
      }
    },
    {},
  )

  // one entry per exercise with the highest tier and the highest amount of points
  const tierProgress = Object.entries(tierProgressMap).map<TierProgressGroup>(
    ([key, value]) => ({
      group: key,
      ...value,
    }),
  )

  const progress = Object.values(tierProgressMap).reduce<TotalProgress>(
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
  required_by_tier: Record<string, number>
}

export const getTierInfo = ({
  tierProgressMap,
  hasBasicRule,
  required_by_tier,
}: GetTierInfo) => {
  const tierCompletions = range(1, 4).reduce<Record<string, number>>(
    (acc, tier) => ({
      ...acc,
      [String(tier)]: Object.values(tierProgressMap).filter(
        (t) => t.tier >= tier,
      ).length,
    }),
    {},
  )
  /*
    [tier #]: # of exercises completed from _at least_ this tier,
      so tier 3 is counted in both 1 and 2, and so on
  */

  const hasTier: Record<string, boolean> = {
    "1": hasBasicRule,
    "2": hasBasicRule && tierCompletions["2"] >= required_by_tier["2"],
    "3": hasBasicRule && tierCompletions["3"] >= required_by_tier["3"],
  }

  const missingFromTier = range(1, 4)
    .map(String)
    .reduce<Record<string, number>>(
      (acc, tier) => ({
        ...acc,
        [tier]: Math.max(0, required_by_tier[tier] - tierCompletions[tier]),
      }),
      {},
    )
  /*
    [tier #]: how many exercises missing to get to this tier
  */

  const highestTier = Object.entries(hasTier).reduce(
    (acc, [tier, has]) => (has ? Math.max(acc, Number(tier)) : acc),
    0,
  )

  const tierInfo = Object.keys(BAItiers).reduce<TierInfo>(
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
      tiers: tierInfo,
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
