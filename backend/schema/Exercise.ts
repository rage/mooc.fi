import {
  arg,
  booleanArg,
  extendType,
  idArg,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { Prisma } from "@prisma/client"

import { isAdmin, Role } from "../accessControl"
import { GraphQLAuthenticationError } from "../lib/errors"
import { filterNullRecursive, isDefined } from "../util"
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
        orderBy: list(
          nonNull(
            arg({
              type: "ExerciseCompletionOrderByWithRelationAndSearchRelevanceInput",
            }),
          ),
        ),
        user_id: idArg(),
        completed: booleanArg(),
        attempted: booleanArg(),
      },
      resolve: async (parent, args, ctx: Context) => {
        const { orderBy, user_id: user_id_arg, completed, attempted } = args
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
              ...(completed && { completed: true }),
              ...(attempted && { attempted: true }),
            },
            distinct: ["user_id", "exercise_id"],
            orderBy: [
              { timestamp: "desc" },
              { updated_at: "desc" },
              ...(filterNullRecursive(orderBy) ?? []),
            ].filter(
              isDefined,
            ) as Prisma.Enumerable<Prisma.ExerciseCompletionOrderByWithRelationAndSearchRelevanceInput>,
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
            ...(course && { course: { connect: { id: course } } }),
            ...(service && { service: { connect: { id: service } } }),
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
