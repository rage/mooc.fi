import { objectType, extendType, idArg, arg, nonNull } from "nexus"

import { isAdmin } from "../accessControl"

export const UserCourseServiceProgress = objectType({
  name: "UserCourseServiceProgress",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    // t.model.progress()
    t.model.service_id()
    t.model.service()
    t.model.timestamp()
    t.model.user_id()
    t.model.user()
    t.model.user_course_progress_id()
    t.model.user_course_progress()
    t.model.course_id()
    t.model.course()

    t.list.field("progress", {
      type: "Json",
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
    t.nullable.field("userCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        user_id: idArg(),
        course_id: idArg(),
        service_id: idArg(),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id, course_id, service_id } = args

        if (course_id) {
          return (
            await ctx.prisma.course
              .findUnique({
                where: { id: course_id },
              })
              .user_course_service_progresses({
                where: {
                  user_id,
                  service_id,
                },
                orderBy: { created_at: "asc" },
              })
          )?.[0]
        }

        if (service_id) {
          return (
            await ctx.prisma.service
              .findUnique({
                where: { id: service_id },
              })
              .user_course_service_progresses({
                where: {
                  user_id,
                },
                orderBy: { created_at: "asc" },
              })
          )?.[0]
        }

        if (user_id) {
          return (
            await ctx.prisma.user
              .findUnique({
                where: { id: user_id },
              })
              .user_course_service_progresses({
                orderBy: { created_at: "asc" },
              })
          )?.[0]
        }

        return ctx.prisma.userCourseServiceProgress.findFirst({
          where: {
            user_id: user_id,
            course_id: course_id,
            service_id: service_id,
          },
          orderBy: { created_at: "asc" },
        })
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
    })
    /*t.list.field("UserCourseServiceProgresses", {
      type: "user_course_service_progress",
      args: {
        user_id: schema.idArg(),
        course_id: schema.idArg(),
        service_id: schema.idArg(),
        first: schema.intArg(),
        after: schema.idArg(),
        last: schema.intArg(),
        before: schema.idArg(),
      },
      resolve: (_, args, ctx) => {
        checkAccess(ctx)
        const {
          user_id,
          course_id,
          service_id,
          first,
          last,
          before,
          after,
        } = args
        return ctx.prisma.user_course_service_progress.findMany({
          where: {
            user: user_id,
            course: course_id,
            service: service_id,
          },
          first,
          last,
          before: { id: before },
          after: { id: after },
        })
      },
    })*/
  },
})

/********************** MUTATIONS *********************/

export const UserCourseServiceProgressMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        progress: nonNull(arg({ type: "PointsByGroup" })),
        service_id: nonNull(idArg()),
        user_course_progress_id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { service_id, progress, user_course_progress_id } = args

        const course = await ctx.prisma.userCourseProgress
          .findUnique({ where: { id: user_course_progress_id } })
          .course()
        const user = await ctx.prisma.userCourseProgress
          .findUnique({ where: { id: user_course_progress_id } })
          .user()

        if (!course || !user) {
          throw new Error("course or user not found")
        }

        return ctx.prisma.userCourseServiceProgress.create({
          data: {
            course: {
              connect: { id: course.id },
            },
            progress: progress,
            service: {
              connect: { id: service_id },
            },
            user: {
              connect: { id: user.id },
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
