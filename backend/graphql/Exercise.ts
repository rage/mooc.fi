import {
  arg,
  extendType,
  idArg,
  intArg,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"

import { isAdmin, Role } from "../accessControl"
import { GraphQLAuthenticationError } from "../lib/errors"
import { notEmpty } from "../util/notEmpty"
import { Context } from "/context"

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

    t.list.nonNull.field("exercise_completions", {
      type: "ExerciseCompletion",
      args: {
        orderBy: nullable(
          arg({
            // FIXME?
            type: "ExerciseCompletionOrderByInput",
          }),
        ),
        user_id: nullable(idArg()),
      },
      resolve: async (parent, args, ctx: Context) => {
        const { orderBy, user_id: user_id_arg } = args
        const isAdmin = ctx.role === Role.ADMIN
        const user_id = isAdmin && user_id_arg ? user_id_arg : ctx?.user?.id

        if (!user_id) {
          throw new GraphQLAuthenticationError("not logged in")
        }
        return ctx.prisma.exercise
          .findUnique({ where: { id: parent.id } })
          .exercise_completions({
            where: {
              user_id,
            },
            distinct: ["user_id", "exercise_id"],
            orderBy: [
              { timestamp: "desc" },
              { updated_at: "desc" },
              orderBy,
            ].filter(notEmpty),
          })
      },
    })
  },
})

export const ExerciseQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("exercise", {
      type: "Exercise",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) =>
        ctx.prisma.exercise.findUnique({
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
        return ctx.prisma.exercise.findMany()
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
        const { custom_id, name, part, section, max_points, course, service } =
          args

        return ctx.prisma.exercise.create({
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
