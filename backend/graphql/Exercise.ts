import {
  objectType,
  extendType,
  arg,
  idArg,
  intArg,
  stringArg,
  nonNull,
  nullable,
} from "nexus"
import { Prisma } from "@prisma/client"
import { isAdmin, Role } from "../accessControl"
import { filterNull } from "../util/db-functions"
import { Context } from "/context"
import { AuthenticationError } from "apollo-server-core"

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

    t.list.field("exercise_completions", {
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
          throw new AuthenticationError("not logged in")
        }
        return ctx.prisma.exercise
          .findUnique({ where: { id: parent.id } })
          .exercise_completions({
            where: {
              // @ts-ignore: context typing problem, FIXME
              user_id,
            },
            orderBy:
              (filterNull(orderBy) as Prisma.ExerciseCompletionOrderByInput) ??
              undefined,
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
        await ctx.prisma.exercise.findUnique({
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
        const {
          custom_id,
          name,
          part,
          section,
          max_points,
          course,
          service,
        } = args

        ctx.prisma
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
