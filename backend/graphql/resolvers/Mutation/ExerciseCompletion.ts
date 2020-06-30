import { intArg, idArg, arg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addExerciseCompletion", {
      type: "exercise_completion",
      args: {
        n_points: intArg(),
        exercise: idArg(),
        user: idArg(),
        timestamp: arg({ type: "DateTime" }),
      },
      resolve: (_, args, ctx) => {
        const { n_points, exercise, user, timestamp } = args

        return ctx.db.exercise_completion.create({
          data: {
            n_points,
            exercise: exercise ? { connect: { id: exercise } } : undefined,
            user: user ? { connect: { id: user } } : undefined,
            timestamp,
          },
        })
      },
    })
  },
})
