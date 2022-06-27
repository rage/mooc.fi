import { Course, User } from "@prisma/client"
import { range } from "lodash"

import {
  BAIbadge,
  BAIexercises,
  BAITierNames,
  BAItiers,
  exerciseCompletionsNeeded,
  pointsNeeded,
  requiredByTier,
} from "../../../../config/courseConfig"
import { KafkaContext } from "../kafkaContext"
import { ExerciseCompletionPart, TierProgress } from "./interfaces"
import {
  createCompletion,
  getExerciseCompletionsForCourses,
} from "./userFunctions"

const checkBAIProjectCompletion = async (
  user: User,
  { knex }: KafkaContext,
) => {
  const exerciseCompletions = await knex("exercise_completion")
    .select("exercise_completion.completed")
    .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
    .whereIn("exercise.custom_id", Object.keys(BAIbadge))
    .andWhere("exercise_completion.user_id", user.id)
    .andWhere("exercise_completion.completed", true)

  return exerciseCompletions.length > 0
}

interface CheckBAICompletion {
  user: User
  course: Course
  context: KafkaContext
}

export const checkBAICompletion = async ({
  user,
  course,
  context,
}: CheckBAICompletion) => {
  const { logger, prisma } = context

  const handler =
    (await prisma.course
      .findUnique({
        where: {
          id: course.id,
        },
      })
      .completions_handled_by()) ?? course

  logger.info("Getting exercise completions")
  const exerciseCompletionsForCourses = await getExerciseCompletionsForCourses({
    user,
    courseIds: Object.values(BAItiers), // tierCourses,
    context,
  })
  /*
    [{ course_id, exercise_id, n_points }...] for all the tiers
  */

  logger.info("Getting project completion")
  const projectCompletion = await checkBAIProjectCompletion(user, context)

  logger.info("Getting BAI course progress")
  const { progress: newProgress, highestTier } = getBAIProgress(
    projectCompletion,
    exerciseCompletionsForCourses,
  )

  const existingProgresses = await prisma.course
    .findUnique({
      where: { id: course.id },
    })
    .user_course_progresses({
      where: {
        user_id: user.id,
      },
      orderBy: { created_at: "asc" },
    })

  if (existingProgresses.length < 1) {
    logger.info("No existing progress found, creating new...")
    await prisma.userCourseProgress.create({
      data: {
        course: {
          connect: { id: course.id },
        },
        user: { connect: { id: user.id } },
        ...newProgress,
      },
    })
  } else {
    logger.info("Updating existing progress")
    await prisma.userCourseProgress.update({
      where: {
        id: existingProgresses[0].id,
      },
      data: newProgress,
    })
    if (existingProgresses.length > 1) {
      logger?.info("Pruning duplicate progresses")
      await prisma.userCourseProgress.deleteMany({
        where: {
          id: { in: existingProgresses.slice(1).map((ucp) => ucp.id) },
        },
      })
    }
  }

  if (highestTier < 1) {
    return
  }

  logger.info("Creating completion")

  const highestTierCourse = await prisma.course.findUnique({
    where: {
      id: BAItiers[highestTier],
    },
  })

  await createCompletion({
    user,
    course: highestTierCourse ?? course,
    handler,
    context,
    tier: highestTier,
  })
}

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

interface Rules {
  totalExerciseCompletions: number
  n_points: number
  points_needed: number
  exercise_completions_needed: number
}

export const getRules = ({
  totalExerciseCompletions,
  n_points,
  points_needed,
  exercise_completions_needed,
}: Rules) => {
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

interface GetProgress {
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
}: GetProgress) => {
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

  const { hasBasicRule } = getRules({
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
