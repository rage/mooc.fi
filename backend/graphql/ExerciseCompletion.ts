import { schema } from "nexus"

import { isAdmin } from "../accessControl"

schema.objectType({
  name: "ExerciseCompletion",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.exercise_id()
    t.model.exercise()
    t.model.completed()
    t.model.n_points()
    t.model.timestamp()
    t.model.user_id()
    t.model.user()
    t.model.exercise_completion_required_actions()
  },
})

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("exerciseCompletion", {
      type: "ExerciseCompletion",
      args: {
        id: schema.idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) =>
        ctx.db.exerciseCompletion.findOne({
          where: { id },
        }),
    })

    t.crud.exerciseCompletions({
      ordering: true,
      authorize: isAdmin,
    })

    /*t.list.field("exerciseCompletions", {
      type: "exercise_completion",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.exercise_completion.findMany()
      },
    })*/
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addExerciseCompletion", {
      type: "ExerciseCompletion",
      args: {
        n_points: schema.intArg(),
        exercise: schema.idArg(),
        user: schema.idArg(),
        timestamp: schema.arg({ type: "DateTime" }),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { n_points, exercise, user, timestamp } = args

        return ctx.db.exerciseCompletion.create({
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
