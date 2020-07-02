import { schema } from "nexus"
import { arg, idArg } from "@nexus/schema"
import { isAdmin } from "../accessControl"

schema.objectType({
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
        const res = await ctx.db.userCourseServiceProgress.findOne({
          where: { id: parent.id },
          select: { progress: true },
        })

        return (res?.progress as any) ?? [] // errors without any typing - JSON value thing
      },
    })
  },
})

/*********************** QUERIES **********************/

schema.extendType({
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
        const result = await ctx.db.userCourseServiceProgress.findMany({
          where: {
            user_id: user_id,
            course_id: course_id,
            service_id: service_id,
          },
        })
        return result[0]
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
        user_id: idArg(),
        course_id: idArg(),
        service_id: idArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
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
        return ctx.db.user_course_service_progress.findMany({
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

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        progress: arg({ type: "PointsByGroup", required: true }),
        service_id: idArg({ required: true }),
        user_course_progress_id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { service_id, progress, user_course_progress_id } = args

        const course = await ctx.db.userCourseProgress
          .findOne({ where: { id: user_course_progress_id } })
          .course()
        const user = await ctx.db.userCourseProgress
          .findOne({ where: { id: user_course_progress_id } })
          .user()

        if (!course || !user) {
          throw new Error("course or user not found")
        }

        return ctx.db.userCourseServiceProgress.create({
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
