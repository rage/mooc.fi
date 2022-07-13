import { arg, extendType, idArg, intArg, nonNull, objectType } from "nexus"

import { isAdmin } from "../accessControl"

export const ExerciseCompletion = objectType({
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
    t.model.attempted()
  },
})

export const ExerciseCompletionQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("exerciseCompletion", {
      type: "ExerciseCompletion",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) =>
        await ctx.prisma.exerciseCompletion.findUnique({
          where: { id },
        }),
    })

    // probably only used for type generation
    t.crud.exerciseCompletions({
      ordering: true,
      authorize: isAdmin,
      resolve: async (root, args, ctx, info, originalResolve) => {
        return originalResolve(
          root,
          {
            ...args,
            // TODO: _does_ this really work?
            // @ts-ignore: not typed correctly, works
            distinct: ["exercise_id", "user_id"],
            orderBy: [{ timestamp: "desc" }, { updated_at: "desc" }],
          },
          ctx,
          info,
        )
      },
    })

    /*t.list.field("exerciseCompletions", {
      type: "exercise_completion",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.prisma.exercise_completion.findMany()
      },
    })*/
  },
})

export const ExerciseCompletionMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addExerciseCompletion", {
      type: "ExerciseCompletion",
      args: {
        n_points: intArg(),
        exercise: idArg(),
        user: idArg(),
        timestamp: arg({ type: "DateTime" }),
        original_submission_date: arg({ type: "DateTime" }),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const {
          n_points,
          exercise,
          user,
          timestamp,
          original_submission_date,
        } = args

        return ctx.prisma.exerciseCompletion.create({
          data: {
            n_points,
            exercise: exercise ? { connect: { id: exercise } } : undefined,
            user: user ? { connect: { id: user } } : undefined,
            timestamp,
            original_submission_date,
          },
        })
      },
    })
  },
})
