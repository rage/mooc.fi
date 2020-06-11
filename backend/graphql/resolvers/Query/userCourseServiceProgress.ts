import { idArg, intArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("UserCourseServiceProgress", {
      type: "user_course_service_progress",
      args: {
        user_id: idArg(),
        course_id: idArg(),
        service_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        // checkAccess(ctx)
        const { user_id, course_id, service_id } = args
        const result = await ctx.db.user_course_service_progress.findMany({
          where: {
            user: user_id,
            course: course_id,
            service: service_id,
          },
        })
        return result[0]
      },
    })

    t.crud.userCourseServiceProgresses({
      filtering: {
        user: true,
        course: true,
        service: true,
      },
      pagination: true,
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
