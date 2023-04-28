import { booleanArg, objectType } from "nexus"

import { BAIexercises } from "../config/courseConfig"

export const ProgressExtra = objectType({
  name: "ProgressExtra",
  definition(t) {
    t.nonNull.list.nonNull.field("tiers", { type: "TierInfo" })
    t.nonNull.list.nonNull.field("exercises", { type: "TierProgress" })
    t.nonNull.boolean("projectCompletion")
    t.int("highestTier")
    t.nonNull.float("n_points")
    t.nonNull.float("max_points")
    t.nonNull.float("pointsPercentage")
    t.nonNull.float("pointsNeededPercentage")
    t.nonNull.float("exercisePercentage")
    t.nonNull.float("exercisesNeededPercentage")
    t.nonNull.float("pointsNeeded")
    t.nonNull.int("totalExerciseCount")
    t.nonNull.int("totalExerciseCompletions")
    t.nonNull.int("totalExerciseCompletionsNeeded")
  },
})

export const TierInfo = objectType({
  name: "TierInfo",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("name")
    t.nonNull.int("tier")
    t.nonNull.boolean("hasTier")
    t.nonNull.int("requiredByTier")
    t.nonNull.int("missingFromTier")
    t.nonNull.float("exercisePercentage")
    t.nonNull.float("exercisesNeededPercentage")
    t.nonNull.int("exerciseCompletions")
    t.nonNull.int("exerciseCount")
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
    t.field("exercise", { type: "Exercise" })
    t.id("exercise_id")

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
      args: {
        completed: booleanArg(),
        attempted: booleanArg(),
      },
      resolve: async (
        { custom_id, user_id },
        { completed, attempted },
        ctx,
      ) => {
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

        return ctx.prisma.exerciseCompletion.findMany({
          where: {
            exercise: { custom_id: { in: exerciseCustomIds } },
            user_id,
            ...(completed && { completed: true }),
            ...(attempted && { attempted: true }),
          },
          orderBy: [
            {
              timestamp: "desc",
            },
            { updated_at: "desc" },
          ],
        })
      },
    })

    t.field("service", {
      type: "Service",
      resolve: async ({ exercise }, _, ctx) => {
        if (!exercise?.service_id) {
          return null
        }
        return ctx.prisma.service.findUnique({
          where: {
            id: exercise.service_id,
          },
        })
      },
    })

    t.field("service_id", {
      type: "String",
      resolve: ({ exercise }) => {
        return exercise?.service_id ?? null
      },
    })

    t.field("course", {
      type: "Course",
      resolve: async ({ exercise }, _, ctx) => {
        if (!exercise?.course_id) {
          return null
        }
        return ctx.prisma.course.findUnique({
          where: {
            id: exercise.course_id,
          },
        })
      },
    })

    t.field("course_id", {
      type: "String",
      resolve: ({ exercise }) => {
        return exercise?.course_id ?? null
      },
    })
  },
})
