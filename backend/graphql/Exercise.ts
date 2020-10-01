import {
  objectType,
  extendType,
  arg,
  idArg,
  intArg,
  stringArg,
} from "@nexus/schema"
import { isAdmin } from "../accessControl"
import { filterNull } from "../util/db-functions"
import { NexusContext } from "/context"

export const Exercise = objectType({
  name: "Exercise",
  definition(t) {
    t.model.id()
    t.model.course_id()
    t.model.course()
    t.model.created_at()
    t.model.custom_id()
    t.model.deleted()
    t.model.max_points()
    t.model.name()
    t.model.part()
    t.model.section()
    t.model.service_id()
    t.model.service()
    t.model.timestamp()
    t.model.updated_at()

    // t.prismaFields({ filter: ["exercise_completions"] })

    t.field("exercise_completions", {
      type: "ExerciseCompletion",
      list: true,
      args: {
        orderBy: arg({
          // FIXME?
          type: "ExerciseCompletionOrderByInput",
          required: false,
        }),
      },
      resolve: async (parent, args, ctx: NexusContext) => {
        const { orderBy } = args

        return ctx.db.exercise
          .findOne({ where: { id: parent.id } })
          .exercise_completions({
            where: {
              // @ts-ignore: context typing problem, FIXME
              user_id: ctx?.user?.id, // { id: ctx?.user?.id },
            },
            orderBy: filterNull(orderBy) ?? undefined,
          })
      },
    })
  },
})

export const ExerciseQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("exercise", {
      type: "Exercise",
      args: {
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) =>
        ctx.db.exercise.findOne({
          where: { id },
        }),
    })

    t.crud.exercises({
      authorize: isAdmin,
    })

    /*t.list.field("exercises", {
      type: "exercise",
      resolve: (_, __, ctx) => {
        checkAccess(ctx)
        return ctx.db.exercise.findMany()
      },
    })*/
  },
})

export const ExerciseMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addExercise", {
      type: "Exercise",
      args: {
        custom_id: stringArg(),
        name: stringArg(),
        part: intArg(),
        section: intArg(),
        max_points: intArg(),
        course: idArg(),
        service: idArg(),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const {
          custom_id,
          name,
          part,
          section,
          max_points,
          course,
          service,
        } = args

        ctx.db
        return ctx.db.exercise.create({
          data: {
            course: course ? { connect: { id: course } } : undefined,
            service: service ? { connect: { id: service } } : undefined,
            custom_id: custom_id ?? "",
            name,
            max_points,
            part,
            section,
          },
        })
      },
    })
  },
})
