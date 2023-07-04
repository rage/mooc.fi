import { arg, extendType, idArg, nonNull, objectType } from "nexus"

import { isAdmin } from "../accessControl"
import { GraphQLUserInputError } from "../lib/errors"

export const UserCourseServiceProgress = objectType({
  name: "UserCourseServiceProgress",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.progress()
    t.model.service_id()
    t.model.service()
    t.model.timestamp()
    t.model.user_id()
    t.model.user()
    t.model.user_course_progress_id()
    t.model.user_course_progress()
    t.model.course_id()
    t.model.course()

    /*t.list.field("progress", {
      type: "JSON",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.prisma.userCourseServiceProgress.findUnique({
          where: { id: parent.id },
          select: { progress: true },
        })

        return (res?.progress as any) ?? [] // errors without any typing - JSON value thing
      },
    })*/

    t.nonNull.list.nonNull.field("points_by_group", {
      type: "PointsByGroup",
      resolve: async (parent, _args, ctx) => {
        const res = await ctx.prisma.userCourseServiceProgress.findUnique({
          where: { id: parent.id },
          select: { progress: true },
        })

        return (res?.progress as any) ?? [] // errors without any typing - JSON value thing
      },
    })
  },
})

/*********************** QUERIES **********************/

export const UserCourseServiceProgressQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        user_id: idArg(),
        course_id: idArg(),
        service_id: idArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id, course_id, service_id } = args

        let baseQuery

        if (user_id) {
          baseQuery = ctx.prisma.user.findUnique({
            where: { id: user_id },
          })
        } else if (course_id) {
          baseQuery = ctx.prisma.course.findUnique({
            where: { id: course_id },
          })
        } else if (service_id) {
          baseQuery = ctx.prisma.service.findUnique({
            where: { id: service_id },
          })
        }
        if (!baseQuery) {
          throw new GraphQLUserInputError(
            "provide at least one of user_id, course_id, service_id",
            ["user_id", "course_id", "service_id"],
          )
        }

        const progresses = await baseQuery.user_course_service_progresses({
          where: {
            course_id,
            service_id,
            user_id,
          },
          orderBy: { created_at: "asc" },
          take: 1,
        })

        return progresses?.[0] ?? null
      },
    })

    t.crud.userCourseServiceProgresses({
      filtering: {
        user_id: true,
        course_id: true,
        service_id: true,
      },
      pagination: true,
      authorize: isAdmin,
      resolve: async (root, args, ctx, info, originalResolve) => {
        return originalResolve(
          root,
          {
            ...args,
            // TODO: does this work?
            // @ts-ignore: not typed correctly probably, will work though
            distinct: ["user_id", "course_id", "service_id"],
            orderBy: { created_at: "asc" },
          },
          ctx,
          info,
        )
      },
    })
  },
})

/********************** MUTATIONS *********************/

export const UserCourseServiceProgressMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        progress: nonNull(arg({ type: "PointsByGroupInput" })),
        service_id: nonNull(idArg()),
        user_course_progress_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { service_id, progress, user_course_progress_id } = args

        const { course_id, user_id } =
          (await ctx.prisma.userCourseProgress.findUnique({
            where: { id: user_course_progress_id },
            select: {
              course_id: true,
              user_id: true,
            },
          })) ?? {}

        if (!course_id || !user_id) {
          throw new GraphQLUserInputError(
            "user course progress not found or not connected to course or user",
          )
        }

        return ctx.prisma.userCourseServiceProgress.create({
          data: {
            course: {
              connect: { id: course_id },
            },
            progress,
            service: {
              connect: { id: service_id },
            },
            user: {
              connect: { id: user_id },
            },
            user_course_progress: {
              connect: { id: user_course_progress_id },
            },
          },
        })
      },
    })
  },
})
