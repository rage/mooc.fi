import { objectType } from "nexus"

import { BAIexercises } from "../config/courseConfig"

export const ProgressExtra = objectType({
  name: "ProgressExtra",
  definition(t) {
    t.nonNull.list.nonNull.field("tiers", { type: "TierInfo" })
    t.nonNull.list.nonNull.field("exercises", { type: "TierProgress" })
    t.nonNull.boolean("projectCompletion")
    t.int("highestTier")
    t.nonNull.int("totalExerciseCompletions")
  },
})

export const TierInfo = objectType({
  name: "TierInfo",
  definition(t) {
    t.nonNull.int("tier")
    t.boolean("hasTier")
    t.int("requiredByTier")
    t.int("missingFromTier")
    t.int("exerciseCompletions")
    t.int("exerciseCount")
  },
})

export const TierProgress = objectType({
  name: "TierProgress",
  definition(t) {
    t.nonNull.int("exercise_number")
    t.nonNull.int("tier")
    t.nonNull.float("n_points")
    t.nonNull.float("max_points")
    t.nonNull.float("progress")
    t.string("custom_id")
    t.nonNull.string("user_id")

    t.field("name", {
      type: "String",
      resolve: async ({ custom_id }) => {
        if (!custom_id) {
          return null
        }
        return BAIexercises[custom_id]?.title ?? null
      },
    })

    t.list.nonNull.field("exercise_completions", {
      type: "ExerciseCompletion",
      resolve: async ({ custom_id, user_id }, _, ctx) => {
        if (!custom_id || !user_id) {
          return null
        }

        const baiExercise = BAIexercises[custom_id]

        if (!baiExercise) {
          return null
        }

        const exerciseCustomIds = Object.entries(BAIexercises)
          .filter(([_, exercise]) => exercise.exercise === baiExercise.exercise)
          .map(([id, _]) => id)

        if (exerciseCustomIds.length === 0) {
          return null
        }

        const completions = await ctx.prisma.exerciseCompletion.findMany({
          where: {
            exercise: { custom_id: { in: exerciseCustomIds } },
            user_id,
          },
          orderBy: [
            {
              timestamp: "desc",
            },
            { updated_at: "desc" },
          ],
        })

        return completions
      },
    })

    t.field("exercise", {
      type: "Exercise",
      resolve: async ({ custom_id }, _, ctx) => {
        if (!custom_id) {
          return null
        }
        return ctx.prisma.exercise.findFirst({
          where: {
            custom_id,
          },
        })
      },
    })
  },
})
