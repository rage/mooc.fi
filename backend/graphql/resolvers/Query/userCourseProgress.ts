import { UserInputError } from "apollo-server-core"
import { idArg, intArg, stringArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseProgress", {
      type: "user_course_progress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
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

    // FIXME: (?) broken until the nexus json thing is fixed or smth

    /*t.crud.userCourseProgresses({
      filtering: {
        user: true,
        course_courseTouser_course_progress: true,
      },
      pagination: true,
    })*/

    t.list.field("userCourseProgresses", {
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
        // checkAccess(ctx)
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
          first: first ?? undefined,
          last: last ?? undefined,
          before: before ? { id: before } : undefined,
          after: after ? { id: after } : undefined,
          where: {
            user: user_id,
            course_courseTouser_course_progress: {
              OR: [
                {
                  id: course_id ?? undefined,
                },
                {
                  slug: course_slug ?? undefined,
                },
              ],
            },
          },
        })
      },
    })
  },
})
