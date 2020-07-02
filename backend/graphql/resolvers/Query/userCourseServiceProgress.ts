import { idArg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

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
