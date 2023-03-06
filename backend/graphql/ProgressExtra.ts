import { objectType } from "nexus"

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
