import { UserInputError, ForbiddenError } from "apollo-server-core"
import { idArg, intArg, stringArg } from "@nexus/schema"
// import checkAccess from "../../../accessControl"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("UserCourseProgress", {
      type: "user_course_progress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        /*if (!ctx?.user?.administrator) {
          throw new ForbiddenError("Access Denied")
        }*/
        const { user_id, course_id } = args
        const result = await ctx.db.user_course_progress.findMany({
          where: {
            user: user_id,
            course: course_id,
          },
        })
        if (!result.length) throw new UserInputError("Not found")
        return result[0]
      },
    })

    t.crud.userCourseProgresses({
      filtering: {
        user: true,
        course_courseTouser_course_progress: true,
      },
      pagination: true,
    })

    /*t.list.field("UserCourseProgresses", {
      type: "user_course_progress",
      args: {
        user_id: idArg(),
        course_slug: stringArg(),
        course_id: idArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: (_, args, ctx) => {
        checkAccess(ctx)
        const {
          first,
          last,
          before,
          after,
          user_id,
          course_id,
          course_slug,
        } = args
        return ctx.db.user_course_progress.findMany({
          first: first,
          last: last,
          before: { id: before },
          after: { id: after },
          where: {
            user: user_id,
            course_courseTouser_course_progress: {
              OR: [{
                id: course_id
              }, {
                slug: course_slug
              }]
            }
          },
        })
      },
    })*/
  },
})
