import bai from "./bai.json"

interface ExerciseInfo {
  exercise: number
  tier: number
  title: string
  course_id: string
}

type TierName = keyof typeof bai.tiers

/** Tier names in tier-number order: beginner is tier 1. */
const tierNames: TierName[] = ["beginner", "intermediate", "advanced"]

const byTier = <T>(entry: (tierName: TierName, tier: number) => [string, T]) =>
  Object.fromEntries(
    tierNames.map((tierName, index) => entry(tierName, index + 1)),
  )

/**
 * Building AI exercise custom id → its exercise number (1-based, shared across
 * tiers), tier number, title and tier course id.
 */
export const BAIexercises: Record<string, ExerciseInfo> = Object.fromEntries(
  bai.exercises.flatMap(({ title, ids }, index) =>
    Object.entries(
      byTier((tierName, tier) => [
        ids[tierName],
        {
          exercise: index + 1,
          tier,
          title,
          course_id: bai.tiers[tierName].courseId,
        },
      ]),
    ),
  ),
)

/**
 * Building AI final-task exercise custom id → the same info as `BAIexercises`,
 * numbered after the last regular exercise.
 */
export const BAIbadge: Record<string, ExerciseInfo> = byTier(
  (tierName, tier) => [
    bai.tiers[tierName].finalTaskId,
    {
      exercise: bai.exercises.length + 1,
      tier,
      title: bai.finalTaskTitle,
      course_id: bai.tiers[tierName].courseId,
    },
  ],
)

/** Building AI tier number ("1"–"3") → that tier's course id. */
export const BAItiers: Record<string, string> = byTier((tierName, tier) => [
  String(tier),
  bai.tiers[tierName].courseId,
])

export const BAITierCourses = Object.values(BAItiers)

/** Id of the Building AI course that the tier courses belong to. */
export const BAIParentCourse = bai.parentCourseId

export const BAITierNames: Record<string, string> = {
  "1": "beginner",
  "2": "intermediate",
  "3": "advanced",
}

export const BAITierNameToNumber: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

/** Number of Building AI exercises per tier, including the final task. */
export const BAIExerciseCount = bai.exercises.length + 1

export const requiredByTestTier: Record<string, number> = {
  "1": 2,
  "2": 1,
  "3": 1,
}

export const pointsTestNeeded = 2
export const exerciseTestCompletionsNeeded = 2

export const pointsNeeded = 10.5
export const exerciseCompletionsNeeded = 19

export const requiredByTier: Record<string, number> = {
  "1": 19,
  "2": 14,
  "3": 14,
}
